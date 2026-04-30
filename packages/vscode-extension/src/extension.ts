import * as vscode from 'vscode'
import * as net from 'node:net'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { startServer, type ServerHandle } from './server.js'

let serverPromise: Promise<ServerHandle> | undefined
let panel: vscode.WebviewPanel | undefined
let statusItem: vscode.StatusBarItem | undefined

async function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const srv = net.createServer()
    srv.once('error', () => resolve(false))
    srv.once('listening', () => srv.close(() => resolve(true)))
    srv.listen(port, '127.0.0.1')
  })
}

async function pickPort(preferred: number): Promise<number> {
  for (const p of [preferred, preferred + 1, preferred + 2]) {
    if (await isPortFree(p)) return p
  }
  return new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.once('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address()
      const port = typeof addr === 'object' && addr ? addr.port : 0
      srv.close(() => resolve(port))
    })
  })
}

function ensureServer(): Promise<ServerHandle> {
  if (serverPromise) return serverPromise
  const cfg = vscode.workspace.getConfiguration('vitestReduxDevTools')
  const preferred = cfg.get<number>('port', 8765)
  serverPromise = (async () => {
    const port = await pickPort(preferred)
    return startServer(port)
  })().catch((err) => {
    serverPromise = undefined
    throw err
  })
  return serverPromise
}

function ensureStatusItem(): vscode.StatusBarItem {
  if (statusItem) return statusItem
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusItem.command = 'vitestReduxDevTools.open'
  statusItem.tooltip = 'Open Redux DevTools panel'
  return statusItem
}

function updateStatus(port: number) {
  const item = ensureStatusItem()
  item.text = `$(debug-alt) Redux DevTools :${port}`
  item.show()
}

interface WebviewAssets {
  reactJs: vscode.Uri
  reactDomJs: vscode.Uri
  appJs: vscode.Uri
  appCss: vscode.Uri
}

function resolveWebviewAssets(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
): WebviewAssets {
  // Each UMD file is copied into `dist/webview/` by the build (see
  // esbuild.mjs). We point the webview at those copies.
  const dir = vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')
  return {
    reactJs: webview.asWebviewUri(vscode.Uri.joinPath(dir, 'react.production.min.js')),
    reactDomJs: webview.asWebviewUri(vscode.Uri.joinPath(dir, 'react-dom.production.min.js')),
    appJs: webview.asWebviewUri(vscode.Uri.joinPath(dir, 'redux-devtools-app.min.js')),
    appCss: webview.asWebviewUri(vscode.Uri.joinPath(dir, 'redux-devtools-app.min.css')),
  }
}

function buildPanelHtml(webview: vscode.Webview, assets: WebviewAssets, port: number): string {
  const cspSource = webview.cspSource
  const csp = [
    `default-src 'none'`,
    `style-src ${cspSource} 'unsafe-inline'`,
    // 'unsafe-eval' is required by the Redux DevTools UI: the Dispatcher
    // tab runs typed JS, and action-creator strings sent over the wire are
    // evaluated when monitors echo them back. Without it the inspector
    // tabs that touch user-supplied code throw at mount.
    `script-src ${cspSource} 'unsafe-inline' 'unsafe-eval'`,
    // Webview-served assets (incl. their .map siblings fetched by devtools)
    // come from `cspSource` over https; the SC server is reachable on
    // localhost over both http and ws.
    `connect-src ${cspSource} https: ws://127.0.0.1:* ws://localhost:* http://127.0.0.1:* http://localhost:*`,
    `font-src ${cspSource} data:`,
    `img-src ${cspSource} data:`,
  ].join('; ')

  return /* html */ `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}" />
    <title>Redux DevTools</title>
    <link href="${assets.appCss}" rel="stylesheet" />
    <style>
      html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }
      #root, #root > div { height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="${assets.reactJs}"></script>
    <script src="${assets.reactDomJs}"></script>
    <script src="${assets.appJs}"></script>
    <script>
      const container = document.querySelector('#root');
      const element = React.createElement(ReduxDevToolsApp.Root, {
        socketOptions: {
          hostname: '127.0.0.1',
          port: ${port},
          autoReconnect: true,
        },
      });
      ReactDOM.createRoot(container).render(element);
    </script>
  </body>
</html>`
}

async function openPanel(context: vscode.ExtensionContext) {
  if (panel) {
    panel.reveal()
    return
  }

  // Verify the bundled UMD files exist before we try to render anything.
  const webviewDir = path.join(context.extensionPath, 'dist', 'webview')
  const required = [
    'react.production.min.js',
    'react-dom.production.min.js',
    'redux-devtools-app.min.js',
    'redux-devtools-app.min.css',
  ]
  const missing = required.filter((f) => !fs.existsSync(path.join(webviewDir, f)))
  if (missing.length > 0) {
    vscode.window.showErrorMessage(
      `Redux DevTools: missing bundled assets in dist/webview: ${missing.join(', ')}. Re-run the extension build.`,
    )
    return
  }

  let server: ServerHandle
  try {
    server = await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'Starting Redux DevTools server…' },
      async () => await ensureServer(),
    )
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to start Redux DevTools: ${(err as Error).message}`)
    return
  }

  panel = vscode.window.createWebviewPanel(
    'vitestReduxDevTools',
    'Redux DevTools',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')],
    },
  )
  const assets = resolveWebviewAssets(context, panel.webview)
  panel.webview.html = buildPanelHtml(panel.webview, assets, server.port)
  updateStatus(server.port)

  panel.onDidDispose(() => {
    panel = undefined
    const cfg = vscode.workspace.getConfiguration('vitestReduxDevTools')
    if (cfg.get<boolean>('shutdownOnPanelClose', false)) {
      void serverPromise?.then((s) => s.dispose())
      serverPromise = undefined
      statusItem?.hide()
    }
  })
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vitestReduxDevTools.open', () => openPanel(context)),
    vscode.commands.registerCommand('vitestReduxDevTools.copyEnv', async () => {
      const server = await ensureServer()
      const line = `export REDUX_DEVTOOLS_HOST=127.0.0.1 REDUX_DEVTOOLS_PORT=${server.port}`
      await vscode.env.clipboard.writeText(line)
      vscode.window.showInformationMessage(`Copied: ${line}`)
    }),
  )
}

export function deactivate() {
  panel?.dispose()
  statusItem?.dispose()
  void serverPromise?.then((s) => s.dispose())
}
