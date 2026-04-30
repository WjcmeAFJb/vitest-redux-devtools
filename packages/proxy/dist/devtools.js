import { instrument } from '@redux-devtools/instrument';
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { stringify, parse } from 'jsan';
const session = {
    instanceName: 'Vitest',
    isMonitored: false,
    isExcess: false,
    paused: false,
    locked: false,
    suppressConnectErrors: true,
    errorReported: false,
};
function postToWorker(msg) {
    session.worker?.postMessage(msg);
}
function relay(type, state, action, nextActionId) {
    if (!session.worker)
        return;
    const message = {
        type,
        id: session.socketId ?? null,
        name: session.instanceName,
    };
    if (state !== undefined) {
        message.payload = type === 'ERROR' ? state : stringify(state);
    }
    if (type === 'ACTION') {
        message.action = stringify(action);
        message.isExcess = session.isExcess;
        message.nextActionId = nextActionId;
    }
    else if (action) {
        message.action = action;
    }
    // Worker fills in `data.id` from the live socket at transmit time, so
    // we don't need to wait for the connection here.
    postToWorker({ kind: 'transmit', event: 'log', data: message });
}
function dispatchRemotely(rawAction) {
    const store = session.store;
    if (!store)
        return;
    try {
        const action = typeof rawAction === 'string' ? parse(rawAction) : rawAction;
        if (action && typeof action === 'object' && 'type' in action) {
            store.dispatch(action);
        }
    }
    catch (e) {
        relay('ERROR', e.message);
    }
}
function handleMessage(msg) {
    const store = session.store;
    if (!store)
        return;
    switch (msg?.type) {
        case 'IMPORT':
        case 'SYNC':
            if (session.socketId && msg.id !== session.socketId) {
                store.liftedStore.dispatch({
                    type: 'IMPORT_STATE',
                    nextLiftedState: parse(msg.state),
                });
            }
            break;
        case 'UPDATE':
            relay('STATE', store.liftedStore.getState());
            break;
        case 'START':
            session.isMonitored = true;
            relay('STATE', store.liftedStore.getState());
            break;
        case 'STOP':
        case 'DISCONNECTED':
            session.isMonitored = false;
            relay('STOP');
            break;
        case 'DISPATCH':
            store.liftedStore.dispatch(msg.action);
            break;
        case 'ACTION':
            dispatchRemotely(msg.action);
            break;
    }
}
function ensureWorker(opts) {
    if (session.worker)
        return;
    // The compiled worker sits next to this file in the published package.
    const workerPath = fileURLToPath(new URL('./worker.js', import.meta.url));
    const worker = new Worker(workerPath);
    session.worker = worker;
    worker.on('message', (msg) => {
        if (msg.kind === 'connected') {
            session.socketId = msg.id;
            session.errorReported = false;
            relay('START');
        }
        else if (msg.kind === 'message') {
            handleMessage(msg.data);
        }
        else if (msg.kind === 'disconnected') {
            session.socketId = undefined;
            session.isMonitored = false;
        }
        else if (msg.kind === 'error') {
            if (!session.suppressConnectErrors && !session.errorReported) {
                session.errorReported = true;
                // eslint-disable-next-line no-console
                console.warn('[redux-devtools-proxy] worker error:', msg.message);
            }
        }
    });
    worker.on('error', (err) => {
        if (!session.errorReported) {
            session.errorReported = true;
            // eslint-disable-next-line no-console
            console.warn('[redux-devtools-proxy] worker thread crashed:', err.message);
        }
    });
    // Detach unref so the worker doesn't keep the process alive on test exit.
    worker.unref();
    postToWorker({
        kind: 'connect',
        options: {
            hostname: opts.hostname ?? 'localhost',
            port: opts.port ?? 8765,
            secure: opts.secure ?? false,
        },
    });
    // Best-effort clean shutdown: tell the worker to flush + disconnect when
    // the test process is winding down. The server's `disconnect` listener
    // will then publish DISCONNECTED to the panel and the rerun replaces
    // this run cleanly. If the process exits abruptly we still get the TCP
    // RST on the server side, so the cleanup happens regardless.
    let shutdownSent = false;
    const shutdown = () => {
        if (shutdownSent)
            return;
        shutdownSent = true;
        try {
            postToWorker({ kind: 'shutdown' });
        }
        catch {
            // ignore
        }
    };
    process.on('beforeExit', shutdown);
    process.on('exit', shutdown);
}
function makeMonitorReducer() {
    return (state, action) => {
        session.lastAction = action?.type;
        return state ?? null;
    };
}
function onLiftedChange(maxAge) {
    const store = session.store;
    const liftedState = store.liftedStore.getState();
    if (session.lastAction === 'PERFORM_ACTION') {
        const nextActionId = liftedState.nextActionId;
        const liftedAction = liftedState.actionsById[nextActionId - 1];
        relay('ACTION', store.getState(), liftedAction, nextActionId);
        if (!session.isExcess) {
            session.isExcess = liftedState.stagedActionIds.length >= maxAge;
        }
    }
    else if (session.lastAction === 'JUMP_TO_STATE') {
        return;
    }
    else {
        relay('STATE', liftedState);
    }
}
export function devToolsEnhancer(opts = {}) {
    session.instanceName = opts.name ?? 'Vitest';
    session.suppressConnectErrors = opts.suppressConnectErrors ?? true;
    const maxAge = opts.maxAge ?? 50;
    const realtime = opts.realtime ?? true;
    const instrumented = instrument(makeMonitorReducer(), { maxAge });
    return ((next) => (reducer, preloadedState) => {
        const store = instrumented(next)(reducer, preloadedState);
        session.store = store;
        if (realtime) {
            store.liftedStore.subscribe(() => onLiftedChange(maxAge));
            ensureWorker(opts);
        }
        return store;
    });
}
export function composeWithDevTools(opts = {}) {
    return (...enhancers) => {
        const dt = devToolsEnhancer(opts);
        if (enhancers.length === 0)
            return dt;
        return ((createStore) => {
            const instrumentedCreator = dt(createStore);
            const wrapped = enhancers.reduceRight((acc, e) => e(acc), instrumentedCreator);
            return wrapped;
        });
    };
}
//# sourceMappingURL=devtools.js.map