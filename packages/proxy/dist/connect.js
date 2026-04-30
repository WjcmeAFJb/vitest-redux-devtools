/**
 * `connect()` API surface compatible with the browser Redux DevTools
 * extension. Used by non-Redux integrations (MobX, Zustand, custom state
 * managers) that want to push actions/state to the panel without going
 * through a Redux store.
 *
 *   const devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({ name: 'MyStore' })
 *   devtools.init(initialState)
 *   devtools.send(actionLike, state)
 *   devtools.subscribe(msg => { if (msg.type === 'DISPATCH') … })
 *   devtools.disconnect()
 *
 * Each call returns a fresh connection with its own `instanceId`, so
 * multiple stores can coexist in the panel's instance dropdown.
 */
import { stringify } from 'jsan';
import { ensureWorker, postToWorker, registerConnectionSink, unregisterConnectionSink, } from './transport.js';
let counter = 0;
function nextInstanceId() {
    counter += 1;
    const pid = typeof process !== 'undefined' ? process.pid : 0;
    return `vrd-${pid}-${counter}`;
}
function captureStack(traceLimit) {
    const prev = Error.stackTraceLimit;
    Error.stackTraceLimit = traceLimit + 4;
    const err = new Error();
    // Strip the proxy's own frames so the user sees their call site at the
    // top. Lines 0-3 are typically: "Error", captureStack, send, transmit.
    const frames = err.stack?.split('\n').slice(4).join('\n');
    Error.stackTraceLimit = prev;
    return frames;
}
export function connect(opts = {}) {
    const instanceId = opts.instanceId ?? nextInstanceId();
    const name = opts.name ?? instanceId;
    const cleanupOnDisconnect = opts.cleanupOnDisconnect ?? true;
    const traceLimit = opts.traceLimit ?? 10;
    const traceFlag = opts.trace ?? false;
    const maxBufferSize = opts.maxAge ?? 50;
    // libConfig is what the panel's instances reducer reads from each INIT
    // request to populate `options[instanceId]`. The crucial field is
    // `serialize` — without it, `parseJSON` skips the reviver and tagged
    // objects render as literal `{ __serializedType__, data }` shapes.
    const libConfig = {
        name,
        type: opts.type ?? 'redux',
        serialize: opts.serialize ?? false,
        features: opts.features,
        actionCreators: opts.actionCreators,
    };
    ensureWorker(opts);
    // Per-connection history. Replayed when a new panel attaches and
    // broadcasts START so users see prior actions in a mid-test reopen.
    // Stored as fully-formed transmit frames (sans instanceId/name, which
    // are stamped at flush time).
    const history = [];
    function bufferAdd(frame) {
        if (frame.type === 'INIT') {
            history.length = 0;
            history.push(frame);
        }
        else {
            history.push(frame);
            const overflow = history.length - (maxBufferSize + 1);
            if (overflow > 0)
                history.splice(1, overflow);
        }
    }
    const listeners = new Set();
    registerConnectionSink(instanceId, (msg) => {
        if (msg?.type === 'START') {
            // Replay buffered history so the new panel sees everything.
            for (const frame of history) {
                postToWorker({
                    kind: 'transmit',
                    event: 'log',
                    data: { ...frame, instanceId, name },
                });
            }
        }
        listeners.forEach((l) => {
            try {
                l(msg);
            }
            catch {
                // user listener errors shouldn't break the dispatcher
            }
        });
    });
    function flush(frame) {
        bufferAdd(frame);
        postToWorker({
            kind: 'transmit',
            event: 'log',
            data: { ...frame, instanceId, name },
        });
    }
    function makeStack() {
        if (!traceFlag)
            return undefined;
        if (typeof traceFlag === 'function') {
            try {
                return traceFlag();
            }
            catch {
                return undefined;
            }
        }
        return captureStack(traceLimit);
    }
    return {
        instanceId,
        init(state, action) {
            flush({
                type: 'INIT',
                payload: stringify(state),
                action: action !== undefined ? stringify(action) : undefined,
                libConfig,
            });
        },
        send(action, state) {
            const liftedAction = typeof action === 'string' ? { type: action } : action;
            const stack = makeStack();
            flush({
                type: 'ACTION',
                action: stringify({
                    type: 'PERFORM_ACTION',
                    action: liftedAction,
                    timestamp: Date.now(),
                    stack,
                }),
                payload: stringify(state),
            });
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        unsubscribe() {
            listeners.clear();
        },
        disconnect() {
            listeners.clear();
            unregisterConnectionSink(instanceId);
            if (cleanupOnDisconnect) {
                postToWorker({
                    kind: 'transmit',
                    event: 'log',
                    data: { type: 'DISCONNECTED', instanceId, name },
                });
            }
        },
        error(message) {
            flush({ type: 'ERROR', payload: message });
        },
    };
}
export function disconnectAll() {
    // Reserved for symmetry with the browser extension's global hook.
}
//# sourceMappingURL=connect.js.map