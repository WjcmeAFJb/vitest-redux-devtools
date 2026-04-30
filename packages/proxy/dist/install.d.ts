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
import { type DevToolsOptions, type ConnectOptions } from './index.js';
declare global {
    interface ReduxDevToolsExtension {
        (opts?: DevToolsOptions): unknown;
        connect(opts?: ConnectOptions): unknown;
        disconnect(): void;
    }
    var __REDUX_DEVTOOLS_EXTENSION__: ReduxDevToolsExtension | undefined;
    var __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: ((opts?: DevToolsOptions) => unknown) | undefined;
}
//# sourceMappingURL=install.d.ts.map