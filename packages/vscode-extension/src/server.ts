import * as http from 'node:http'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
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

  // `/source/*` route serves files from disk so the panel's stack-trace
  // mapper can fetch sources + sourcemaps and render code previews.
  // Listen on 127.0.0.1 only and require an absolute path; same blast
  // radius as the user's IDE process. Uses CORS `*` so the webview can
  // fetch from a different origin.
  httpServer.on('request', async (req, res) => {
    if (!req.url) return
    const reqUrl = new URL(req.url, 'http://localhost')
    if (!reqUrl.pathname.startsWith('/source/')) {
      res.writeHead(404)
      res.end()
      return
    }
    const fsPath = path.normalize(decodeURIComponent(reqUrl.pathname.slice('/source'.length)))
    if (!path.isAbsolute(fsPath) || fsPath.includes('..')) {
      res.writeHead(400)
      res.end('bad path')
      return
    }
    try {
      const data = await fs.readFile(fsPath, 'utf8')
      const ext = path.extname(fsPath)
      const mime =
        ext === '.map' ? 'application/json' :
        ext === '.css' ? 'text/css' :
        'text/plain; charset=utf-8'
      res.writeHead(200, {
        'content-type': mime,
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end()
    }
  })
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
      // Track which side this socket is on so that when it disconnects we
      // can publish DISCONNECTED on the right peer's channel. Test clients
      // (login !== 'master') emit on `respond`; monitors emit on `log`.
      // Without this broadcast, the panel never removes the test's instance
      // when the test process exits, so reruns pile up as ghost entries.
      let channelToEmit: 'respond' | 'log' = 'respond'

      void (async () => {
        for await (const request of socket.procedure('login')) {
          const credentials = request.data
          if (credentials === 'master') {
            channelToEmit = 'log'
            request.end('respond')
          } else {
            channelToEmit = 'respond'
            request.end('log')
          }
        }
      })()
      void (async () => {
        for await (const _ of socket.listener('disconnect')) {
          void agServer.exchange.transmitPublish(channelToEmit, {
            id: socket.id,
            type: 'DISCONNECTED',
          })
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
