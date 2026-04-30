# Vitest Redux DevTools

Open the **real** Redux DevTools UI in a VSCode panel and connect any state
container running inside a Vitest test — Redux, MobX, Zustand, or anything
else that targets the browser DevTools extension's `connect()` API.

## How it works

```
┌──────────────────┐  postMessage   ┌──────────────────┐  socketcluster   ┌──────────────────────┐  webview msg  ┌────────────────────┐
│  Vitest test     │ ─────────────▶ │  proxy worker    │ ───────────────▶ │  VSCode extension    │ ────────────▶ │  Webview panel     │
│  (your code +    │                │  thread (owns    │                  │  • SC server         │               │  @redux-devtools/  │
│  proxy install)  │                │   WS connection) │ ◀─────────────── │  • port picker       │ ◀──────────── │  app UMD bundle    │
└──────────────────┘ ◀───────────── └──────────────────┘                  └──────────────────────┘               └────────────────────┘
```

- **`@vitest-redux-devtools/proxy`** — installs the standard
  `__REDUX_DEVTOOLS_EXTENSION__` / `..._COMPOSE__` globals so any code
  under test (RTK's `configureStore`, MobX devtools bindings, Zustand,
  custom integrations) connects automatically. The SC client lives in a
  `node:worker_threads` worker, which means **the WS handshake completes
  and queued action transmits flush even while the test thread is parked
  on a debugger breakpoint**. Pre-pause dispatches show up in the panel
  during the pause; post-pause dispatches stream live.
- **`vitest-redux-devtools` VSCode extension** — opens a panel that runs a
  `socketcluster-server` in-process (only when the panel is opened) and
  hosts the real `@redux-devtools/app` UI as a webview, loading the same
  UMD bundle the standalone DevTools uses. Same UI as the browser
  extension.

## Quick start

In your test project:

```ts
// vitest.setup.ts
import '@vitest-redux-devtools/proxy/install'
```

```jsonc
// vitest.config.ts
{ "test": { "setupFiles": ["./vitest.setup.ts"] } }
```

In VSCode: `Cmd-Shift-P` → `Redux DevTools: Open Panel` (or click the
Redux DevTools icon in the activity bar). The panel starts the server on
port `8765` (configurable, falls back to a free port if busy). The proxy
reads `REDUX_DEVTOOLS_PORT` from the test process' env, defaulting to
`8765`.

Then click **Debug this test** in the Vitest extension. Set a breakpoint
and the panel shows the action timeline.

For tests without breakpoints, hold the process open with
`waitForInspect`:

```ts
import { waitForInspect } from '@vitest-redux-devtools/proxy'

it('the thing', async () => {
  // ... actions dispatched
  await waitForInspect()  // hangs until globalThis.__REDUX_DEVTOOLS_RESUME__ is set
}, 10 * 60_000)
```

## Redux / RTK (zero-code)

`configureStore` from RTK auto-detects the global, so no app changes are
needed:

```ts
import { configureStore, createSlice } from '@reduxjs/toolkit'

const slice = createSlice({ name: 'counter', initialState: 0,
  reducers: { inc: (s) => s + 1 } })

const store = configureStore({ reducer: slice.reducer })
store.dispatch(slice.actions.inc())  // shows up in the panel
```

## Non-Redux integrations (MobX / Zustand / custom)

Use the same `connect()` API the browser extension exposes:

```ts
const devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({ name: 'CounterStore' })

// initial state
devtools.init({ count: 0 })

// after every state change
devtools.send({ type: 'INCREMENT' }, { count: 1 })
devtools.send('ADD_BY/+10', { count: 11 })  // string actions also work

// time-travel from the panel
devtools.subscribe((msg) => {
  if (msg.type === 'DISPATCH' && msg.payload?.type === 'JUMP_TO_STATE') {
    applyState(JSON.parse(msg.state))
  }
})

// cleanup
devtools.disconnect()
```

Every `connect()` gets its own `instanceId`, so multiple stores show up
as separate entries in the panel's instance dropdown. This is exactly the
shape MobX (`mobx-remotedev`), Zustand's devtools middleware, and any
hand-rolled integration already targets — they just work.

## Tests pausing on a breakpoint

When V8's inspector pauses the test thread, the entire JS event loop on
that thread stops. With the SC client on the *test* thread (as
`remote-redux-devtools` v0.5 does), the WS handshake stalls and you
never see anything in the panel until you resume — defeating the point
of debugging.

The proxy puts the SC client on a Worker Thread instead. The worker has
its own V8 isolate and event loop; pausing the test thread doesn't pause
the worker. So pre-pause dispatches arrive in the panel during the
pause, and the connection stays alive.

If you ever need synchronous-with-ACK semantics (test must wait for the
server to confirm receipt before continuing), the next tier is
`SharedArrayBuffer` + `Atomics.wait`/`Atomics.notify` between main and
worker — not currently exposed but trivially addable.

## Node-only Vitest (no jsdom)

RTK's `configureStore` checks the literal global `window` (not
`globalThis`). In plain-Node Vitest there's no `window`, so the proxy's
`install` module sets `globalThis.window = globalThis` if no `window`
exists. With `jsdom` / `happy-dom` it attaches to the existing `window`.

## Cleanup between reruns

Each test run gets a fresh socket id. The SC server broadcasts
`{ type: 'DISCONNECTED', id }` when a client socket goes away, so the
panel removes the previous run's instance — reruns don't accumulate as
ghost entries. If your test process exits abruptly (TCP RST instead of a
clean FIN), the server still sees the disconnect and broadcasts.

## Project layout

```
packages/
  proxy/             # @vitest-redux-devtools/proxy — npm package for tests
  vscode-extension/  # vitest-redux-devtools — VSCode extension
examples/
  basic/             # in-workspace sample (linked proxy source)
  installed/         # standalone consumer (installs proxy from a release tarball)
releases/
  v0.X.Y/            # built artifacts: .tgz (proxy) + .vsix (extension)
```

## Installing the release

```json
"dependencies": {
  "@vitest-redux-devtools/proxy": "https://github.com/WjcmeAFJb/vitest-redux-devtools/releases/download/v0.4.0/vitest-redux-devtools-proxy-0.4.0.tgz"
}
```

VSCode extension:

```bash
curl -L -o vrd.vsix \
  https://github.com/WjcmeAFJb/vitest-redux-devtools/releases/download/v0.4.0/vitest-redux-devtools-0.4.0.vsix
code --install-extension vrd.vsix
```

See `RELEASING.md` for the full release flow.

## Settings

| Key | Default | Purpose |
| --- | --- | --- |
| `vitestReduxDevTools.port` | `8765` | Preferred port. If busy, the next free port is picked. |
| `vitestReduxDevTools.shutdownOnPanelClose` | `false` | Stop the server when the panel closes (history is lost). |
