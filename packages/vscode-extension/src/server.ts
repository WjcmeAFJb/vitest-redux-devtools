import * as http from 'node:http'
// `socketcluster-server` does `require(opts.wsEngine)` at runtime, which
// esbuild can't follow. Importing `ws` here forces esbuild to bundle it.
// We then hand SC a `{ Server }` shim — SC checks `wsEngine.Server` (the
// legacy CJS export name), but `ws`'s ESM wrapper only exposes
// `WebSocketServer`, so we re-alias.
import { WebSocketServer } from 'ws'
const wsEngine = { Server: WebSocketServer }

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
  port: number
  dispose(): Promise<void>
}

export async function startServer(port: number): Promise<ServerHandle> {
  // socketcluster-server is ESM-only; esbuild bundles it into the extension
  // CJS output. Use dynamic import to avoid require()-ing an ESM module.
  // @ts-expect-error no shipped types
  const scsModule: any = await import('socketcluster-server')
  const socketClusterServer = scsModule.default ?? scsModule

  const httpServer = http.createServer()
  const agServer = socketClusterServer.attach(httpServer, {
    allowClientPublish: false,
    wsEngine,
  })

  agServer.setMiddleware(
    agServer.MIDDLEWARE_INBOUND,
    async (middlewareStream: AsyncIterable<any>) => {
      for await (const action of middlewareStream) {
        if (action.type === action.TRANSMIT) {
          const channel = action.receiver as string
          const data = action.data
          if (channel.startsWith('sc-') || channel === 'respond' || channel === 'log') {
            void agServer.exchange.transmitPublish(channel, data)
          } else if (channel === 'log-noid') {
            void agServer.exchange.transmitPublish('log', { id: action.socket.id, data })
          }
        }
        action.allow()
      }
    },
  )

  void (async () => {
    for await (const { socket } of agServer.listener('connection')) {
      void (async () => {
        for await (const request of socket.procedure('login')) {
          const credentials = request.data
          const channelToWatch = credentials === 'master' ? 'respond' : 'log'
          request.end(channelToWatch)
        }
      })()
      void (async () => {
        for await (const _ of socket.listener('disconnect')) {
          const channel = agServer.exchange.channel('sc-' + socket.id)
          channel.unsubscribe()
        }
      })()
    }
  })()

  await new Promise<void>((resolve) => {
    httpServer.listen(port, '127.0.0.1', () => resolve())
  })
  await agServer.listener('ready').once()

  return {
    port,
    async dispose() {
      try {
        agServer.close()
      } catch {
        // ignore
      }
      await new Promise<void>((resolve) => httpServer.close(() => resolve()))
    },
  }
}
