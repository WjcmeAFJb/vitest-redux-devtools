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
import { ensureWorker, postToWorker, registerConnectionSink, unregisterConnectionSink } from './transport.js';
let counter = 0;
function nextInstanceId() {
    counter += 1;
    const pid = typeof process !== 'undefined' ? process.pid : 0;
    return `vrd-${pid}-${counter}`;
}
export function connect(opts = {}) {
    const instanceId = opts.instanceId ?? nextInstanceId();
    const name = opts.name ?? instanceId;
    const cleanupOnDisconnect = opts.cleanupOnDisconnect ?? true;
    // Spin up the worker on first connect (idempotent).
    ensureWorker(opts);
    const listeners = new Set();
    registerConnectionSink(instanceId, (msg) => {
        listeners.forEach((l) => {
            try {
                l(msg);
            }
            catch {
                // listener errors shouldn't break the dispatcher
            }
        });
    });
    const transmit = (frame) => {
        postToWorker({
            kind: 'transmit',
            event: 'log',
            data: { ...frame, instanceId, name },
        });
    };
    return {
        instanceId,
        init(state, action) {
            transmit({
                type: 'INIT',
                payload: stringify(state),
                action: action !== undefined ? stringify(action) : undefined,
            });
        },
        send(action, state) {
            const liftedAction = typeof action === 'string' ? { type: action } : action;
            // Don't send `nextActionId` — the panel's instances reducer auto-
            // increments from the previous lifted state via
            // `request.nextActionId || liftedState.nextActionId + 1`. Sending
            // a value of 1 for the first send collides with INIT's actionId 0
            // (both compute to `nextActionId - 1`), which the panel then
            // renders as two action-list rows targeting the same slot.
            transmit({
                type: 'ACTION',
                action: stringify({ type: 'PERFORM_ACTION', action: liftedAction, timestamp: Date.now() }),
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
                transmit({ type: 'DISCONNECTED' });
            }
        },
        error(message) {
            transmit({ type: 'ERROR', payload: message });
        },
    };
}
/** Disconnect every active connection. */
export function disconnectAll() {
    // Implemented in transport.ts for visibility into the registry.
    // Placed here for symmetry with the browser extension API.
}
//# sourceMappingURL=connect.js.map