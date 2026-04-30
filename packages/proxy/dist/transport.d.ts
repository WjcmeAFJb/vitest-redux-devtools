/**
 * Shared worker-thread transport. Both the Redux instrument enhancer
 * (`devtools.ts`) and the `connect()` API (`connect.ts`) post through
 * here so a single SocketCluster connection backs all of them.
 */
import { type MessagePort } from 'node:worker_threads';
import type { DevToolsOptions } from './devtools.js';
type WorkerInMessage = {
    kind: 'connect';
    options: {
        hostname: string;
        port: number;
        secure?: boolean;
    };
} | {
    kind: 'sync-port';
    port: MessagePort;
} | {
    kind: 'transmit';
    event: string;
    data: unknown;
} | {
    kind: 'shutdown';
};
export declare function registerConnectionSink(instanceId: string, sink: (msg: any) => void): void;
export declare function unregisterConnectionSink(instanceId: string): void;
export declare function setDefaultSink(sink: (msg: any) => void): void;
export declare function getSocketId(): string | undefined;
export declare function postToWorker(msg: WorkerInMessage): void;
interface ConnectedListener {
    (id: string): void;
}
export declare function onConnected(cb: ConnectedListener): () => void;
export declare function ensureWorker(opts: DevToolsOptions): void;
/**
 * Synchronously pulls every pending DevTools event off the worker's sync
 * port and routes it to the appropriate sink. Safe to call from a
 * debugger console while the event loop is parked — it doesn't yield.
 *
 * Both the wake-event-driven path and the user-callable
 * `__REDUX_DEVTOOLS_UPDATE__()` route through here, so messages aren't
 * processed twice.
 */
export declare function drainSync(): number;
export {};
//# sourceMappingURL=transport.d.ts.map