/**
 * Worker that owns the SocketCluster client. It runs in its own thread
 * with its own event loop, so the WS handshake and outgoing transmits
 * keep flowing even when the test thread is paused at a debugger
 * breakpoint. The main thread never touches the network directly — it
 * just `postMessage`s structured-cloned action payloads here.
 */
import { parentPort, type MessagePort } from 'node:worker_threads'
import { create as createSocket, type AGClientSocket } from 'socketcluster-client'

interface ConnectMessage {
  kind: 'connect'
  options: { hostname: string; port: number; secure?: boolean }
}
interface SyncPortMessage {
  kind: 'sync-port'
  port: MessagePort
}
interface TransmitMessage {
  kind: 'transmit'
  event: string
  data: unknown
}
interface ShutdownMessage {
  kind: 'shutdown'
}
type InMessage = ConnectMessage | SyncPortMessage | TransmitMessage | ShutdownMessage

type OutMessage =
  | { kind: 'connected'; id: string }
  | { kind: 'wake' }
  | { kind: 'disconnected' }
  | { kind: 'error'; message: string }

let syncPort: MessagePort | undefined

if (!parentPort) {
  throw new Error('proxy worker must be spawned via worker_threads')
}
const port = parentPort

let socket: AGClientSocket | undefined
let channel: string | undefined
let connected = false
const pending: { event: string; data: unknown }[] = []

function flushPending() {
  if (!socket || !connected) return
  while (pending.length > 0) {
    const item = pending.shift()!
    const data = item.data && typeof item.data === 'object'
      ? { ...(item.data as Record<string, unknown>), id: socket.id ?? null }
      : item.data
    socket.transmit(item.event, data)
  }
}

function send(msg: OutMessage) {
  port.postMessage(msg)
}

/**
 * Push a panel-originated message to the main thread. Goes via the sync
 * port (drained by `receiveMessageOnPort`) for the synchronous debug-
 * console path AND a 'wake' notification on parentPort so the normal
 * async listener also picks it up.
 */
function deliver(data: unknown) {
  syncPort?.postMessage({ kind: 'message', data })
  port.postMessage({ kind: 'wake' } as OutMessage)
}

function setupSocket(s: AGClientSocket) {
  void (async () => {
    for await (const _ of s.listener('connect')) {
      try {
        channel = (await s.invoke('login', 'master')) as string
        connected = true
        flushPending()
        send({ kind: 'connected', id: s.id ?? '' })
        // Channel publishes (broadcast from server middleware).
        void (async () => {
          const ch = s.subscribe(channel!)
          for await (const data of ch) deliver(data)
        })()
        // Direct receives addressed by name (legacy SC routing).
        void (async () => {
          for await (const data of s.receiver(channel!)) {
            deliver(data)
          }
        })()
        // The panel emits targeted DISPATCH (time-travel, JUMP_TO_ACTION,
        // etc) on `sc-<our-id>`. Under SC v14 the legacy `socket.on(name)`
        // path picked these up implicitly; SC v20+ requires an explicit
        // subscription to the per-socket private channel.
        if (s.id) {
          void (async () => {
            const privateCh = s.subscribe(`sc-${s.id}`)
            for await (const data of privateCh) deliver(data)
          })()
        }
      } catch (e) {
        send({ kind: 'error', message: (e as Error)?.message ?? String(e) })
      }
    }
  })()
  void (async () => {
    for await (const _ of s.listener('disconnect')) {
      connected = false
      send({ kind: 'disconnected' })
    }
  })()
  void (async () => {
    // Drain to prevent unhandled rejections; main thread already debounces.
    for await (const _ of s.listener('error')) {
      // swallow
    }
  })()
}

port.on('message', (msg: InMessage) => {
  if (msg.kind === 'sync-port') {
    syncPort = msg.port
    return
  }
  if (msg.kind === 'connect') {
    socket = createSocket({
      hostname: msg.options.hostname,
      port: msg.options.port,
      secure: msg.options.secure ?? false,
      autoReconnect: true,
    })
    setupSocket(socket)
  } else if (msg.kind === 'transmit') {
    pending.push({ event: msg.event, data: msg.data })
    flushPending()
  } else if (msg.kind === 'shutdown') {
    try {
      socket?.disconnect()
    } catch {
      // ignore
    }
    process.exit(0)
  }
})
