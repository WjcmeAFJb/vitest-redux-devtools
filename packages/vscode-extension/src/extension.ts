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
  appJs: vscode.Uri
  appCss: vscode.Uri
}

function resolveWebviewAssets(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
): WebviewAssets {
  const dir = vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')
  return {
    appJs: webview.asWebviewUri(vscode.Uri.joinPath(dir, 'app.js')),
    appCss: webview.asWebviewUri(vscode.Uri.joinPath(dir, 'app.css')),
  }
}

function buildPanelHtml(webview: vscode.Webview, assets: WebviewAssets, port: number): string {
  const cspSource = webview.cspSource
  const csp = [
    `default-src 'none'`,
    `style-src ${cspSource} 'unsafe-inline'`,
    // `unsafe-eval` is required by the Dispatcher tab (typed JS) and by
    // action-creator string evaluation when monitors echo actions back.
    `script-src ${cspSource} 'unsafe-inline' 'unsafe-eval'`,
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
    <script>window.__REDUX_DEVTOOLS_PORT__ = ${port};</script>
    <script src="${assets.appJs}"></script>
  </body>
</html>`
}

async function openInEditor(file: unknown, line: unknown, column: unknown) {
  if (typeof file !== 'string' || !file) return
  const ln = typeof line === 'number' && line > 0 ? Math.floor(line) - 1 : 0
  const col = typeof column === 'number' && column > 0 ? Math.floor(column) - 1 : 0
  try {
    let target: vscode.Uri | undefined
    if (file.startsWith('/') && fs.existsSync(file)) {
      target = vscode.Uri.file(file)
    } else if (vscode.workspace.workspaceFolders?.length) {
      const candidates = vscode.workspace.workspaceFolders.map((w) =>
        vscode.Uri.joinPath(w.uri, file),
      )
      target = candidates.find((u) => fs.existsSync(u.fsPath))
    }
    if (!target) {
      vscode.window.showWarningMessage(`Redux DevTools: cannot find ${file}`)
      return
    }
    const doc = await vscode.workspace.openTextDocument(target)
    const pos = new vscode.Position(ln, col)
    await vscode.window.showTextDocument(doc, {
      selection: new vscode.Range(pos, pos),
      viewColumn: vscode.ViewColumn.One,
      preserveFocus: false,
    })
  } catch (err) {
    vscode.window.showErrorMessage(
      `Redux DevTools: failed to open ${file}: ${(err as Error).message}`,
    )
  }
}

async function openPanel(context: vscode.ExtensionContext) {
  if (panel) {
    panel.reveal()
    return
  }

  const webviewDir = path.join(context.extensionPath, 'dist', 'webview')
  const required = ['app.js', 'app.css']
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

  panel.webview.onDidReceiveMessage((msg) => {
    if (msg && typeof msg === 'object' && msg.type === 'vrd:openInEditor') {
      void openInEditor(msg.file, msg.line, msg.column)
    }
  })

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

class WelcomeViewProvider implements vscode.TreeDataProvider<never> {
  // Empty tree → VSCode renders the `viewsWelcome` content from package.json.
  getTreeItem(): vscode.TreeItem { return new vscode.TreeItem('') }
  getChildren(): never[] { return [] }
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
    vscode.window.registerTreeDataProvider('vitestReduxDevTools.welcome', new WelcomeViewProvider()),
  )
}

export function deactivate() {
  panel?.dispose()
  statusItem?.dispose()
  void serverPromise?.then((s) => s.dispose())
}
