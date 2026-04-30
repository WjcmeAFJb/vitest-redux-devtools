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
/**
 * Build an inline (data URL) source-map-v3 that maps each generated line
 * to the same line in the same file. Used as a fallback when serving a
 * source file that doesn't have its own sourcemap, so the panel's mapper
 * still produces an `_originalFileName` and renders code previews.
 *
 * Mappings are VLQ-base64 — for an identity map every line has a single
 * segment "AAAA" / ";AACA" (gen_col=0 src_idx=0 src_line+=1 src_col=0).
 */
function buildIdentityMapDataUrl(fsPath, contents) {
    const lineCount = contents.split('\n').length;
    const mappings = lineCount === 0
        ? ''
        : 'AAAA' + ';AACA'.repeat(Math.max(0, lineCount - 1));
    const map = {
        version: 3,
        file: path.basename(fsPath),
        sources: [fsPath],
        sourcesContent: [contents],
        names: [],
        mappings,
    };
    const b64 = Buffer.from(JSON.stringify(map), 'utf8').toString('base64');
    return `data:application/json;charset=utf-8;base64,${b64}`;
}
async function startServer(port) {
    // socketcluster-server is ESM-only; esbuild bundles it into the extension
    // CJS output. Use dynamic import to avoid require()-ing an ESM module.
    // @ts-expect-error no shipped types
    const scsModule = await import('socketcluster-server');
    const socketClusterServer = scsModule.default ?? scsModule;
    const httpServer = http.createServer();
    // `/source/*` route serves files from disk so the panel's stack-trace
    // mapper can fetch sources + sourcemaps and render code previews.
    // Localhost-only, abs path required, `..` blocked. CORS `*` so the
    // webview can fetch from a different origin.
    //
    // Files without a `//# sourceMappingURL=` get an *identity* sourcemap
    // appended (each line maps to itself in the same file's sourcesContent).
    // Without this, the panel's react-error-overlay mapper can't resolve a
    // sourcemap, leaves `_originalFileName` undefined, and isInternalFile()
    // collapses the frame as if it were node_modules.
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
            let data = await fs.readFile(fsPath, 'utf8');
            const ext = path.extname(fsPath);
            const isCode = /^\.(?:[mc]?[jt]sx?|css)$/.test(ext);
            const isMap = ext === '.map';
            const mime = isMap
                ? 'application/json'
                : ext === '.css'
                    ? 'text/css'
                    : 'text/plain; charset=utf-8';
            if (isCode && !isMap && !/\/\/[#@] ?sourceMappingURL=/.test(data)) {
                data += '\n//# sourceMappingURL=' + buildIdentityMapDataUrl(fsPath, data);
            }
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