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
            void (async () => {
                for await (const request of socket.procedure('login')) {
                    const credentials = request.data;
                    const channelToWatch = credentials === 'master' ? 'respond' : 'log';
                    request.end(channelToWatch);
                }
            })();
            void (async () => {
                for await (const _ of socket.listener('disconnect')) {
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