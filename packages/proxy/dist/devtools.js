import { instrument } from '@redux-devtools/instrument';
import { stringify, parse } from 'jsan';
import { ensureWorker, postToWorker, getSocketId, setDefaultSink } from './transport.js';
const session = {
    instanceName: 'Vitest',
    isMonitored: false,
    isExcess: false,
    paused: false,
    locked: false,
};
function relay(type, state, action, nextActionId) {
    const message = {
        type,
        id: getSocketId() ?? null,
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
            if (getSocketId() && msg.id !== getSocketId()) {
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
setDefaultSink(handleMessage);
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