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
