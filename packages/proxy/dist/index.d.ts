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
import { type DevToolsOptions } from './devtools.js';
export type { DevToolsOptions };
export declare function composeWithDevTools(opts?: DevToolsOptions): (...enhancers: import("redux").StoreEnhancer[]) => import("redux").StoreEnhancer;
export declare function devToolsEnhancer(opts?: DevToolsOptions): import("redux").StoreEnhancer;
/**
 * Block until the user resumes from the panel (or the timeout elapses).
 * Useful for tests that don't want to set a debugger breakpoint.
 */
export declare function waitForInspect(timeoutMs?: number): Promise<void>;
//# sourceMappingURL=index.d.ts.map