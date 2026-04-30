import type { DevToolsOptions } from './devtools.js';
type WorkerInMessage = {
    kind: 'connect';
    options: {
        hostname: string;
        port: number;
        secure?: boolean;
    };
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
export {};
//# sourceMappingURL=transport.d.ts.map