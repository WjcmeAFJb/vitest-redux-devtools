import type { StoreEnhancer } from 'redux';
export interface DevToolsOptions {
    hostname?: string;
    port?: number;
    secure?: boolean;
    name?: string;
    realtime?: boolean;
    maxAge?: number;
    /** Suppress noisy connection-error logging when no server is listening. Default true. */
    suppressConnectErrors?: boolean;
}
export declare function devToolsEnhancer(opts?: DevToolsOptions): StoreEnhancer;
type ComposeFn = (...enhancers: StoreEnhancer[]) => StoreEnhancer;
export declare function composeWithDevTools(opts?: DevToolsOptions): ComposeFn;
export {};
//# sourceMappingURL=devtools.d.ts.map