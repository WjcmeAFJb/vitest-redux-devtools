# installed example

A standalone pnpm project that consumes `@vitest-redux-devtools/proxy`
directly from the GitHub release tarball — exactly the way an external
user would.

## Setup

```bash
# from this folder:
pnpm install --ignore-workspace
```

`pnpm install` fetches the proxy from
<https://github.com/WjcmeAFJb/vitest-redux-devtools/releases/download/v0.1.0/vitest-redux-devtools-proxy-0.1.0.tgz>.
The `--ignore-workspace` flag is only needed because this folder lives
inside the monorepo; if you copy this example out of the monorepo, plain
`pnpm install` works.

## Install the VSCode extension

```bash
curl -L -o /tmp/vitest-redux-devtools.vsix \
  https://github.com/WjcmeAFJb/vitest-redux-devtools/releases/download/v0.1.0/vitest-redux-devtools-0.1.0.vsix
code --install-extension /tmp/vitest-redux-devtools.vsix
```

Or in VSCode: `Cmd-Shift-P` → **Extensions: Install from VSIX…** →
pick the downloaded file.

Then `Cmd-Shift-P` → **Redux DevTools: Open Panel** to start the server
and open the UI.

## Run tests

```bash
pnpm test
```

The test passes immediately (the proxy doesn't block the test if no UI is
listening). To actually see actions in the panel, either:

- set a breakpoint and click **Debug Test** in the Vitest extension, or
- uncomment `await waitForInspect()` in `src/counter.test.ts` and resume
  it from the panel by setting `globalThis.__REDUX_DEVTOOLS_RESUME__ = true`.

## What's wired up

- `vitest.setup.ts` does a single `import '@vitest-redux-devtools/proxy/install'`
  which installs the standard `__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` global.
- `src/counter.ts` uses RTK's `configureStore` with no devtools-specific
  code. The global is auto-detected and the store connects to the panel.
