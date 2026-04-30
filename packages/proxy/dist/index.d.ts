/**
 * Public surface of the proxy package.
 *
 * All transport flows through a `node:worker_threads` worker that owns the
 * SocketCluster client (see `transport.ts` + `worker.ts`). The worker has
 * its own event loop, so the WS handshake completes and queued action
 * transmits flush even while the test thread is parked at a debugger
 * breakpoint.
 */
import { type DevToolsOptions } from './devtools.js';
import { type ConnectOptions, type DevToolsConnection } from './connect.js';
export type { DevToolsOptions, ConnectOptions, DevToolsConnection };
/**
 * Synchronously pull every pending DevTools event from the worker and
 * dispatch to listeners (Redux instrument, `connect()` subscribers).
 * Safe to call from a debugger console while the test is paused — it
 * uses `worker_threads.receiveMessageOnPort()` which doesn't yield to
 * the event loop.
 *
 * Exposed at runtime as `globalThis.__REDUX_DEVTOOLS_UPDATE__()` (and as
 * `globalThis.update()` for shorter typing in the debug console). When
 * the test isn't paused, the worker's wake notification triggers the
 * same drain automatically, so calling this is only useful during a
 * pause.
 *
 * Returns the number of events drained.
 */
export declare function update(): number;
export declare function composeWithDevTools(opts?: DevToolsOptions): (...enhancers: import("redux").StoreEnhancer[]) => import("redux").StoreEnhancer;
export declare function devToolsEnhancer(opts?: DevToolsOptions): import("redux").StoreEnhancer;
/**
 * Connect a non-Redux state container to the panel. Mirrors the browser
 * extension's `window.__REDUX_DEVTOOLS_EXTENSION__.connect()` API, so any
 * MobX/Zustand/custom integration that already targets the browser
 * extension works against this proxy unchanged.
 */
export declare function connect(opts?: ConnectOptions): DevToolsConnection;
/**
 * Block until the user resumes from the panel (or the timeout elapses).
 * Useful for tests that don't want to set a debugger breakpoint.
 */
export declare function waitForInspect(timeoutMs?: number): Promise<void>;
//# sourceMappingURL=index.d.ts.map