# Vitest Redux DevTools

Open the **real** Redux DevTools UI in a VSCode panel and connect any Redux
(or instrumented MobX) store running inside a Vitest test to it.

## How it works

```
┌──────────────────┐  socketcluster   ┌──────────────────────┐  webview msg  ┌────────────────────┐
│  Vitest test     │ ───────────────▶ │  VSCode extension    │ ────────────▶ │  Webview panel     │
│  (your code +    │                  │  • SC server         │               │  @redux-devtools/  │
│  proxy install)  │ ◀─────────────── │  • port picker       │ ◀──────────── │  app UMD bundle    │
└──────────────────┘                  └──────────────────────┘               └────────────────────┘
```

- **`@vitest-redux-devtools/proxy`** — installs the standard
  `__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` global so any code under test
  (including RTK's `configureStore`) auto-wires devtools without code
  changes. Internally uses `@redux-devtools/instrument` for the lifted
  state and `socketcluster-client` to talk to the extension's server. The
  lifted state holds the full action history; whenever the UI reconnects,
  the proxy resends the timeline — closing and reopening the panel
  preserves history as long as the test process is alive.
- **`vitest-redux-devtools` VSCode extension** — opens a panel that runs a
  `socketcluster-server` in-process (only when the panel is opened) and
  hosts the real `@redux-devtools/app` UI as a webview, loading the same
  UMD bundle the standalone DevTools uses. Same UI as the browser
  extension.

## Quick start

In your test project:

```jsonc
// vitest.config.ts
{
  "test": { "setupFiles": ["./vitest.setup.ts"] }
}
```

```ts
// vitest.setup.ts
import '@vitest-redux-devtools/proxy/install'
```

In VSCode: `Cmd-Shift-P` → `Redux DevTools: Open Panel`. The panel starts
the server (preferred port `8765`, configurable; falls back to a free port
if busy). The proxy reads `REDUX_DEVTOOLS_PORT` from the test process'
environment, defaulting to `8765`.

Then click **Debug this test** in the Vitest extension. Hit a breakpoint
and the panel shows the action timeline; resume and it streams live.

To inspect a test that has no breakpoint:

```ts
import { waitForInspect } from '@vitest-redux-devtools/proxy'

it('the thing', async () => {
  // ... actions dispatched
  await waitForInspect() // holds the test until you set globalThis.__REDUX_DEVTOOLS_RESUME__
})
```

## Node-only Vitest (no jsdom)

RTK's `configureStore` checks the literal global `window` (not `globalThis`)
when looking for `__REDUX_DEVTOOLS_EXTENSION_COMPOSE__`. In plain-Node
Vitest there's no `window`, so the proxy's `install` module sets
`globalThis.window = globalThis` if no `window` exists. If your test
environment is `jsdom` or `happy-dom`, the proxy attaches to the existing
`window` instead.

## Project layout

```
packages/
  proxy/             # @vitest-redux-devtools/proxy — npm package for tests
  vscode-extension/  # vitest-redux-devtools — VSCode extension
examples/
  basic/             # in-workspace sample (uses linked proxy source)
  installed/         # standalone consumer example: installs proxy from
                     # a release tarball and the .vsix from the same release
releases/
  v0.1.0/            # built artifacts: .tgz (proxy) + .vsix (extension)
```

## Installing the release

A single release ships:

- `releases/v0.1.0/vitest-redux-devtools-proxy-0.1.0.tgz` — proxy tarball
- `releases/v0.1.0/vitest-redux-devtools-0.1.0.vsix` — VSCode extension

In your project's `package.json`:

```json
"dependencies": {
  "@vitest-redux-devtools/proxy": "file:./path/to/vitest-redux-devtools-proxy-0.1.0.tgz"
}
```

Or, after uploading to GitHub Releases:

```json
"@vitest-redux-devtools/proxy": "https://github.com/<owner>/<repo>/releases/download/v0.1.0/vitest-redux-devtools-proxy-0.1.0.tgz"
```

Install the extension via `Cmd-Shift-P` → **Extensions: Install from VSIX…**
and pick the `.vsix` file. See `RELEASING.md` for the full release flow.

## Settings

| Key | Default | Purpose |
| --- | --- | --- |
| `vitestReduxDevTools.port` | `8765` | Preferred port. If busy, the next free port is picked. |
| `vitestReduxDevTools.shutdownOnPanelClose` | `false` | Stop the server when the panel closes (history is lost). |
