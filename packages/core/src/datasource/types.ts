export type DataSourceType = 'rest' | 'websocket' | 'database' | 'mqtt' | 'static'

export type DataSourceStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'

export type DataSourceEventType = 'data' | 'error' | 'status' | 'connect' | 'disconnect' | 'reconnect'

export type DataSourceEventHandler<T = unknown> = (event: DataSourceEvent<T>) => void

export interface DataSourceEvent<T = unknown> {
  type: DataSourceEventType
  dataSourceId: string
  data?: T
  error?: Error
  timestamp: number
}

export interface DataSourceConfigBase {
  id: string
  name: string
  type: DataSourceType
  autoConnect?: boolean
  enabled?: boolean
}

export interface PollingConfig {
  enabled: boolean
  interval: number
  continueOnError?: boolean
}

export interface RetryConfig {
  maxRetries: number
  delay?: number
  exponentialBackoff?: boolean
  maxDelay?: number
}

export interface RestDataSourceConfig extends DataSourceConfigBase {
  type: 'rest'
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, string | number | boolean>
  polling?: PollingConfig
  retry?: RetryConfig
  timeout?: number
  transform?: string
}

export interface HeartbeatConfig {
  enabled: boolean
  interval: number
  timeout?: number
  message?: string | object
  expectedResponse?: string | ((data: unknown) => boolean)
}

export interface ReconnectConfig {
  enabled: boolean
  maxRetries: number
  delay?: number
  exponentialBackoff?: boolean
  maxDelay?: number
}

export interface MessageQueueConfig {
  enabled: boolean
  maxSize?: number
  cacheOnDisconnect?: boolean
}

export interface WebSocketDataSourceConfig extends DataSourceConfigBase {
  type: 'websocket'
  url: string
  protocols?: string | string[]
  heartbeat?: HeartbeatConfig
  reconnect?: ReconnectConfig
  messageQueue?: MessageQueueConfig
  messageFormat?: 'json' | 'text' | 'binary'
}

export interface StaticDataSourceConfig extends DataSourceConfigBase {
  type: 'static'
  data: unknown
}

export type AnyDataSourceConfig =
  | RestDataSourceConfig
  | WebSocketDataSourceConfig
  | StaticDataSourceConfig

export interface DataSourceAdapter<TConfig extends DataSourceConfigBase = DataSourceConfigBase> {
  readonly type: DataSourceType
  readonly status: DataSourceStatus
  readonly config: TConfig

  initialize(): Promise<void>
  connect(): Promise<void>
  disconnect(): Promise<void>
  send?(data: unknown): Promise<void>
  fetch?(): Promise<unknown>
  on(event: DataSourceEventType, handler: DataSourceEventHandler): void
  off(event: DataSourceEventType, handler: DataSourceEventHandler): void
  offAll(): void
  destroy(): void
}

export type AdapterFactory<TConfig extends DataSourceConfigBase = DataSourceConfigBase> = (
  config: TConfig
) => DataSourceAdapter<TConfig>

export interface DataSourceInstance {
  id: string
  name: string
  type: DataSourceType
  adapter: DataSourceAdapter
  status: DataSourceStatus
  createdAt: number
  lastActivity?: number
}
