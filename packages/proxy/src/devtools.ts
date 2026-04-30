import { instrument } from '@redux-devtools/instrument'
import { stringify, parse } from 'jsan'
import type { Action, Reducer, Store, StoreEnhancer, StoreEnhancerStoreCreator } from 'redux'
import { ensureWorker, postToWorker, getSocketId, setDefaultSink } from './transport.js'

export interface DevToolsOptions {
  hostname?: string
  port?: number
  secure?: boolean
  name?: string
  realtime?: boolean
  maxAge?: number
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
  store?: InstrumentedStore
  instanceName: string
  isMonitored: boolean
  lastAction?: string
  isExcess: boolean
  paused: boolean
  locked: boolean
}

const session: SessionState = {
  instanceName: 'Vitest',
  isMonitored: false,
  isExcess: false,
  paused: false,
  locked: false,
}

function relay(type: string, state?: unknown, action?: unknown, nextActionId?: number) {
  const message: Record<string, unknown> = {
    type,
    id: getSocketId() ?? null,
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
  postToWorker({ kind: 'transmit', event: 'log', data: message })
}

function dispatchRemotely(rawAction: unknown) {
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
      if (getSocketId() && msg.id !== getSocketId()) {
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

setDefaultSink(handleMessage)

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
  const maxAge = opts.maxAge ?? 50
  const realtime = opts.realtime ?? true

  const instrumented = instrument(makeMonitorReducer(), { maxAge }) as StoreEnhancer

  return ((next: StoreEnhancerStoreCreator) =>
    (reducer: Reducer, preloadedState?: unknown) => {
      const store = instrumented(next)(reducer, preloadedState) as InstrumentedStore
      session.store = store
      if (realtime) {
        store.liftedStore.subscribe(() => onLiftedChange(maxAge))
        ensureWorker(opts)
      }
      return store
    }) as StoreEnhancer
}

type ComposeFn = (...enhancers: StoreEnhancer[]) => StoreEnhancer

export function composeWithDevTools(opts: DevToolsOptions = {}): ComposeFn {
  return (...enhancers: StoreEnhancer[]): StoreEnhancer => {
    const dt = devToolsEnhancer(opts)
    if (enhancers.length === 0) return dt
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
