export interface ServerHandle {
    port: number;
    dispose(): Promise<void>;
}
export declare function startServer(port: number): Promise<ServerHandle>;
//# sourceMappingURL=server.d.ts.map