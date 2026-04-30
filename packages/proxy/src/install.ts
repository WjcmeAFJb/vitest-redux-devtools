/**
 * Side-effect import: installs the standard Redux DevTools globals so that
 * any code under test (e.g. RTK's `configureStore`) connects automatically.
 *
 *   import '@vitest-redux-devtools/proxy/install'
 *
 * Reads `REDUX_DEVTOOLS_HOST` / `REDUX_DEVTOOLS_PORT` from env.
 *
 * Note on Node environments: RTK's `configureStore` checks
 * `typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__`
 * — a literal `window` reference, not `globalThis`. In plain Node Vitest
 * (no jsdom/happy-dom), `window` is undefined, so RTK silently skips
 * devtools wiring. We set `globalThis.window = globalThis` when it isn't
 * already defined to satisfy that check. If your test environment already
 * provides `window` (jsdom/happy-dom), we leave it alone and just attach
 * the globals to it.
 */
import { composeWithDevTools, devToolsEnhancer, type DevToolsOptions } from './index.js'

declare global {
  // eslint-disable-next-line no-var
  var __REDUX_DEVTOOLS_EXTENSION__: ((opts?: DevToolsOptions) => unknown) | undefined
  // eslint-disable-next-line no-var
  var __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: ((opts?: DevToolsOptions) => unknown) | undefined
}

const g = globalThis as any

if (typeof g.window === 'undefined') {
  g.window = g
}

const target = g.window

if (!target.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  target.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = (opts: DevToolsOptions = {}) =>
    composeWithDevTools(opts)
}

if (!target.__REDUX_DEVTOOLS_EXTENSION__) {
  target.__REDUX_DEVTOOLS_EXTENSION__ = (opts: DevToolsOptions = {}) => devToolsEnhancer(opts)
}
