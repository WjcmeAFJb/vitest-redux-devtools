import type { DevToolsOptions } from './devtools.js';
export interface ConnectOptions extends DevToolsOptions {
    /** Display name in the panel's instance dropdown. */
    name?: string;
    /** Stable instance id. If omitted, a per-process auto-generated one is used. */
    instanceId?: string;
    /**
     * If true (default), each new connection emits a `DISCONNECTED` for its
     * instanceId on `disconnect()` so the panel removes the entry. Set to
     * false if you want the previous run's history to linger.
     */
    cleanupOnDisconnect?: boolean;
    /**
     * Hint to the panel about the lib backing this connection. Currently
     * just stored on the panel's instance options for display/UX.
     */
    type?: string;
    /**
     * Use jsan-style `__serializedType__` wrapping. When true, the panel
     * runs its reviver and renders tagged objects as type-aware
     * collapsibles instead of literal `__serializedType__`/`data`
     * properties. mobx-auto-devtools and similar integrations rely on
     * this.
     */
    serialize?: boolean;
    /**
     * Capture a sync stack trace at every `send()` call site. Disabled by
     * default to keep the wire small. When enabled, the panel's "Trace"
     * inspector tab gets a stack for each action.
     *
     * When given a function, it's called with the action being dispatched
     * and may return a string to override the captured stack. This lets
     * callers tailor the trace per-action (e.g. drop noisy frames for
     * high-volume action types, or substitute a stack from elsewhere).
     * Returning `undefined` falls back to the default capture.
     */
    trace?: boolean | ((action: ActionLike) => string | undefined);
    /** Limit on captured stack frames. Default 10. */
    traceLimit?: number;
    /** History ring size; replayed when a new panel attaches. Default 50. */
    maxAge?: number;
    /** Action creators reflected in the panel's "Dispatch" tab. */
    actionCreators?: unknown;
    /** Feature flags reflected in panel buttons. */
    features?: Record<string, boolean>;
}
export type ActionLike = string | {
    type: string;
    [k: string]: unknown;
};
export interface DevToolsConnection {
    init(state: unknown, action?: ActionLike): void;
    send(action: ActionLike, state: unknown): void;
    subscribe(listener: (msg: any) => void): () => void;
    unsubscribe(): void;
    disconnect(): void;
    error(message: string): void;
    readonly instanceId: string;
}
export declare function connect(opts?: ConnectOptions): DevToolsConnection;
export declare function disconnectAll(): void;
//# sourceMappingURL=connect.d.ts.map