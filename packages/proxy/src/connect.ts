/**
 * `connect()` API surface compatible with the browser Redux DevTools
 * extension. Used by non-Redux integrations (MobX, Zustand, custom state
 * managers) that want to push actions/state to the panel without going
 * through a Redux store.
 *
 *   const devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({ name: 'MyStore' })
 *   devtools.init(initialState)
 *   devtools.send(actionLike, state)
 *   devtools.subscribe(msg => { if (msg.type === 'DISPATCH') … })
 *   devtools.disconnect()
 *
 * Each call returns a fresh connection with its own `instanceId`, so
 * multiple stores can coexist in the panel's instance dropdown.
 */
import { stringify } from 'jsan'
import {
  ensureWorker,
  postToWorker,
  registerConnectionSink,
  unregisterConnectionSink,
} from './transport.js'
import type { DevToolsOptions } from './devtools.js'

export interface ConnectOptions extends DevToolsOptions {
  /** Display name in the panel's instance dropdown. */
  name?: string
  /** Stable instance id. If omitted, a per-process auto-generated one is used. */
  instanceId?: string
  /**
   * If true (default), each new connection emits a `DISCONNECTED` for its
   * instanceId on `disconnect()` so the panel removes the entry. Set to
   * false if you want the previous run's history to linger.
   */
  cleanupOnDisconnect?: boolean
  /**
   * Hint to the panel about the lib backing this connection. Currently
   * just stored on the panel's instance options for display/UX.
   */
  type?: string
  /**
   * Use jsan-style `__serializedType__` wrapping. When true, the panel
   * runs its reviver and renders tagged objects as type-aware
   * collapsibles instead of literal `__serializedType__`/`data`
   * properties. mobx-auto-devtools and similar integrations rely on
   * this.
   */
  serialize?: boolean
  /**
   * Capture a sync stack trace at every `send()` call site. Disabled by
   * default to keep the wire small. When enabled, the panel's "Trace"
   * inspector tab gets a stack for each action.
   */
  trace?: boolean | ((...args: unknown[]) => string | undefined)
  /** Limit on captured stack frames. Default 10. */
  traceLimit?: number
  /** History ring size; replayed when a new panel attaches. Default 50. */
  maxAge?: number
  /** Action creators reflected in the panel's "Dispatch" tab. */
  actionCreators?: unknown
  /** Feature flags reflected in panel buttons. */
  features?: Record<string, boolean>
}

export type ActionLike = string | { type: string; [k: string]: unknown }

export interface DevToolsConnection {
  init(state: unknown, action?: ActionLike): void
  send(action: ActionLike, state: unknown): void
  subscribe(listener: (msg: any) => void): () => void
  unsubscribe(): void
  disconnect(): void
  error(message: string): void
  readonly instanceId: string
}

let counter = 0
function nextInstanceId(): string {
  counter += 1
  const pid = typeof process !== 'undefined' ? process.pid : 0
  return `vrd-${pid}-${counter}`
}

interface CaptureOptions {
  traceLimit: number
  hostname: string
  port: number
}

const NODE_MODULES_RE = /[\\/]node_modules[\\/]/
// Path of *this* file at runtime — used to detect and skip the proxy's
// own frames at the top of every captured stack. Matches when the test
// installs the proxy from the published tarball
// (.../node_modules/@vitest-redux-devtools/proxy/dist/) and from the
// in-workspace source (.../packages/proxy/dist/) alike.
const PROXY_DIR = (() => {
  try {
    const u = new URL('.', import.meta.url)
    return u.pathname.replace(/\/$/, '')
  } catch {
    return ''
  }
})()

// Matches the trailing :line:col on every V8 stack frame. We split each
// line into "head", "path-with-prefix", ":L:C", "tail" so the rewrite
// preserves any wrapping (`fn (file:///abs:1:2)` vs `at file:///abs:1:2`).
const FRAME_LINE_RE = /^(.*?)((?:file:\/\/)?\/[^():\s]+):(\d+):(\d+)(\)?\s*)$/

function rewriteFramePath(line: string, hostname: string, port: number): string {
  const m = line.match(FRAME_LINE_RE)
  if (!m) return line
  const [, head, rawPath, ln, col, tail] = m
  const fsPath = rawPath.startsWith('file://') ? rawPath.slice('file://'.length) : rawPath
  if (!fsPath.startsWith('/')) return line
  return `${head}http://${hostname}:${port}/source${fsPath}:${ln}:${col}${tail}`
}

function isProxyOwnFrame(line: string): boolean {
  if (PROXY_DIR && line.includes(PROXY_DIR)) return true
  // Fallback by file basename in case PROXY_DIR resolution failed.
  return /[\\/](?:connect|devtools|transport|worker|index|install)\.js[:)]/.test(line) &&
    /vitest-redux-devtools[\\/]?proxy|packages[\\/]proxy/.test(line)
}

function captureStack(opts: CaptureOptions): string | undefined {
  const { traceLimit, hostname, port } = opts
  // Capture liberally — actual filtering happens below.
  const prev = Error.stackTraceLimit
  Error.stackTraceLimit = traceLimit * 5 + 20
  const err = new Error()
  Error.stackTraceLimit = prev
  if (!err.stack) return undefined

  const out: string[] = []
  let userCount = 0
  let pastProxy = false
  const lines = err.stack.split('\n')
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!pastProxy) {
      if (isProxyOwnFrame(line)) continue
      pastProxy = true
    }
    const isInternal = NODE_MODULES_RE.test(line)
    out.push(rewriteFramePath(line, hostname, port))
    if (!isInternal) {
      userCount += 1
      if (userCount >= traceLimit) break
    }
  }
  return out.join('\n')
}

export function connect(opts: ConnectOptions = {}): DevToolsConnection {
  const instanceId = opts.instanceId ?? nextInstanceId()
  const name = opts.name ?? instanceId
  const cleanupOnDisconnect = opts.cleanupOnDisconnect ?? true
  const traceLimit = opts.traceLimit ?? 10
  const traceFlag = opts.trace ?? false
  const maxBufferSize = opts.maxAge ?? 50

  // libConfig is what the panel's instances reducer reads from each INIT
  // request to populate `options[instanceId]`. The crucial field is
  // `serialize` — without it, `parseJSON` skips the reviver and tagged
  // objects render as literal `{ __serializedType__, data }` shapes.
  const libConfig = {
    name,
    type: opts.type ?? 'redux',
    serialize: opts.serialize ?? false,
    features: opts.features,
    actionCreators: opts.actionCreators,
  }

  ensureWorker(opts)

  // Per-connection history. Replayed when a new panel attaches and
  // broadcasts START so users see prior actions in a mid-test reopen.
  // Stored as fully-formed transmit frames (sans instanceId/name, which
  // are stamped at flush time).
  const history: Record<string, unknown>[] = []

  function bufferAdd(frame: Record<string, unknown>) {
    if (frame.type === 'INIT') {
      history.length = 0
      history.push(frame)
    } else {
      history.push(frame)
      const overflow = history.length - (maxBufferSize + 1)
      if (overflow > 0) history.splice(1, overflow)
    }
  }

  const listeners = new Set<(msg: any) => void>()
  registerConnectionSink(instanceId, (msg) => {
    if (msg?.type === 'START') {
      // Replay buffered history so the new panel sees everything.
      for (const frame of history) {
        postToWorker({
          kind: 'transmit',
          event: 'log',
          data: { ...frame, instanceId, name },
        })
      }
    }
    listeners.forEach((l) => {
      try {
        l(msg)
      } catch {
        // user listener errors shouldn't break the dispatcher
      }
    })
  })

  function flush(frame: Record<string, unknown>) {
    bufferAdd(frame)
    postToWorker({
      kind: 'transmit',
      event: 'log',
      data: { ...frame, instanceId, name },
    })
  }

  const hostname = opts.hostname ?? '127.0.0.1'
  const port = opts.port ?? 8765

  function makeStack(): string | undefined {
    if (!traceFlag) return undefined
    if (typeof traceFlag === 'function') {
      try {
        return traceFlag()
      } catch {
        return undefined
      }
    }
    return captureStack({ traceLimit, hostname, port })
  }

  return {
    instanceId,
    init(state, action) {
      flush({
        type: 'INIT',
        payload: stringify(state),
        action: action !== undefined ? stringify(action) : undefined,
        libConfig,
      })
    },
    send(action, state) {
      const liftedAction = typeof action === 'string' ? { type: action } : action
      const stack = makeStack()
      flush({
        type: 'ACTION',
        action: stringify({
          type: 'PERFORM_ACTION',
          action: liftedAction,
          timestamp: Date.now(),
          stack,
        }),
        payload: stringify(state),
      })
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    unsubscribe() {
      listeners.clear()
    },
    disconnect() {
      listeners.clear()
      unregisterConnectionSink(instanceId)
      if (cleanupOnDisconnect) {
        postToWorker({
          kind: 'transmit',
          event: 'log',
          data: { type: 'DISCONNECTED', instanceId, name },
        })
      }
    },
    error(message) {
      flush({ type: 'ERROR', payload: message })
    },
  }
}

export function disconnectAll(): void {
  // Reserved for symmetry with the browser extension's global hook.
}
