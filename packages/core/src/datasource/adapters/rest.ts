import type {
  DataSourceAdapter,
  RestDataSourceConfig,
  DataSourceStatus,
  DataSourceEventType,
  DataSourceEventHandler,
  DataSourceEvent,
  PollingConfig,
  RetryConfig,
} from '../types'

export class RestAdapter implements DataSourceAdapter<RestDataSourceConfig> {
  readonly type = 'rest' as const

  private _status: DataSourceStatus = 'idle'
  private _config: RestDataSourceConfig
  private eventHandlers: Map<DataSourceEventType, Set<DataSourceEventHandler>> = new Map()
  private pollingTimer: ReturnType<typeof setInterval> | null = null
  private abortController: AbortController | null = null
  private retryCount = 0
  private isPolling = false

  private static readonly DEFAULT_POLLING: PollingConfig = {
    enabled: false,
    interval: 30000,
    continueOnError: false,
  }

  private static readonly DEFAULT_RETRY: RetryConfig = {
    maxRetries: 3,
    delay: 1000,
    exponentialBackoff: true,
    maxDelay: 30000,
  }

  private static readonly MIN_POLLING_INTERVAL = 5000
  private static readonly MAX_POLLING_INTERVAL = 300000
  private static readonly DEFAULT_TIMEOUT = 30000

  constructor(config: RestDataSourceConfig) {
    this._config = config
  }

  get status(): DataSourceStatus {
    return this._status
  }

  get config(): RestDataSourceConfig {
    return this._config
  }

  async initialize(): Promise<void> {
    this.setStatus('idle')
    if (this._config.autoConnect !== false) {
      await this.connect()
    }
  }

  async connect(): Promise<void> {
    if (this._status === 'connected') {
      return
    }

    this.setStatus('connecting')

    try {
      await this.fetch()

      const pollingConfig = this.getPollingConfig()
      if (pollingConfig.enabled) {
        this.startPolling()
      }

      this.setStatus('connected')
    } catch (error) {
      this.setStatus('error')
      this.emit('error', { error: error as Error })
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.stopPolling()
    this.abortRequest()
    this.setStatus('disconnected')
  }

  async fetch(): Promise<unknown> {
    this.abortRequest()
    this.abortController = new AbortController()

    const retryConfig = { ...RestAdapter.DEFAULT_RETRY, ...this._config.retry }
    const timeout = this._config.timeout ?? RestAdapter.DEFAULT_TIMEOUT

    return this.fetchWithRetry(retryConfig, timeout)
  }

  private async fetchWithRetry(retryConfig: Required<RetryConfig>, timeout: number): Promise<unknown> {
    this.retryCount = 0

    while (this.retryCount <= retryConfig.maxRetries) {
      try {
        const data = await this.performRequest(timeout)
        this.retryCount = 0
        return data
      } catch (error) {
        this.retryCount++

        if (this.retryCount > retryConfig.maxRetries) {
          this.emit('error', { error: error as Error })
          throw error
        }

        const delay = this.calculateRetryDelay(retryConfig)
        console.warn(`[RestAdapter] 请求失败，${delay}ms 后重试 (${this.retryCount}/${retryConfig.maxRetries})`)

        await this.sleep(delay)
      }
    }

    throw new Error('Max retries exceeded')
  }

  private async performRequest(timeout: number): Promise<unknown> {
    const { url, method = 'GET', headers, body, params } = this._config

    const fullUrl = this.buildUrl(url, params)

    const timeoutId = setTimeout(() => {
      this.abortController?.abort()
    }, timeout)

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: this.abortController?.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      let data = await response.json()

      if (this._config.transform) {
        data = this.applyTransform(data)
      }

      this.emit('data', { data })
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  private buildUrl(baseUrl: string, params?: Record<string, string | number | boolean>): string {
    if (!params || Object.keys(params).length === 0) {
      return baseUrl
    }

    const url = new URL(baseUrl, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
    return url.toString()
  }

  private calculateRetryDelay(config: Required<RetryConfig>): number {
    if (!config.exponentialBackoff) {
      return config.delay!
    }

    const delay = config.delay! * Math.pow(2, this.retryCount - 1)
    return Math.min(delay, config.maxDelay!)
  }

  private applyTransform(data: unknown): unknown {
    try {
      const transformFn = new Function('data', `return ${this._config.transform}`)
      return transformFn(data)
    } catch (error) {
      console.error('[RestAdapter] 数据转换失败:', error)
      return data
    }
  }

  private getPollingConfig(): PollingConfig {
    const polling = this._config.polling || RestAdapter.DEFAULT_POLLING
    const interval = Math.max(
      RestAdapter.MIN_POLLING_INTERVAL,
      Math.min(RestAdapter.MAX_POLLING_INTERVAL, polling.interval)
    )
    return { ...polling, interval }
  }

  private startPolling(): void {
    if (this.isPolling) return

    const pollingConfig = this.getPollingConfig()
    this.isPolling = true

    this.pollingTimer = setInterval(async () => {
      try {
        await this.fetch()
      } catch (error) {
        if (!pollingConfig.continueOnError) {
          this.stopPolling()
        }
      }
    }, pollingConfig.interval)

    console.log(`[RestAdapter] 已启动轮询，间隔: ${pollingConfig.interval}ms`)
  }

  private stopPolling(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
      this.pollingTimer = null
    }
    this.isPolling = false
  }

  private abortRequest(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  private setStatus(status: DataSourceStatus): void {
    this._status = status
    this.emit('status', { data: status })
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
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
          console.error(`[RestAdapter] 事件处理器错误:`, error)
        }
      })
    }
  }

  destroy(): void {
    this.stopPolling()
    this.abortRequest()
    this.offAll()
    this._status = 'idle'
    console.log(`[RestAdapter] 已销毁: ${this._config.id}`)
  }
}

export function createRestAdapter(config: RestDataSourceConfig): RestAdapter {
  return new RestAdapter(config)
}
