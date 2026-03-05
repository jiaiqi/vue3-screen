import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  dataSourceFactory,
  dataSourceRegistry,
  registerBuiltinAdapters,
  type AnyDataSourceConfig,
  type DataSourceInstance,
  type DataSourceStatus,
  type DataSourceEvent,
  type DataSourceType,
} from '@screen/core'

registerBuiltinAdapters()

export const useDataSourceStore = defineStore('datasource', () => {
  const configs = ref<AnyDataSourceConfig[]>([])
  const dataCache = ref<Map<string, unknown>>(new Map())
  const errors = ref<Map<string, Error>>(new Map())
  const lastUpdated = ref<Map<string, number>>(new Map())
  const initialized = ref(false)

  const instances = computed<DataSourceInstance[]>(() => {
    return dataSourceFactory.getAll()
  })

  const instancesByType = computed(() => {
    const result: Record<DataSourceType, DataSourceInstance[]> = {
      rest: [],
      websocket: [],
      database: [],
      mqtt: [],
      static: [],
    }
    instances.value.forEach((instance) => {
      result[instance.type].push(instance)
    })
    return result
  })

  const instancesByStatus = computed(() => {
    const result: Record<DataSourceStatus, DataSourceInstance[]> = {
      idle: [],
      connecting: [],
      connected: [],
      disconnected: [],
      error: [],
    }
    instances.value.forEach((instance) => {
      result[instance.status].push(instance)
    })
    return result
  })

  const hasConnecting = computed(() => {
    return instances.value.some((i) => i.status === 'connecting')
  })

  const hasError = computed(() => {
    return instances.value.some((i) => i.status === 'error')
  })

  const stats = computed(() => {
    return dataSourceFactory.getStats()
  })

  function initialize(): void {
    if (initialized.value) return

    const eventTypes = ['data', 'error', 'status', 'connect', 'disconnect', 'reconnect'] as const

    eventTypes.forEach((eventType) => {
      dataSourceRegistry.subscribeGlobal(eventType, (event: DataSourceEvent) => {
        handleGlobalEvent(eventType, event)
      })
    })

    initialized.value = true
    console.log('[DataSourceStore] 已初始化')
  }

  function handleGlobalEvent(type: string, event: DataSourceEvent): void {
    const { dataSourceId, data, error } = event

    switch (type) {
      case 'data':
        dataCache.value.set(dataSourceId, data)
        lastUpdated.value.set(dataSourceId, Date.now())
        errors.value.delete(dataSourceId)
        break

      case 'error':
        if (error) {
          errors.value.set(dataSourceId, error)
        }
        break

      case 'connect':
        errors.value.delete(dataSourceId)
        break
    }
  }

  function addDataSource(config: AnyDataSourceConfig): DataSourceInstance | null {
    if (configs.value.some((c) => c.id === config.id)) {
      console.warn(`[DataSourceStore] 数据源已存在: ${config.id}`)
      return dataSourceFactory.get(config.id) || null
    }

    configs.value.push(config)
    return dataSourceFactory.create(config)
  }

  function addDataSources(configList: AnyDataSourceConfig[]): Map<string, DataSourceInstance | null> {
    const results = new Map<string, DataSourceInstance | null>()

    configList.forEach((config) => {
      results.set(config.id, addDataSource(config))
    })

    return results
  }

  function removeDataSource(id: string): boolean {
    const index = configs.value.findIndex((c) => c.id === id)
    if (index === -1) return false

    configs.value.splice(index, 1)
    dataCache.value.delete(id)
    errors.value.delete(id)
    lastUpdated.value.delete(id)

    return dataSourceFactory.destroy(id)
  }

  function updateDataSource(id: string, updates: Partial<AnyDataSourceConfig>): DataSourceInstance | null {
    const index = configs.value.findIndex((c) => c.id === id)
    if (index === -1) return null

    const oldConfig = configs.value[index]
    const newConfig = { ...oldConfig, ...updates } as AnyDataSourceConfig

    if (updates.type && updates.type !== oldConfig.type) {
      removeDataSource(id)
      return addDataSource(newConfig)
    }

    configs.value[index] = newConfig

    return dataSourceFactory.get(id) || null
  }

  async function connect(id: string): Promise<boolean> {
    return dataSourceFactory.connect(id)
  }

  async function disconnect(id: string): Promise<boolean> {
    return dataSourceFactory.disconnect(id)
  }

  async function connectAll(): Promise<Map<string, boolean>> {
    return dataSourceFactory.connectAll()
  }

  async function disconnectAll(): Promise<Map<string, boolean>> {
    return dataSourceFactory.disconnectAll()
  }

  async function refresh(id: string): Promise<unknown> {
    const instance = dataSourceFactory.get(id)
    if (!instance) {
      throw new Error(`数据源不存在: ${id}`)
    }

    if (instance.type !== 'rest') {
      throw new Error(`只有 REST 数据源支持手动刷新`)
    }

    const adapter = instance.adapter as { fetch?: () => Promise<unknown> }
    if (adapter.fetch) {
      return adapter.fetch()
    }

    throw new Error(`适配器不支持 fetch 操作`)
  }

  async function send(id: string, data: unknown): Promise<void> {
    const instance = dataSourceFactory.get(id)
    if (!instance) {
      throw new Error(`数据源不存在: ${id}`)
    }

    if (instance.type !== 'websocket') {
      throw new Error(`只有 WebSocket 数据源支持发送数据`)
    }

    const adapter = instance.adapter as { send?: (data: unknown) => Promise<void> }
    if (adapter.send) {
      return adapter.send(data)
    }

    throw new Error(`适配器不支持 send 操作`)
  }

  function getCachedData(id: string): unknown {
    return dataCache.value.get(id)
  }

  function getError(id: string): Error | undefined {
    return errors.value.get(id)
  }

  function getLastUpdated(id: string): number | undefined {
    return lastUpdated.value.get(id)
  }

  function getStatus(id: string): DataSourceStatus | undefined {
    return dataSourceFactory.get(id)?.status
  }

  function isLoading(id: string): boolean {
    return getStatus(id) === 'connecting'
  }

  function isConnected(id: string): boolean {
    return getStatus(id) === 'connected'
  }

  function hasErrorById(id: string): boolean {
    return errors.value.has(id) || getStatus(id) === 'error'
  }

  function clearCache(id?: string): void {
    if (id) {
      dataCache.value.delete(id)
    } else {
      dataCache.value.clear()
    }
  }

  function clearErrors(id?: string): void {
    if (id) {
      errors.value.delete(id)
    } else {
      errors.value.clear()
    }
  }

  function destroy(): void {
    dataSourceFactory.destroyAll()
    configs.value = []
    dataCache.value.clear()
    errors.value.clear()
    lastUpdated.value.clear()
    initialized.value = false
    console.log('[DataSourceStore] 已销毁')
  }

  return {
    configs,
    dataCache,
    errors,
    lastUpdated,
    initialized,

    instances,
    instancesByType,
    instancesByStatus,
    hasConnecting,
    hasError,
    stats,

    initialize,
    addDataSource,
    addDataSources,
    removeDataSource,
    updateDataSource,
    connect,
    disconnect,
    connectAll,
    disconnectAll,
    refresh,
    send,
    getCachedData,
    getError,
    getLastUpdated,
    getStatus,
    isLoading,
    isConnected,
    hasErrorById,
    clearCache,
    clearErrors,
    destroy,
  }
})
