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
import * as fs from 'node:fs';
import { ensureWorker, postToWorker, registerConnectionSink, unregisterConnectionSink, } from './transport.js';
let counter = 0;
function nextInstanceId() {
    counter += 1;
    const pid = typeof process !== 'undefined' ? process.pid : 0;
    return `vrd-${pid}-${counter}`;
}
const sourceCache = new Map();
function readSourceCached(absPath) {
    if (sourceCache.has(absPath))
        return sourceCache.get(absPath);
    let content = null;
    try {
        const stat = fs.statSync(absPath);
        if (stat.isFile() && stat.size < 2 * 1024 * 1024) {
            content = fs.readFileSync(absPath, 'utf8');
        }
    }
    catch {
        // ignore — likely a node:internal/* path with no on-disk file
    }
    sourceCache.set(absPath, content);
    return content;
}
const NODE_MODULES_RE = /[\\/]node_modules[\\/]/;
// Path of *this* file at runtime — used to detect and skip the proxy's
// own frames at the top of every captured stack. Matches when the test
// installs the proxy from the published tarball
// (.../node_modules/@vitest-redux-devtools/proxy/dist/) and from the
// in-workspace source (.../packages/proxy/dist/) alike.
const PROXY_DIR = (() => {
    try {
        const u = new URL('.', import.meta.url);
        return u.pathname.replace(/\/$/, '');
    }
    catch {
        return '';
    }
})();
// Matches the trailing :line:col on every V8 stack frame. We split each
// line into "head", "path-with-prefix", ":L:C", "tail" so the rewrite
// preserves any wrapping (`fn (file:///abs:1:2)` vs `at file:///abs:1:2`).
const FRAME_LINE_RE = /^(.*?)((?:file:\/\/)?\/[^():\s]+):(\d+):(\d+)(\)?\s*)$/;
function rewriteFramePath(line) {
    const m = line.match(FRAME_LINE_RE);
    if (!m)
        return { line };
    const [, head, rawPath, ln, col, tail] = m;
    const fsPath = rawPath.startsWith('file://') ? rawPath.slice('file://'.length) : rawPath;
    if (!fsPath.startsWith('/'))
        return { line };
    // Strip any `file://` prefix so the line shows the bare absolute
    // path. Both the panel's "Source"/"View compiled" toggles and the
    // custom mapper resolve from this directly.
    return {
        line: `${head}${fsPath}:${ln}:${col}${tail}`,
        fsPath,
    };
}
// Match both `dist/connect.js` (runtime) and `src/connect.ts` (source-
// mapped) layouts, in both the workspace and the pnpm/npm installed
// paths. V8's `--enable-source-maps` (default in Node 14+) rewrites the
// runtime path to the original source, which is why we have to handle
// .ts and .js + src and dist symmetrically.
const PROXY_FRAME_RE = /(?:@vitest-redux-devtools[\\/]proxy|packages[\\/]proxy)[\\/](?:src|dist)[\\/](?:connect|devtools|transport|worker|index|install)\.[jt]s/;
function isProxyOwnFrame(line) {
    if (PROXY_DIR && line.includes(PROXY_DIR))
        return true;
    return PROXY_FRAME_RE.test(line);
}
/**
 * Strip `file://` prefixes from each frame and load the referenced
 * files into a sources map. The webview's custom mapper looks frames
 * up by their absolute path, so without this the panel has no content
 * to render around the trace.
 *
 * Frames already containing the legacy `http://vrd-source/...` prefix
 * (e.g. forwarded from another action's stack saved by an older
 * proxy) are passed through untouched but still contribute to the
 * sources map — keeps the helper idempotent and back-compatible.
 */
function enrichStack(stackText) {
    const lines = stackText.split('\n');
    const out = [];
    const sources = {};
    for (const line of lines) {
        let rewrittenLine = line;
        let fsPath;
        const legacy = line.match(LEGACY_VRD_SOURCE_RE);
        if (legacy) {
            try {
                fsPath = decodeURI(legacy[1]);
            }
            catch {
                fsPath = legacy[1];
            }
        }
        else {
            const r = rewriteFramePath(line);
            rewrittenLine = r.line;
            fsPath = r.fsPath;
        }
        out.push(rewrittenLine);
        if (fsPath && !(fsPath in sources)) {
            const content = readSourceCached(fsPath);
            if (content !== null)
                sources[fsPath] = content;
        }
    }
    return { stack: out.join('\n'), sources };
}
const LEGACY_VRD_SOURCE_RE = /http:\/\/vrd-source(\/[^\s:)]+)/;
function captureStack(opts) {
    const { traceLimit } = opts;
    const prev = Error.stackTraceLimit;
    Error.stackTraceLimit = traceLimit * 5 + 20;
    const err = new Error();
    Error.stackTraceLimit = prev;
    if (!err.stack)
        return undefined;
    // Strip proxy's own frames + apply user-frame budget before enriching,
    // so we don't read source files we won't end up showing.
    const filtered = [];
    let userCount = 0;
    let pastProxy = false;
    const lines = err.stack.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!pastProxy) {
            if (isProxyOwnFrame(line))
                continue;
            pastProxy = true;
        }
        filtered.push(line);
        if (!NODE_MODULES_RE.test(line)) {
            userCount += 1;
            if (userCount >= traceLimit)
                break;
        }
    }
    return enrichStack(filtered.join('\n'));
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
    function makeStack(action) {
        if (!traceFlag)
            return undefined;
        if (typeof traceFlag === 'function') {
            // Function form: caller fully controls the stack for this action.
            // Returning `undefined`/empty disables the trace for it (matching
            // the browser extension), so we don't fall through to the default
            // capture. The returned stack still goes through `enrichStack` so
            // each frame's source file is embedded — otherwise the webview's
            // mapper has nothing to render previews from.
            try {
                const stack = traceFlag(action);
                return stack ? enrichStack(stack) : undefined;
            }
            catch {
                return undefined;
            }
        }
        return captureStack({ traceLimit });
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
            const captured = makeStack(liftedAction);
            flush({
                type: 'ACTION',
                action: stringify({
                    type: 'PERFORM_ACTION',
                    action: liftedAction,
                    timestamp: Date.now(),
                    stack: captured?.stack,
                    // Webview's patched fetch reads from this map, indexed by the
                    // absolute path embedded in the rewritten stack URL.
                    _vrdSources: captured?.sources,
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