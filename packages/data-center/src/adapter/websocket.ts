import type { DataAdapter, WebSocketConfig } from '../types'

export class WebSocketAdapter implements DataAdapter {
  type = 'websocket' as const
  private config: WebSocketConfig
  private ws: WebSocket | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private subscribers: Set<(data: unknown) => void> = new Set()

  constructor(config: WebSocketConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols)

        this.ws.onopen = () => {
          this.startHeartbeat()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.subscribers.forEach(cb => cb(data))
          } catch {
            this.subscribers.forEach(cb => cb(event.data))
          }
        }

        this.ws.onclose = () => {
          this.stopHeartbeat()
          if (this.config.reconnect !== false) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    this.stopHeartbeat()
    this.clearReconnectTimer()
    this.ws?.close()
    this.ws = null
  }

  async fetchData(): Promise<unknown> {
    // WebSocket 是推送模式，不支持主动获取
    return null
  }

  subscribe(callback: (data: unknown) => void): () => void {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  private startHeartbeat(): void {
    if (!this.config.heartbeatInterval) return
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.ws?.send(JSON.stringify({ type: 'ping' }))
      }
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect(): void {
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(console.error)
    }, this.config.reconnectInterval || 3000)
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}
