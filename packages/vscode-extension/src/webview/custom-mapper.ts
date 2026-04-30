// Drop-in replacement for
// `@redux-devtools/inspector-monitor-trace-tab/lib/react-error-overlay/utils/mapper.js`.
//
// The upstream mapper does `fetch(fileName)` for every frame, then parses
// a sourcemap. In the VSCodium webview that fetch is blocked by the
// host's hardcoded CSP regardless of our meta CSP, so frames render with
// no `scriptCode` and the panel falls back to the bare-link UI.
//
// Our proxy embeds full source contents alongside each lifted action
// (`_vrdSources`) and the webview accumulates them into
// `globalThis.__VRD_SOURCES__` (Map<absPath, content>). This mapper
// reads from that map directly — no fetch, no sourcemap parsing.
//
// Frames whose fileName isn't in the map (panel JS itself, errors from
// other origins) are passed through unchanged.
//
// `StackFrame` and `ScriptLine` are inlined here because the trace-tab
// package's `exports` map blocks deep subpath imports — the runtime
// shape is what matters, not class identity.

const SOURCE_HOST = 'http://vrd-source'

class ScriptLine {
  lineNumber: number
  content: string
  highlight: boolean
  constructor(lineNumber: number, content: string, highlight = false) {
    this.lineNumber = lineNumber
    this.content = content
    this.highlight = highlight
  }
}

class StackFrame {
  functionName: string | null
  fileName: string | null
  lineNumber: number | null
  columnNumber: number | null
  _originalFunctionName: string | null
  _originalFileName: string | null
  _originalLineNumber: number | null
  _originalColumnNumber: number | null
  _scriptCode: ScriptLine[] | null
  _originalScriptCode: ScriptLine[] | null
  constructor(
    functionName: string | null = null,
    fileName: string | null = null,
    lineNumber: number | null = null,
    columnNumber: number | null = null,
    scriptCode: ScriptLine[] | null = null,
    sourceFunctionName: string | null = null,
    sourceFileName: string | null = null,
    sourceLineNumber: number | null = null,
    sourceColumnNumber: number | null = null,
    sourceScriptCode: ScriptLine[] | null = null,
  ) {
    if (functionName && functionName.indexOf('Object.') === 0) {
      functionName = functionName.slice('Object.'.length)
    }
    if (
      functionName === 'friendlySyntaxErrorLabel' ||
      functionName === 'exports.__esModule' ||
      functionName === '<anonymous>' ||
      !functionName
    ) {
      functionName = null
    }
    this.functionName = functionName
    this.fileName = fileName
    this.lineNumber = lineNumber
    this.columnNumber = columnNumber
    this._originalFunctionName = sourceFunctionName
    this._originalFileName = sourceFileName
    this._originalLineNumber = sourceLineNumber
    this._originalColumnNumber = sourceColumnNumber
    this._scriptCode = scriptCode
    this._originalScriptCode = sourceScriptCode
  }
  getFunctionName() {
    return this.functionName || '(anonymous function)'
  }
  getSource() {
    let str = ''
    if (this.fileName != null) str += this.fileName + ':'
    if (this.lineNumber != null) str += `${this.lineNumber}:`
    if (this.columnNumber != null) str += `${this.columnNumber}:`
    return str.slice(0, -1)
  }
  toString() {
    const fn = this.getFunctionName()
    const src = this.getSource()
    return `${fn}${src ? ` (${src})` : ''}`
  }
}

function getLinesAround(line: number, count: number, src: string | string[]): ScriptLine[] {
  const lines = typeof src === 'string' ? src.split('\n') : src
  const result: ScriptLine[] = []
  for (
    let i = Math.max(0, line - 1 - count);
    i <= Math.min(lines.length - 1, line - 1 + count);
    i++
  ) {
    result.push(new ScriptLine(i + 1, lines[i], i === line - 1))
  }
  return result
}

function resolveAbsPath(fileName: string | null | undefined): string | null {
  if (!fileName) return null
  if (fileName.startsWith(SOURCE_HOST)) {
    try {
      return decodeURI(fileName.slice(SOURCE_HOST.length))
    } catch {
      return fileName.slice(SOURCE_HOST.length)
    }
  }
  return null
}

export async function map(frames: any[], contextLines = 3): Promise<any[]> {
  const sources: Map<string, string> | undefined = (globalThis as any).__VRD_SOURCES__
  return frames.map((frame: any) => {
    const { functionName, fileName, lineNumber, columnNumber } = frame
    const absPath = resolveAbsPath(fileName)
    if (!absPath || !sources || lineNumber == null) return frame
    const content = sources.get(absPath)
    if (!content) return frame
    const lines = content.split('\n')
    const scriptCode = getLinesAround(lineNumber, contextLines, lines)
    return new StackFrame(
      functionName,
      fileName,
      lineNumber,
      columnNumber,
      scriptCode,
      functionName,
      absPath,
      lineNumber,
      columnNumber,
      scriptCode,
    )
  })
}

export default map
