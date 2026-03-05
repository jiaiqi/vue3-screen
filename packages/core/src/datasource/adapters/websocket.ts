import type {
  DataSourceAdapter,
  WebSocketDataSourceConfig,
  DataSourceStatus,
  DataSourceEventType,
  DataSourceEventHandler,
  DataSourceEvent,
  HeartbeatConfig,
  ReconnectConfig,
  MessageQueueConfig,
} from '../types'

interface QueuedMessage {
  id: string
  data: unknown
  timestamp: number
  retries: number
}

export class WebSocketAdapter implements DataSourceAdapter<WebSocketDataSourceConfig> {
  readonly type = 'websocket' as const

  private _status: DataSourceStatus = 'idle'
  private _config: WebSocketDataSourceConfig
  private eventHandlers: Map<DataSourceEventType, Set<DataSourceEventHandler>> = new Map()

  private ws: WebSocket | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private heartbeatTimeoutTimer: ReturnType<typeof setTimeout> | null = null

  private reconnectAttempts = 0
  private isManualDisconnect = false
  private messageQueue: QueuedMessage[] = []
  private messageId = 0

  private static readonly DEFAULT_HEARTBEAT: HeartbeatConfig = {
    enabled: true,
    interval: 30000,
    timeout: 5000,
    message: 'ping',
  }

  private static readonly DEFAULT_RECONNECT: ReconnectConfig = {
    enabled: true,
    maxRetries: -1,
    delay: 1000,
    exponentialBackoff: true,
    maxDelay: 30000,
  }

  private static readonly DEFAULT_MESSAGE_QUEUE: MessageQueueConfig = {
    enabled: true,
    maxSize: 100,
    cacheOnDisconnect: true,
  }

  constructor(config: WebSocketDataSourceConfig) {
    this._config = config
  }

  get status(): DataSourceStatus {
    return this._status
  }

  get config(): WebSocketDataSourceConfig {
    return this._config
  }

  async initialize(): Promise<void> {
    this.setStatus('idle')
    if (this._config.autoConnect !== false) {
      await this.connect()
    }
  }

  async connect(): Promise<void> {
    if (this._status === 'connected' || this._status === 'connecting') {
      return
    }

    this.isManualDisconnect = false
    this.setStatus('connecting')

    return new Promise((resolve, reject) => {
      try {
        const { url, protocols } = this._config
        this.ws = protocols ? new WebSocket(url, protocols) : new WebSocket(url)

        this.ws.onopen = () => {
          this.reconnectAttempts = 0
          this.setStatus('connected')
          this.emit('connect', {})
          this.startHeartbeat()
          this.flushMessageQueue()
          resolve()
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.ws.onerror = (error) => {
          console.error(`[WebSocketAdapter] 连接错误: ${this._config.id}`, error)
          this.emit('error', { error: new Error('WebSocket error') })
        }

        this.ws.onclose = (event) => {
          this.handleClose(event)
        }
      } catch (error) {
        this.setStatus('error')
        this.emit('error', { error: error as Error })
        reject(error)
      }
    })
  }

  async disconnect(): Promise<void> {
    this.isManualDisconnect = true
    this.stopHeartbeat()
    this.stopReconnect()

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect')
      this.ws = null
    }

    this.setStatus('disconnected')
    this.emit('disconnect', {})
  }

  async send(data: unknown): Promise<void> {
    const message = this.formatMessage(data)

    if (this._status !== 'connected' || !this.ws) {
      const queueConfig = this.getMessageQueueConfig()
      if (queueConfig.enabled && queueConfig.cacheOnDisconnect) {
        this.queueMessage(data)
        console.log(`[WebSocketAdapter] 连接断开，消息已加入队列`)
        return
      }
      throw new Error('WebSocket is not connected')
    }

    try {
      this.ws.send(message)
    } catch (error) {
      this.emit('error', { error: error as Error })
      throw error
    }
  }

  private formatMessage(data: unknown): string {
    const format = this._config.messageFormat || 'json'

    switch (format) {
      case 'json':
        return typeof data === 'string' ? data : JSON.stringify(data)
      case 'text':
        return String(data)
      case 'binary':
        return data as string
      default:
        return JSON.stringify(data)
    }
  }

  private handleMessage(rawData: string): void {
    const heartbeatConfig = this.getHeartbeatConfig()
    if (heartbeatConfig.enabled && this.isHeartbeatResponse(rawData)) {
      this.handleHeartbeatResponse()
      return
    }

    let data: unknown = rawData

    try {
      if (this._config.messageFormat !== 'text') {
        data = JSON.parse(rawData)
      }
    } catch {
      // 保持原始数据
    }

    this.emit('data', { data })
  }

  private isHeartbeatResponse(data: string): boolean {
    const heartbeatConfig = this.getHeartbeatConfig()

    if (typeof heartbeatConfig.expectedResponse === 'function') {
      try {
        const parsed = JSON.parse(data)
        return heartbeatConfig.expectedResponse(parsed)
      } catch {
        return heartbeatConfig.expectedResponse(data)
      }
    }

    if (typeof heartbeatConfig.expectedResponse === 'string') {
      return data === heartbeatConfig.expectedResponse
    }

    return data === 'pong' || data === 'ping'
  }

  private handleHeartbeatResponse(): void {
    this.clearHeartbeatTimeout()
  }

  private handleClose(_event: CloseEvent): void {
    this.stopHeartbeat()
    this.ws = null

    if (!this.isManualDisconnect) {
      this.setStatus('disconnected')
      this.emit('disconnect', {})

      const reconnectConfig = this.getReconnectConfig()
      if (reconnectConfig.enabled) {
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect(): void {
    const reconnectConfig = this.getReconnectConfig()

    if (reconnectConfig.maxRetries > 0 && this.reconnectAttempts >= reconnectConfig.maxRetries) {
      console.error(`[WebSocketAdapter] 已达最大重连次数: ${reconnectConfig.maxRetries}`)
      this.setStatus('error')
      return
    }

    const delay = this.calculateReconnectDelay(reconnectConfig)
    this.reconnectAttempts++

    console.log(`[WebSocketAdapter] ${delay}ms 后尝试重连 (${this.reconnectAttempts})`)

    this.reconnectTimer = setTimeout(async () => {
      this.emit('reconnect', { data: this.reconnectAttempts })
      try {
        await this.connect()
      } catch (error) {
        console.error(`[WebSocketAdapter] 重连失败:`, error)
      }
    }, delay)
  }

  private calculateReconnectDelay(config: Required<ReconnectConfig>): number {
    if (!config.exponentialBackoff) {
      return config.delay!
    }

    const delay = config.delay! * Math.pow(2, this.reconnectAttempts - 1)
    return Math.min(delay, config.maxDelay!)
  }

  private stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.reconnectAttempts = 0
  }

  private getHeartbeatConfig(): HeartbeatConfig {
    return { ...WebSocketAdapter.DEFAULT_HEARTBEAT, ...this._config.heartbeat }
  }

  private startHeartbeat(): void {
    const heartbeatConfig = this.getHeartbeatConfig()
    if (!heartbeatConfig.enabled) return

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat()
    }, heartbeatConfig.interval)
  }

  private sendHeartbeat(): void {
    if (!this.ws || this._status !== 'connected') return

    const heartbeatConfig = this.getHeartbeatConfig()
    const message = heartbeatConfig.message

    try {
      const payload = typeof message === 'object' ? JSON.stringify(message) : String(message)
      this.ws.send(payload)
      this.setHeartbeatTimeout()
    } catch (error) {
      console.error(`[WebSocketAdapter] 发送心跳失败:`, error)
    }
  }

  private setHeartbeatTimeout(): void {
    this.clearHeartbeatTimeout()

    const heartbeatConfig = this.getHeartbeatConfig()
    const timeout = heartbeatConfig.timeout || 5000

    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.warn(`[WebSocketAdapter] 心跳超时，重新连接`)
      this.reconnect()
    }, timeout)
  }

  private clearHeartbeatTimeout(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    this.clearHeartbeatTimeout()
  }

  private async reconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    await this.connect()
  }

  private getMessageQueueConfig(): MessageQueueConfig {
    return { ...WebSocketAdapter.DEFAULT_MESSAGE_QUEUE, ...this._config.messageQueue }
  }

  private queueMessage(data: unknown): void {
    const queueConfig = this.getMessageQueueConfig()
    if (!queueConfig.enabled) return

    const maxSize = queueConfig.maxSize || 100

    if (this.messageQueue.length >= maxSize) {
      this.messageQueue.shift()
    }

    this.messageQueue.push({
      id: `msg_${++this.messageId}`,
      data,
      timestamp: Date.now(),
      retries: 0,
    })
  }

  private flushMessageQueue(): void {
    if (this.messageQueue.length === 0) return

    console.log(`[WebSocketAdapter] 发送队列中的 ${this.messageQueue.length} 条消息`)

    const failedMessages: QueuedMessage[] = []

    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift()!
      try {
        this.ws?.send(this.formatMessage(msg.data))
      } catch {
        msg.retries++
        if (msg.retries < 3) {
          failedMessages.push(msg)
        }
      }
    }

    this.messageQueue = failedMessages
  }

  private setStatus(status: DataSourceStatus): void {
    this._status = status
    this.emit('status', { data: status })
  }

  on(event: DataSourceEventType, handler: DataSourceEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
  }

  off(event: DataSourceEventType, handler: DataSourceEventHandler): void {
    this.eventHandlers.get(event)?.delete(handler)
  }

  offAll(): void {
    this.eventHandlers.clear()
  }

  private emit(type: DataSourceEventType, payload: { data?: unknown; error?: Error }): void {
    const event: DataSourceEvent = {
      type,
      dataSourceId: this._config.id,
      data: payload.data,
      error: payload.error,
      timestamp: Date.now(),
    }

    const handlers = this.eventHandlers.get(type)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event)
        } catch (error) {
          console.error(`[WebSocketAdapter] 事件处理器错误:`, error)
        }
      })
    }
  }

  destroy(): void {
    this.isManualDisconnect = true
    this.stopHeartbeat()
    this.stopReconnect()
    this.disconnect()
    this.messageQueue = []
    this.offAll()
    this._status = 'idle'
    console.log(`[WebSocketAdapter] 已销毁: ${this._config.id}`)
  }
}

export function createWebSocketAdapter(config: WebSocketDataSourceConfig): WebSocketAdapter {
  return new WebSocketAdapter(config)
}
