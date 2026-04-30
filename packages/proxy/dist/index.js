/**
 * Public surface of the proxy package.
 *
 * Internally this re-implements the bridge that `remote-redux-devtools`
 * provides, but using `socketcluster-client@20+` so the wire protocol
 * matches the modern `@redux-devtools/cli` server. The `@redux-devtools/instrument`
 * enhancer holds the lifted action history; the server replays it to the UI
 * on (re)connect, so closing and reopening the VSCode panel preserves the
 * full timeline as long as the test process is still alive.
 */
import { composeWithDevTools as composeImpl, devToolsEnhancer as enhancerImpl, } from './devtools.js';
function readPort() {
    const fromEnv = typeof process !== 'undefined' ? process.env?.REDUX_DEVTOOLS_PORT : undefined;
    const n = fromEnv ? Number(fromEnv) : NaN;
    return Number.isFinite(n) ? n : 8765;
}
function readHost() {
    return (typeof process !== 'undefined' && process.env?.REDUX_DEVTOOLS_HOST) || '127.0.0.1';
}
function withDefaults(opts) {
    return {
        realtime: true,
        name: 'Vitest',
        hostname: readHost(),
        port: readPort(),
        ...opts,
    };
}
export function composeWithDevTools(opts = {}) {
    return composeImpl(withDefaults(opts));
}
export function devToolsEnhancer(opts = {}) {
    return enhancerImpl(withDefaults(opts));
}
/**
 * Block until the user resumes from the panel (or the timeout elapses).
 * Useful for tests that don't want to set a debugger breakpoint.
 */
export function waitForInspect(timeoutMs = 10 * 60_000) {
    return new Promise((resolve) => {
        const start = Date.now();
        const tick = () => {
            const flag = globalThis.__REDUX_DEVTOOLS_RESUME__;
            if (flag || Date.now() - start > timeoutMs)
                resolve();
            else
                setTimeout(tick, 200);
        };
        tick();
    });
}
//# sourceMappingURL=index.js.map