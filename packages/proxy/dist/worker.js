/**
 * Worker that owns the SocketCluster client. It runs in its own thread
 * with its own event loop, so the WS handshake and outgoing transmits
 * keep flowing even when the test thread is paused at a debugger
 * breakpoint. The main thread never touches the network directly — it
 * just `postMessage`s structured-cloned action payloads here.
 */
import { parentPort } from 'node:worker_threads';
import { create as createSocket } from 'socketcluster-client';
if (!parentPort) {
    throw new Error('proxy worker must be spawned via worker_threads');
}
const port = parentPort;
let socket;
let channel;
let connected = false;
const pending = [];
function flushPending() {
    if (!socket || !connected)
        return;
    while (pending.length > 0) {
        const item = pending.shift();
        const data = item.data && typeof item.data === 'object'
            ? { ...item.data, id: socket.id ?? null }
            : item.data;
        socket.transmit(item.event, data);
    }
}
function send(msg) {
    port.postMessage(msg);
}
function setupSocket(s) {
    void (async () => {
        for await (const _ of s.listener('connect')) {
            try {
                channel = (await s.invoke('login', 'master'));
                connected = true;
                flushPending();
                send({ kind: 'connected', id: s.id ?? '' });
                // Channel publishes (broadcast from server middleware).
                void (async () => {
                    const ch = s.subscribe(channel);
                    for await (const data of ch)
                        send({ kind: 'message', data });
                })();
                // Direct receives addressed by name (legacy SC routing).
                void (async () => {
                    for await (const data of s.receiver(channel)) {
                        send({ kind: 'message', data });
                    }
                })();
            }
            catch (e) {
                send({ kind: 'error', message: e?.message ?? String(e) });
            }
        }
    })();
    void (async () => {
        for await (const _ of s.listener('disconnect')) {
            connected = false;
            send({ kind: 'disconnected' });
        }
    })();
    void (async () => {
        // Drain to prevent unhandled rejections; main thread already debounces.
        for await (const _ of s.listener('error')) {
            // swallow
        }
    })();
}
port.on('message', (msg) => {
    if (msg.kind === 'connect') {
        socket = createSocket({
            hostname: msg.options.hostname,
            port: msg.options.port,
            secure: msg.options.secure ?? false,
            autoReconnect: true,
        });
        setupSocket(socket);
    }
    else if (msg.kind === 'transmit') {
        pending.push({ event: msg.event, data: msg.data });
        flushPending();
    }
    else if (msg.kind === 'shutdown') {
        try {
            socket?.disconnect();
        }
        catch {
            // ignore
        }
        process.exit(0);
    }
});
//# sourceMappingURL=worker.js.map