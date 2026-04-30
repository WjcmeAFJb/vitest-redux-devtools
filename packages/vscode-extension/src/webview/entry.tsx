import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
// `App` is the actual UI tree from `@redux-devtools/app-core`. The
// upstream `Root` from `@redux-devtools/app` wraps it in a `Provider` +
// `PersistGate` and provides the persist callback that decides whether to
// auto-connect. We replicate that here so the callback can fire a
// `RECONNECT` against our local SC server when the persisted connection
// is `disabled` — which is what the very first run sees.
import { App } from '@redux-devtools/app-core'
// @ts-expect-error path is aliased in esbuild config
import configureStore from '@redux-devtools/app/configureStore'
// @ts-expect-error same — accessed by deep path
import Connection from '@redux-devtools/app/Connection'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_PORT__?: number
  }
}

const port = window.__REDUX_DEVTOOLS_PORT__ ?? 8765

const container = document.getElementById('root')
if (!container) throw new Error('#root not found')

// Dispatched immediately at store creation: this drives the api middleware
// to call `socketClusterClient.create()` against our server. Doesn't depend
// on the persist callback firing, which can be flaky in sandboxed webviews.
const { store, persistor } = configureStore(() => {}) as { store: any; persistor: any }

store.dispatch({
  type: 'socket/RECONNECT',
  options: { type: 'custom', hostname: '127.0.0.1', port, secure: false },
})

// Re-fire after persistor rehydrates, in case it overwrote our connection
// from cached state with `disabled`.
setTimeout(() => {
  const conn = store.getState().connection
  if (!conn || conn.type === 'disabled' || conn.options?.port !== port) {
    store.dispatch({
      type: 'socket/RECONNECT',
      options: { type: 'custom', hostname: '127.0.0.1', port, secure: false },
    })
  }
}, 1500)

;(window as any).__store = store
;(window as any).__persistor = persistor

createRoot(container).render(
  React.createElement(
    Provider,
    { store } as any,
    React.createElement(
      PersistGate,
      { loading: null, persistor } as any,
      React.createElement(App as any, {
        extraSettingsTabs: [{ name: 'Connection', component: Connection }],
      }),
    ),
  ),
)
