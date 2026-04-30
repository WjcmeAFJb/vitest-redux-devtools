/**
 * Side-effect import: installs the standard Redux DevTools globals so that
 * any code under test (RTK's `configureStore`, MobX bindings, Zustand,
 * custom integrations) connects automatically.
 *
 *   import '@vitest-redux-devtools/proxy/install'
 *
 * Globals installed (matching the browser extension's surface):
 *   window.__REDUX_DEVTOOLS_EXTENSION__(opts)            → enhancer
 *   window.__REDUX_DEVTOOLS_EXTENSION__.connect(opts)    → DevToolsConnection
 *   window.__REDUX_DEVTOOLS_EXTENSION__.disconnect()     → no-op (browser-compat)
 *   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(opts)    → compose-like
 *
 * Reads `REDUX_DEVTOOLS_HOST` / `REDUX_DEVTOOLS_PORT` from env. Sets
 * `globalThis.window = globalThis` if no `window` is defined (RTK does a
 * literal `typeof window !== 'undefined'` check).
 */
import { composeWithDevTools, devToolsEnhancer, connect } from './index.js';
const g = globalThis;
if (typeof g.window === 'undefined') {
    g.window = g;
}
const target = g.window;
if (!target.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    target.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = (opts = {}) => composeWithDevTools(opts);
}
if (!target.__REDUX_DEVTOOLS_EXTENSION__) {
    const fn = ((opts = {}) => devToolsEnhancer(opts));
    fn.connect = (opts = {}) => connect(opts);
    fn.disconnect = () => {
        // The browser extension's disconnect is per-tab; in our process every
        // connection has its own `connection.disconnect()` call. We expose the
        // global hook for API parity but it's a no-op — callers who need
        // cleanup should call `connection.disconnect()` on the instance.
    };
    target.__REDUX_DEVTOOLS_EXTENSION__ = fn;
}
//# sourceMappingURL=install.js.map