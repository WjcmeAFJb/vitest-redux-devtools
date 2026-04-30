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

// ---------------------------------------------------------------------------
// Source-content interception. The proxy embeds source files in each action
// (`_vrdSources: { '/abs/path': '<file content>' }`) and rewrites stack URLs
// to `http://vrd-source/<abs/path>:line:col`. This patched fetch handles
// those URLs entirely client-side, returning the embedded content + a
// synthesized identity sourcemap. The panel's react-error-overlay mapper
// then resolves successfully and renders code previews.
//
// We use this approach instead of an HTTP route because some webview
// environments (notably code-server) inject a strict CSP that blocks all
// network fetches regardless of the meta CSP we set.
// ---------------------------------------------------------------------------
const sourcesMap = new Map<string, string>()
const SOURCE_HOST = 'http://vrd-source'

function buildIdentityMap(absPath: string, contents: string): string {
  const lineCount = contents.split('\n').length
  const mappings = lineCount === 0 ? '' :
    'AAAA' + ';AACA'.repeat(Math.max(0, lineCount - 1))
  return JSON.stringify({
    version: 3,
    file: absPath.split('/').pop() || absPath,
    sources: [absPath],
    sourcesContent: [contents],
    names: [],
    mappings,
  })
}

const origFetch = globalThis.fetch
globalThis.fetch = function patchedFetch(input: any, init?: any) {
  const url = typeof input === 'string' ? input : (input?.url ?? '')
  if (typeof url === 'string' && url.startsWith(SOURCE_HOST)) {
    const after = url.slice(SOURCE_HOST.length)
    const wantsMap = after.endsWith('.map')
    const path = decodeURI(wantsMap ? after.slice(0, -4) : after)
    const content = sourcesMap.get(path)
    if (content === undefined) {
      return Promise.resolve(new Response('', { status: 404 }))
    }
    if (wantsMap) {
      return Promise.resolve(new Response(buildIdentityMap(path, content), {
        headers: { 'content-type': 'application/json' },
      }))
    }
    const withMap = `${content}\n//# sourceMappingURL=${SOURCE_HOST}${encodeURI(path)}.map`
    return Promise.resolve(new Response(withMap, {
      headers: { 'content-type': 'text/plain' },
    }))
  }
  return origFetch(input, init)
}

/** Walks `state.instances.states[*].actionsById[*].action._vrdSources`
 *  on every store change, accumulating into `sourcesMap`. Subscribed
 *  once after the store mounts (see below). */
function collectSources(state: any) {
  const states = state?.instances?.states
  if (!states) return
  for (const inst of Object.values<any>(states)) {
    const byId = inst?.actionsById
    if (!byId) continue
    for (const lifted of Object.values<any>(byId)) {
      const sources = lifted?.action?._vrdSources
      if (!sources) continue
      for (const [k, v] of Object.entries(sources)) {
        if (typeof v === 'string') sourcesMap.set(k, v)
      }
    }
  }
}
;(globalThis as any).__VRD_SOURCES__ = sourcesMap

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

store.subscribe(() => collectSources(store.getState()))

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
