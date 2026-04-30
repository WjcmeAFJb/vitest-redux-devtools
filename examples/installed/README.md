# installed example

A standalone pnpm project that consumes `@vitest-redux-devtools/proxy` from a
release tarball — exactly the way an external user would.

## Setup

```bash
# from this folder:
pnpm install --ignore-workspace
```

The `--ignore-workspace` flag tells pnpm to treat this directory as an
isolated project rather than a workspace member of the parent monorepo —
that's required so it actually installs the proxy from the tarball
instead of symlinking to `packages/proxy/`. If you copy this example out
of the monorepo, plain `pnpm install` works.

`pnpm install` will fetch the proxy from the local release tarball at
`../../releases/v0.1.0/vitest-redux-devtools-proxy-0.1.0.tgz`. To consume
the package from a real release, replace the `file:` path in
`package.json` with a URL:

```json
"@vitest-redux-devtools/proxy": "https://github.com/<owner>/<repo>/releases/download/v0.1.0/vitest-redux-devtools-proxy-0.1.0.tgz"
```

## Install the VSCode extension

In VSCode: `Cmd-Shift-P` → **Extensions: Install from VSIX…** →
pick `../../releases/v0.1.0/vitest-redux-devtools-0.1.0.vsix`.

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
