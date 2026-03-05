export * from './types'

export { DataSourceRegistry, dataSourceRegistry } from './registry'
export { DataSourceFactory, dataSourceFactory } from './factory'

export { RestAdapter, createRestAdapter } from './adapters/rest'
export { WebSocketAdapter, createWebSocketAdapter } from './adapters/websocket'

import { dataSourceRegistry } from './registry'
import { createRestAdapter } from './adapters/rest'
import { createWebSocketAdapter } from './adapters/websocket'

export function registerBuiltinAdapters(): void {
  dataSourceRegistry.register('rest', createRestAdapter)
  dataSourceRegistry.register('websocket', createWebSocketAdapter)
  console.log('[DataSource] 已注册内置适配器: rest, websocket')
}

registerBuiltinAdapters()
