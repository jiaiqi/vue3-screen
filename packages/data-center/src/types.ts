export type DataSourceType = 'rest' | 'websocket' | 'database' | 'mqtt' | 'static'

export interface DataSourceConfig {
  id: string
  name: string
  type: DataSourceType
  config: Record<string, unknown>
}

export interface RestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  retryCount?: number
  retryDelay?: number
}

export interface WebSocketConfig {
  url: string
  protocols?: string[]
  reconnect?: boolean
  reconnectInterval?: number
  heartbeatInterval?: number
}

export interface DatabaseConfig {
  type: 'mysql' | 'postgresql' | 'clickhouse' | 'influxdb'
  host: string
  port: number
  database: string
  username: string
  password: string
  query: string
}

export interface MqttConfig {
  broker: string
  topic: string
  clientId?: string
  username?: string
  password?: string
}

export interface StaticConfig {
  data: unknown
}

export interface DataAdapter {
  type: DataSourceType
  connect(): Promise<void>
  disconnect(): void
  fetchData(params?: Record<string, unknown>): Promise<unknown>
  subscribe?(callback: (data: unknown) => void): () => void
  isConnected(): boolean
}

export interface DataFilterContext {
  $dayjs: typeof import('dayjs')
  $_: typeof import('lodash-es')
  Math: typeof Math
  JSON: typeof JSON
  console: typeof console
}

export type DataFilter = (data: unknown, params: Record<string, unknown>, context: DataFilterContext) => unknown
