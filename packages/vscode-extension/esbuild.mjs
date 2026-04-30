import { build } from 'esbuild'
import { mkdirSync, copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

await build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  // `vscode` is provided by the host. Everything else is bundled so the
  // packaged .vsix doesn't need node_modules at runtime.
  external: ['vscode'],
  sourcemap: true,
  logLevel: 'info',
})

// Copy UMD assets into dist/webview so the webview can load them via
// `webview.asWebviewUri`. These files are React/UI bundles, not extension
// host code, so they aren't part of the esbuild graph.
const webviewDir = resolve('dist', 'webview')
mkdirSync(webviewDir, { recursive: true })

function copyFromPackage(pkg, relPath, destName) {
  const pkgJson = require.resolve(pkg + '/package.json')
  const src = resolve(dirname(pkgJson), relPath)
  const dest = resolve(webviewDir, destName)
  copyFileSync(src, dest)
  console.log(`  copy ${pkg}/${relPath}\n    -> ${dest}`)
}

copyFromPackage('react', 'umd/react.production.min.js', 'react.production.min.js')
copyFromPackage('react-dom', 'umd/react-dom.production.min.js', 'react-dom.production.min.js')
copyFromPackage('@redux-devtools/app', 'umd/redux-devtools-app.min.js', 'redux-devtools-app.min.js')
copyFromPackage('@redux-devtools/app', 'umd/redux-devtools-app.min.css', 'redux-devtools-app.min.css')

console.log('Webview assets copied.')
