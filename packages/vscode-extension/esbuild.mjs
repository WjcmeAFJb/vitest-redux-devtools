import { build } from 'esbuild'
import { mkdirSync, copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// `@redux-devtools/app` blocks deep imports via its `exports` map, but we
// need a couple of internals. Resolve via `package.json` + relative join.
const appPkgJson = require.resolve('@redux-devtools/app/package.json')
const appRoot = dirname(appPkgJson)
const APP_CONFIGURE_STORE = resolve(appRoot, 'lib/store/configureStore.js')
const APP_CONNECTION = resolve(appRoot, 'lib/components/Settings/Connection.js')

// The trace-tab's mapper.js fetches each frame's source URL and parses
// a sourcemap. VSCodium's webview CSP blocks all fetches regardless of
// our meta CSP, so previews never render. We swap in a fetch-free
// drop-in that pulls source content out of `globalThis.__VRD_SOURCES__`
// (populated by `collectSources` in the webview entry from the
// `_vrdSources` field embedded by the proxy).
const CUSTOM_MAPPER = resolve('src/webview/custom-mapper.ts')
const CUSTOM_OPEN_FILE = resolve('src/webview/custom-open-file.ts')
const swapTraceTabPlugin = {
  name: 'swap-trace-tab-internals',
  setup(build) {
    build.onResolve({ filter: /(?:^|[\\/])mapper\.js$/ }, (args) => {
      if (
        args.importer.includes('inspector-monitor-trace-tab') &&
        args.importer.includes('react-error-overlay')
      ) {
        return { path: CUSTOM_MAPPER }
      }
      return null
    })
    // The trace-tab's openFile.js is Chrome-only (chrome.devtools.panels,
    // chrome.tabs). We swap it for a webview→host postMessage so clicks
    // on a frame's path open the file in VSCode.
    build.onResolve({ filter: /(?:^|[\\/])openFile\.js$/ }, (args) => {
      if (args.importer.includes('inspector-monitor-trace-tab')) {
        return { path: CUSTOM_OPEN_FILE }
      }
      return null
    })
  },
}

// Extension host bundle (Node).
await build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  external: ['vscode'],
  sourcemap: true,
  logLevel: 'info',
})

// Webview bundle (browser). Inlines React + @redux-devtools/app so there's
// exactly one React copy and no jsx-runtime / dual-import mismatch.
await build({
  entryPoints: ['src/webview/entry.tsx'],
  bundle: true,
  outfile: 'dist/webview/app.js',
  platform: 'browser',
  target: ['es2020'],
  format: 'iife',
  sourcemap: true,
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  loader: {
    '.woff2': 'dataurl',
    '.woff': 'dataurl',
    '.ttf': 'dataurl',
    '.svg': 'dataurl',
  },
  jsx: 'automatic',
  // The `@redux-devtools/app` package's `exports` map only exposes the
  // root entry, but we need internal `configureStore` and `Connection`
  // pieces to replicate `<Root>` with our own connect callback.
  // Resolve these by absolute path inside node_modules.
  alias: {
    '@redux-devtools/app/configureStore': APP_CONFIGURE_STORE,
    '@redux-devtools/app/Connection': APP_CONNECTION,
  },
  plugins: [swapTraceTabPlugin],
  logLevel: 'info',
})

// CSS is still copied from the upstream UMD build — no JS dependencies in it.
const webviewDir = resolve('dist', 'webview')
mkdirSync(webviewDir, { recursive: true })

function copyFromPackage(pkg, relPath, destName) {
  const pkgJson = require.resolve(pkg + '/package.json')
  const src = resolve(dirname(pkgJson), relPath)
  const dest = resolve(webviewDir, destName)
  copyFileSync(src, dest)
  console.log(`  copy ${pkg}/${relPath}\n    -> ${dest}`)
}

copyFromPackage('@redux-devtools/app', 'umd/redux-devtools-app.min.css', 'app.css')

console.log('Webview assets ready.')
