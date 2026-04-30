/**
 * Minimal Redux DevTools relay server.
 *
 * Replicates the channel-routing logic of `@redux-devtools/cli` minus the
 * pieces we don't need (HTTP UI serving, Apollo, sqlite report storage).
 *
 * Two roles:
 *  - `master` clients (the UI) login and watch the `respond` channel,
 *    transmit on `log`.
 *  - other clients (the test process) login and watch `log`, transmit on
 *    `respond` or `sc-<socket-id>`.
 *
 * For TRANSMIT actions on `log` / `respond` / `sc-*`, the server publishes
 * the data on that channel so any subscribed peer receives it.
 *
 * History replay is *not* the server's responsibility — `@redux-devtools/instrument`
 * (in the proxy package) keeps the lifted state on the test side and resends
 * the full timeline whenever the UI sends `START` after subscribing.
 */
export interface ServerHandle {
    port: number;
    dispose(): Promise<void>;
}
export declare function startServer(port: number): Promise<ServerHandle>;
//# sourceMappingURL=server.d.ts.map