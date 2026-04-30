/**
 * Shared worker-thread transport. Both the Redux instrument enhancer
 * (`devtools.ts`) and the `connect()` API (`connect.ts`) post through
 * here so a single SocketCluster connection backs all of them.
 */
import { Worker, MessageChannel, receiveMessageOnPort, type MessagePort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import type { DevToolsOptions } from './devtools.js'

type WorkerInMessage =
  | { kind: 'connect'; options: { hostname: string; port: number; secure?: boolean } }
  | { kind: 'sync-port'; port: MessagePort }
  | { kind: 'transmit'; event: string; data: unknown }
  | { kind: 'shutdown' }

type WorkerOutMessage =
  | { kind: 'connected'; id: string }
  | { kind: 'wake' }
  | { kind: 'disconnected' }
  | { kind: 'error'; message: string }

type DrainableMessage =
  | { kind: 'message'; data: any }

interface TransportState {
  worker?: Worker
  syncPort?: MessagePort
  socketId?: string
  errorReported: boolean
  suppressConnectErrors: boolean
}

const state: TransportState = {
  errorReported: false,
  suppressConnectErrors: true,
}

/** Subscribers keyed by instanceId (for the connect() API). */
const connectionSinks = new Map<string, (msg: any) => void>()

/** Untargeted handler: gets messages with no `instanceId` (Redux enhancer). */
let defaultSink: ((msg: any) => void) | undefined

export function registerConnectionSink(instanceId: string, sink: (msg: any) => void) {
  connectionSinks.set(instanceId, sink)
}

export function unregisterConnectionSink(instanceId: string) {
  connectionSinks.delete(instanceId)
}

export function setDefaultSink(sink: (msg: any) => void) {
  defaultSink = sink
}

export function getSocketId(): string | undefined {
  return state.socketId
}

export function postToWorker(msg: WorkerInMessage) {
  state.worker?.postMessage(msg)
}

interface ConnectedListener {
  (id: string): void
}
const connectedListeners = new Set<ConnectedListener>()

export function onConnected(cb: ConnectedListener): () => void {
  connectedListeners.add(cb)
  if (state.socketId) cb(state.socketId)
  return () => connectedListeners.delete(cb)
}

export function ensureWorker(opts: DevToolsOptions) {
  if (state.worker) return
  state.suppressConnectErrors = opts.suppressConnectErrors ?? true

  const workerPath = fileURLToPath(new URL('./worker.js', import.meta.url))
  const worker = new Worker(workerPath)
  state.worker = worker

  worker.on('message', (msg: WorkerOutMessage) => {
    if (msg.kind === 'connected') {
      state.socketId = msg.id
      state.errorReported = false
      connectedListeners.forEach((l) => l(msg.id))
    } else if (msg.kind === 'wake') {
      drainSync()
    } else if (msg.kind === 'disconnected') {
      state.socketId = undefined
    } else if (msg.kind === 'error') {
      if (!state.suppressConnectErrors && !state.errorReported) {
        state.errorReported = true
        // eslint-disable-next-line no-console
        console.warn('[redux-devtools-proxy] worker error:', msg.message)
      }
    }
  })

  worker.on('error', (err) => {
    if (!state.errorReported) {
      state.errorReported = true
      // eslint-disable-next-line no-console
      console.warn('[redux-devtools-proxy] worker thread crashed:', err.message)
    }
  })

  worker.unref()

  // Set up the synchronous drain port. The worker writes every panel
  // message to this port; the main thread can pull them off via
  // `receiveMessageOnPort`, which works even when the event loop is
  // parked on a debugger breakpoint. This is what makes the
  // `__REDUX_DEVTOOLS_UPDATE__()` debug-console hook work.
  const channel = new MessageChannel()
  state.syncPort = channel.port1
  worker.postMessage({ kind: 'sync-port', port: channel.port2 }, [channel.port2])

  postToWorker({
    kind: 'connect',
    options: {
      hostname: opts.hostname ?? 'localhost',
      port: opts.port ?? 8765,
      secure: opts.secure ?? false,
    },
  })

  let shutdownSent = false
  const shutdown = () => {
    if (shutdownSent) return
    shutdownSent = true
    try {
      postToWorker({ kind: 'shutdown' })
    } catch {
      // ignore
    }
  }
  process.on('beforeExit', shutdown)
  process.on('exit', shutdown)
}

/**
 * Synchronously pulls every pending DevTools event off the worker's sync
 * port and routes it to the appropriate sink. Safe to call from a
 * debugger console while the event loop is parked — it doesn't yield.
 *
 * Both the wake-event-driven path and the user-callable
 * `__REDUX_DEVTOOLS_UPDATE__()` route through here, so messages aren't
 * processed twice.
 */
export function drainSync(): number {
  const port = state.syncPort
  if (!port) return 0
  let count = 0
  while (true) {
    const next = receiveMessageOnPort(port)
    if (!next) break
    const msg = next.message as DrainableMessage
    if (msg.kind === 'message') {
      route(msg.data)
      count += 1
    }
  }
  return count
}

function route(msg: any) {
  // Panel-issued messages may be targeted at a specific instance via
  // `instanceId`. If they are, deliver only to that connection's
  // subscribers. Otherwise, fall through to the default (Redux enhancer)
  // handler.
  if (msg && typeof msg === 'object' && 'instanceId' in msg) {
    const sink = connectionSinks.get(msg.instanceId as string)
    if (sink) {
      sink(msg)
      return
    }
  }
  defaultSink?.(msg)
}
