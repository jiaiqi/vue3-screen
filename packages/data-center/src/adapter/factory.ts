import type { DataAdapter, DataSourceConfig, RestConfig, WebSocketConfig, StaticConfig } from '../types'
import { RestAdapter } from './rest'
import { WebSocketAdapter } from './websocket'

export function createAdapter(config: DataSourceConfig): DataAdapter {
  switch (config.type) {
    case 'rest':
      return new RestAdapter(config.config as RestConfig)
    case 'websocket':
      return new WebSocketAdapter(config.config as WebSocketConfig)
    case 'static':
      return new StaticAdapter(config.config as StaticConfig)
    default:
      throw new Error(`Unsupported data source type: ${config.type}`)
  }
}

class StaticAdapter implements DataAdapter {
  type = 'static' as const
  private data: unknown

  constructor(config: StaticConfig) {
    this.data = config.data
  }

  async connect(): Promise<void> {}

  disconnect(): void {}

  async fetchData(): Promise<unknown> {
    return this.data
  }

  isConnected(): boolean {
    return true
  }
}
