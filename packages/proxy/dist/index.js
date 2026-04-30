/**
 * Public surface of the proxy package.
 *
 * All transport flows through a `node:worker_threads` worker that owns the
 * SocketCluster client (see `transport.ts` + `worker.ts`). The worker has
 * its own event loop, so the WS handshake completes and queued action
 * transmits flush even while the test thread is parked at a debugger
 * breakpoint.
 */
import { composeWithDevTools as composeImpl, devToolsEnhancer as enhancerImpl, } from './devtools.js';
import { connect as connectImpl } from './connect.js';
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
 * Connect a non-Redux state container to the panel. Mirrors the browser
 * extension's `window.__REDUX_DEVTOOLS_EXTENSION__.connect()` API, so any
 * MobX/Zustand/custom integration that already targets the browser
 * extension works against this proxy unchanged.
 */
export function connect(opts = {}) {
    return connectImpl(withDefaults(opts));
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