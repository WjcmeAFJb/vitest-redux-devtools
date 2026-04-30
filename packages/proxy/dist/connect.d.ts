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
}
export type ActionLike = string | {
    type: string;
    [k: string]: unknown;
};
export interface DevToolsConnection {
    /** Push the initial state. Call once before any `send`. */
    init(state: unknown, action?: ActionLike): void;
    /** Push an action + the resulting state. */
    send(action: ActionLike, state: unknown): void;
    /** Subscribe to messages from the panel (DISPATCH / JUMP / etc). */
    subscribe(listener: (msg: any) => void): () => void;
    /** Unsubscribe all listeners on this connection. */
    unsubscribe(): void;
    /** Tear down the connection and tell the panel to forget it. */
    disconnect(): void;
    /** Report an error to the panel. */
    error(message: string): void;
    /** The instance id used in panel routing. Stable for this connection. */
    readonly instanceId: string;
}
export declare function connect(opts?: ConnectOptions): DevToolsConnection;
/** Disconnect every active connection. */
export declare function disconnectAll(): void;
//# sourceMappingURL=connect.d.ts.map