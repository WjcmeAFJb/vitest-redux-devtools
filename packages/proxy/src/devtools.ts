import { instrument } from '@redux-devtools/instrument'
import { create as createSocket, type AGClientSocket } from 'socketcluster-client'
import { stringify, parse } from 'jsan'
import type { Action, Reducer, Store, StoreEnhancer, StoreEnhancerStoreCreator } from 'redux'

export interface DevToolsOptions {
  hostname?: string
  port?: number
  secure?: boolean
  name?: string
  realtime?: boolean
  maxAge?: number
  /** Suppress noisy connection-error logging when no server is listening. Default true. */
  suppressConnectErrors?: boolean
}

interface LiftedStore {
  getState(): any
  dispatch(action: any): unknown
  subscribe(listener: () => void): () => void
}
interface InstrumentedStore extends Store {
  liftedStore: LiftedStore
}

interface SessionState {
  socket?: AGClientSocket
  channel?: string
  store?: InstrumentedStore
  instanceName: string
  started: boolean
  isMonitored: boolean
  lastAction?: string
  isExcess: boolean
  paused: boolean
  locked: boolean
  suppressConnectErrors: boolean
  errorReported: boolean
}

const session: SessionState = {
  instanceName: 'Vitest',
  started: false,
  isMonitored: false,
  isExcess: false,
  paused: false,
  locked: false,
  suppressConnectErrors: true,
  errorReported: false,
}

function relay(type: string, state?: unknown, action?: unknown, nextActionId?: number) {
  const socket = session.socket
  if (!socket) return
  const message: Record<string, unknown> = {
    type,
    id: socket.id,
    name: session.instanceName,
  }
  if (state !== undefined) {
    message.payload = type === 'ERROR' ? state : stringify(state)
  }
  if (type === 'ACTION') {
    message.action = stringify(action)
    message.isExcess = session.isExcess
    message.nextActionId = nextActionId
  } else if (action) {
    message.action = action
  }
  socket.transmit(socket.id ? 'log' : 'log-noid', message)
}

function dispatchRemotely(rawAction: unknown) {
  // The DevTools UI sends actions as either an object or a JSON-serialized
  // string. We dispatch them directly. Function-style action evaluation
  // (`evalAction`) is intentionally not supported here — it requires
  // un-sandboxed `eval` of strings sent over the wire.
  const store = session.store
  if (!store) return
  try {
    const action = typeof rawAction === 'string' ? parse(rawAction) : rawAction
    if (action && typeof action === 'object' && 'type' in (action as object)) {
      store.dispatch(action as Action)
    }
  } catch (e) {
    relay('ERROR', (e as Error).message)
  }
}

function handleMessage(msg: any) {
  const store = session.store
  if (!store) return
  switch (msg?.type) {
    case 'IMPORT':
    case 'SYNC':
      if (session.socket?.id && msg.id !== session.socket.id) {
        store.liftedStore.dispatch({
          type: 'IMPORT_STATE',
          nextLiftedState: parse(msg.state),
        })
      }
      break
    case 'UPDATE':
      relay('STATE', store.liftedStore.getState())
      break
    case 'START':
      session.isMonitored = true
      relay('STATE', store.liftedStore.getState())
      break
    case 'STOP':
    case 'DISCONNECTED':
      session.isMonitored = false
      relay('STOP')
      break
    case 'DISPATCH':
      store.liftedStore.dispatch(msg.action)
      break
    case 'ACTION':
      dispatchRemotely(msg.action)
      break
  }
}

async function startConnection(opts: DevToolsOptions) {
  const socket = createSocket({
    hostname: opts.hostname ?? 'localhost',
    port: opts.port ?? 8765,
    secure: opts.secure ?? false,
    autoReconnect: true,
  })
  session.socket = socket

  void (async () => {
    for await (const e of socket.listener('error')) {
      if (session.suppressConnectErrors) {
        if (!session.errorReported) {
          session.errorReported = true
          // eslint-disable-next-line no-console
          console.warn(
            '[redux-devtools-proxy] no server reachable yet. Open the VSCode panel to connect; further errors silenced.',
          )
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('[redux-devtools-proxy] socket error:', e.error?.message ?? e)
      }
    }
  })()

  void (async () => {
    for await (const _ of socket.listener('connect')) {
      session.errorReported = false
      try {
        const channelName = (await socket.invoke('login', 'master')) as string
        session.channel = channelName
        session.started = true

        // Channel publishes (dispatched by other clients via the broker).
        void (async () => {
          const ch = socket.subscribe(channelName)
          for await (const data of ch) handleMessage(data)
        })()
        // Direct point-to-point transmits to this socket id.
        void (async () => {
          for await (const data of socket.receiver(channelName)) handleMessage(data)
        })()

        relay('START')
      } catch (e) {
        if (!session.suppressConnectErrors) {
          // eslint-disable-next-line no-console
          console.warn('[redux-devtools-proxy] login failed:', (e as Error)?.message ?? e)
        }
      }
    }
  })()

  void (async () => {
    for await (const _ of socket.listener('disconnect')) {
      session.started = false
      session.isMonitored = false
    }
  })()
}

function makeMonitorReducer(): Reducer<null, Action<string>> {
  return (state, action) => {
    session.lastAction = action?.type
    return state ?? null
  }
}

function onLiftedChange(maxAge: number) {
  const store = session.store!
  const liftedState = store.liftedStore.getState()
  if (session.lastAction === 'PERFORM_ACTION') {
    const nextActionId: number = liftedState.nextActionId
    const liftedAction = liftedState.actionsById[nextActionId - 1]
    relay('ACTION', store.getState(), liftedAction, nextActionId)
    if (!session.isExcess) {
      session.isExcess = liftedState.stagedActionIds.length >= maxAge
    }
  } else if (session.lastAction === 'JUMP_TO_STATE') {
    return
  } else {
    relay('STATE', liftedState)
  }
}

export function devToolsEnhancer(opts: DevToolsOptions = {}): StoreEnhancer {
  session.instanceName = opts.name ?? 'Vitest'
  session.suppressConnectErrors = opts.suppressConnectErrors ?? true
  const maxAge = opts.maxAge ?? 50
  const realtime = opts.realtime ?? true

  const instrumented = instrument(makeMonitorReducer(), { maxAge }) as StoreEnhancer

  return ((next: StoreEnhancerStoreCreator) =>
    (reducer: Reducer, preloadedState?: unknown) => {
      const store = instrumented(next)(reducer, preloadedState) as InstrumentedStore
      session.store = store
      if (realtime) {
        store.liftedStore.subscribe(() => onLiftedChange(maxAge))
        void startConnection(opts)
      }
      return store
    }) as StoreEnhancer
}

type ComposeFn = (...enhancers: StoreEnhancer[]) => StoreEnhancer

export function composeWithDevTools(opts: DevToolsOptions = {}): ComposeFn {
  return (...enhancers: StoreEnhancer[]): StoreEnhancer => {
    const dt = devToolsEnhancer(opts)
    if (enhancers.length === 0) return dt
    // Order matters: `instrument` (inside `dt`) must be the innermost wrapper,
    // so user enhancers (e.g. RTK's `applyMiddleware`) sit *around* it. That
    // way middleware sees the user-facing store, not the lifted store. If we
    // composed user enhancers *inside* `dt`, RTK's immutability-check
    // middleware would trip on `actionsById` mutations in the lifted state.
    return ((createStore: StoreEnhancerStoreCreator) => {
      const instrumentedCreator = dt(createStore) as StoreEnhancerStoreCreator
      const wrapped = enhancers.reduceRight<StoreEnhancerStoreCreator>(
        (acc, e) => e(acc) as StoreEnhancerStoreCreator,
        instrumentedCreator,
      )
      return wrapped
    }) as StoreEnhancer
  }
}
