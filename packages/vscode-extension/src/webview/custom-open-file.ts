// Drop-in replacement for
// `@redux-devtools/inspector-monitor-trace-tab/lib/openFile.js`.
//
// The upstream module assumes a Chrome extension environment
// (`chrome.devtools.panels.openResource`, `chrome.tabs.create`, …)
// none of which exist in a VSCode webview. Clicking a frame's path
// would do nothing.
//
// Here we just post a message back to the extension host. The host
// resolves the path against the workspace and opens the document at
// the right line and column.

declare const acquireVsCodeApi: () => {
  postMessage(msg: unknown): void
}

let vscodeApi: ReturnType<typeof acquireVsCodeApi> | undefined
function getVscode() {
  if (vscodeApi) return vscodeApi
  if (typeof acquireVsCodeApi === 'function') {
    vscodeApi = acquireVsCodeApi()
    return vscodeApi
  }
  return undefined
}

const SOURCE_HOST = 'http://vrd-source'

function toAbsPath(fileName: string | null | undefined): string | null {
  if (!fileName) return null
  // Current proxy format: bare absolute path.
  if (fileName.startsWith('/')) return fileName
  // Legacy `http://vrd-source/<abs>` produced by older proxy versions.
  if (fileName.startsWith(SOURCE_HOST)) {
    try {
      return decodeURI(fileName.slice(SOURCE_HOST.length))
    } catch {
      return fileName.slice(SOURCE_HOST.length)
    }
  }
  return null
}

interface StackFrameLike {
  fileName?: string | null
  lineNumber?: number | null
  columnNumber?: number | null
  _originalFileName?: string | null
  _originalLineNumber?: number | null
  _originalColumnNumber?: number | null
}

export default function openFile(
  fileName: string,
  lineNumber: number,
  stackFrame: StackFrameLike,
): void {
  const file =
    toAbsPath(stackFrame._originalFileName) ??
    toAbsPath(stackFrame.fileName) ??
    toAbsPath(fileName)
  if (!file) return
  const line =
    stackFrame._originalLineNumber ?? stackFrame.lineNumber ?? lineNumber ?? 1
  const column =
    stackFrame._originalColumnNumber ?? stackFrame.columnNumber ?? 1
  const api = getVscode()
  if (!api) return
  api.postMessage({
    type: 'vrd:openInEditor',
    file,
    line,
    column,
  })
}
