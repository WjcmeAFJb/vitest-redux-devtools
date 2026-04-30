"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const http = __importStar(require("node:http"));
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("node:path"));
// `socketcluster-server` does `require(opts.wsEngine)` at runtime, which
// esbuild can't follow. Importing `ws` here forces esbuild to bundle it.
// We then hand SC a `{ Server }` shim — SC checks `wsEngine.Server` (the
// legacy CJS export name), but `ws`'s ESM wrapper only exposes
// `WebSocketServer`, so we re-alias.
const ws_1 = require("ws");
const wsEngine = { Server: ws_1.WebSocketServer };
async function startServer(port) {
    // socketcluster-server is ESM-only; esbuild bundles it into the extension
    // CJS output. Use dynamic import to avoid require()-ing an ESM module.
    // @ts-expect-error no shipped types
    const scsModule = await import('socketcluster-server');
    const socketClusterServer = scsModule.default ?? scsModule;
    const httpServer = http.createServer();
    // `/source/*` route serves files from disk so the panel's stack-trace
    // mapper can fetch sources + sourcemaps and render code previews.
    // Listen on 127.0.0.1 only and require an absolute path; same blast
    // radius as the user's IDE process. Uses CORS `*` so the webview can
    // fetch from a different origin.
    httpServer.on('request', async (req, res) => {
        if (!req.url)
            return;
        const reqUrl = new URL(req.url, 'http://localhost');
        if (!reqUrl.pathname.startsWith('/source/')) {
            res.writeHead(404);
            res.end();
            return;
        }
        const fsPath = path.normalize(decodeURIComponent(reqUrl.pathname.slice('/source'.length)));
        if (!path.isAbsolute(fsPath) || fsPath.includes('..')) {
            res.writeHead(400);
            res.end('bad path');
            return;
        }
        try {
            const data = await fs.readFile(fsPath, 'utf8');
            const ext = path.extname(fsPath);
            const mime = ext === '.map' ? 'application/json' :
                ext === '.css' ? 'text/css' :
                    'text/plain; charset=utf-8';
            res.writeHead(200, {
                'content-type': mime,
                'access-control-allow-origin': '*',
                'cache-control': 'no-store',
            });
            res.end(data);
        }
        catch {
            res.writeHead(404);
            res.end();
        }
    });
    const agServer = socketClusterServer.attach(httpServer, {
        allowClientPublish: false,
        wsEngine,
    });
    agServer.setMiddleware(agServer.MIDDLEWARE_INBOUND, async (middlewareStream) => {
        for await (const action of middlewareStream) {
            if (action.type === action.TRANSMIT) {
                const channel = action.receiver;
                const data = action.data;
                if (channel.startsWith('sc-') || channel === 'respond' || channel === 'log') {
                    void agServer.exchange.transmitPublish(channel, data);
                }
                else if (channel === 'log-noid') {
                    void agServer.exchange.transmitPublish('log', { id: action.socket.id, data });
                }
            }
            action.allow();
        }
    });
    void (async () => {
        for await (const { socket } of agServer.listener('connection')) {
            // Track which side this socket is on so that when it disconnects we
            // can publish DISCONNECTED on the right peer's channel. Test clients
            // (login !== 'master') emit on `respond`; monitors emit on `log`.
            // Without this broadcast, the panel never removes the test's instance
            // when the test process exits, so reruns pile up as ghost entries.
            let channelToEmit = 'respond';
            void (async () => {
                for await (const request of socket.procedure('login')) {
                    const credentials = request.data;
                    if (credentials === 'master') {
                        channelToEmit = 'log';
                        request.end('respond');
                    }
                    else {
                        channelToEmit = 'respond';
                        request.end('log');
                    }
                }
            })();
            void (async () => {
                for await (const _ of socket.listener('disconnect')) {
                    void agServer.exchange.transmitPublish(channelToEmit, {
                        id: socket.id,
                        type: 'DISCONNECTED',
                    });
                    const channel = agServer.exchange.channel('sc-' + socket.id);
                    channel.unsubscribe();
                }
            })();
        }
    })();
    await new Promise((resolve) => {
        httpServer.listen(port, '127.0.0.1', () => resolve());
    });
    await agServer.listener('ready').once();
    return {
        port,
        async dispose() {
            try {
                agServer.close();
            }
            catch {
                // ignore
            }
            await new Promise((resolve) => httpServer.close(() => resolve()));
        },
    };
}
//# sourceMappingURL=server.js.map