declare module 'socketcluster-client' {
  export interface AGClientSocket {
    id: string | null
    state: string
    transmit(event: string, data?: unknown): void
    invoke(event: string, data?: unknown): Promise<unknown>
    subscribe(channelName: string): AsyncIterable<unknown> & {
      unsubscribe(): void
    }
    receiver(name: string): AsyncIterable<unknown>
    listener(event: string): AsyncIterable<{ error?: Error; code?: number; reason?: string }>
    disconnect(code?: number, reason?: string): void
  }
  export interface ClientOptions {
    hostname?: string
    port?: number
    secure?: boolean
    autoReconnect?: boolean
    path?: string
    [k: string]: unknown
  }
  export function create(options?: ClientOptions): AGClientSocket
  const _default: { create: typeof create }
  export default _default
}

declare module 'jsan' {
  export function stringify(value: unknown, replacer?: unknown, indent?: unknown, decycle?: boolean): string
  export function parse(text: string, reviver?: unknown): unknown
}
