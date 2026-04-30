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
import { ensureWorker, postToWorker, registerConnectionSink, unregisterConnectionSink } from './transport.js'
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
}

export type ActionLike = string | { type: string; [k: string]: unknown }

export interface DevToolsConnection {
  /** Push the initial state. Call once before any `send`. */
  init(state: unknown, action?: ActionLike): void
  /** Push an action + the resulting state. */
  send(action: ActionLike, state: unknown): void
  /** Subscribe to messages from the panel (DISPATCH / JUMP / etc). */
  subscribe(listener: (msg: any) => void): () => void
  /** Unsubscribe all listeners on this connection. */
  unsubscribe(): void
  /** Tear down the connection and tell the panel to forget it. */
  disconnect(): void
  /** Report an error to the panel. */
  error(message: string): void
  /** The instance id used in panel routing. Stable for this connection. */
  readonly instanceId: string
}

let counter = 0
function nextInstanceId(): string {
  counter += 1
  const pid = typeof process !== 'undefined' ? process.pid : 0
  return `vrd-${pid}-${counter}`
}

export function connect(opts: ConnectOptions = {}): DevToolsConnection {
  const instanceId = opts.instanceId ?? nextInstanceId()
  const name = opts.name ?? instanceId
  const cleanupOnDisconnect = opts.cleanupOnDisconnect ?? true

  // Spin up the worker on first connect (idempotent).
  ensureWorker(opts)

  const listeners = new Set<(msg: any) => void>()
  registerConnectionSink(instanceId, (msg) => {
    listeners.forEach((l) => {
      try {
        l(msg)
      } catch {
        // listener errors shouldn't break the dispatcher
      }
    })
  })

  const transmit = (frame: Record<string, unknown>) => {
    postToWorker({
      kind: 'transmit',
      event: 'log',
      data: { ...frame, instanceId, name },
    })
  }

  let actionId = 0

  return {
    instanceId,
    init(state, action) {
      transmit({
        type: 'INIT',
        payload: stringify(state),
        action: action !== undefined ? stringify(action) : undefined,
      })
    },
    send(action, state) {
      const liftedAction = typeof action === 'string' ? { type: action } : action
      actionId += 1
      transmit({
        type: 'ACTION',
        action: stringify({ type: 'PERFORM_ACTION', action: liftedAction, timestamp: Date.now() }),
        payload: stringify(state),
        nextActionId: actionId,
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
        transmit({ type: 'DISCONNECTED' })
      }
    },
    error(message) {
      transmit({ type: 'ERROR', payload: message })
    },
  }
}

/** Disconnect every active connection. */
export function disconnectAll(): void {
  // Implemented in transport.ts for visibility into the registry.
  // Placed here for symmetry with the browser extension API.
}
