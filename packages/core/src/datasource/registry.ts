import type {
  DataSourceType,
  DataSourceAdapter,
  DataSourceConfigBase,
  AdapterFactory,
  DataSourceInstance,
  DataSourceStatus,
  DataSourceEventType,
  DataSourceEventHandler,
  DataSourceEvent,
} from './types'

export class DataSourceRegistry {
  private factories: Map<DataSourceType, AdapterFactory> = new Map()
  private instances: Map<string, DataSourceInstance> = new Map()
  private globalHandlers: Map<string, Set<DataSourceEventHandler>> = new Map()

  register<TConfig extends DataSourceConfigBase>(
    type: DataSourceType,
    factory: AdapterFactory<TConfig>
  ): void {
    if (this.factories.has(type)) {
      console.warn(`[DataSourceRegistry] 适配器类型 "${type}" 已存在，将被覆盖`)
    }
    this.factories.set(type, factory as AdapterFactory)
    console.log(`[DataSourceRegistry] 已注册适配器: ${type}`)
  }

  unregister(type: DataSourceType): boolean {
    return this.factories.delete(type)
  }

  hasFactory(type: DataSourceType): boolean {
    return this.factories.has(type)
  }

  getRegisteredTypes(): DataSourceType[] {
    return Array.from(this.factories.keys())
  }

  createInstance<TConfig extends DataSourceConfigBase>(
    config: TConfig
  ): DataSourceInstance | null {
    const factory = this.factories.get(config.type)
    if (!factory) {
      console.error(`[DataSourceRegistry] 未找到适配器类型: ${config.type}`)
      return null
    }

    if (this.instances.has(config.id)) {
      this.destroyInstance(config.id)
    }

    try {
      const adapter = factory(config) as DataSourceAdapter<TConfig>
      const instance: DataSourceInstance = {
        id: config.id,
        name: config.name,
        type: config.type,
        adapter,
        status: 'idle',
        createdAt: Date.now(),
      }

      this.instances.set(config.id, instance)
      this.setupInstanceEventHandlers(instance)

      console.log(`[DataSourceRegistry] 已创建数据源实例: ${config.id}`)
      return instance
    } catch (error) {
      console.error(`[DataSourceRegistry] 创建实例失败: ${config.id}`, error)
      return null
    }
  }

  getInstance(id: string): DataSourceInstance | undefined {
    return this.instances.get(id)
  }

  getAllInstances(): DataSourceInstance[] {
    return Array.from(this.instances.values())
  }

  getInstancesByType(type: DataSourceType): DataSourceInstance[] {
    return Array.from(this.instances.values()).filter((instance) => instance.type === type)
  }

  updateInstanceStatus(id: string, status: DataSourceStatus): void {
    const instance = this.instances.get(id)
    if (instance) {
      instance.status = status
      instance.lastActivity = Date.now()
    }
  }

  destroyInstance(id: string): boolean {
    const instance = this.instances.get(id)
    if (!instance) {
      return false
    }

    try {
      instance.adapter.destroy()
      this.instances.delete(id)
      console.log(`[DataSourceRegistry] 已销毁数据源实例: ${id}`)
      return true
    } catch (error) {
      console.error(`[DataSourceRegistry] 销毁实例失败: ${id}`, error)
      return false
    }
  }

  destroyAllInstances(): void {
    for (const id of this.instances.keys()) {
      this.destroyInstance(id)
    }
  }

  subscribeGlobal(eventType: DataSourceEventType, handler: DataSourceEventHandler): void {
    if (!this.globalHandlers.has(eventType)) {
      this.globalHandlers.set(eventType, new Set())
    }
    this.globalHandlers.get(eventType)!.add(handler)
  }

  unsubscribeGlobal(eventType: DataSourceEventType, handler: DataSourceEventHandler): void {
    this.globalHandlers.get(eventType)?.delete(handler)
  }

  private setupInstanceEventHandlers(instance: DataSourceInstance): void {
    const eventTypes: DataSourceEventType[] = ['data', 'error', 'status', 'connect', 'disconnect', 'reconnect']

    eventTypes.forEach((eventType) => {
      instance.adapter.on(eventType, (event) => {
        if (eventType === 'status') {
          instance.status = event.data as DataSourceStatus
        } else if (eventType === 'connect') {
          instance.status = 'connected'
        } else if (eventType === 'disconnect') {
          instance.status = 'disconnected'
        } else if (eventType === 'error') {
          instance.status = 'error'
        }

        instance.lastActivity = Date.now()
        this.emitGlobal(eventType, event)
      })
    })
  }

  private emitGlobal(eventType: DataSourceEventType, event: DataSourceEvent): void {
    const handlers = this.globalHandlers.get(eventType)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event)
        } catch (error) {
          console.error(`[DataSourceRegistry] 全局事件处理器错误:`, error)
        }
      })
    }
  }

  getStats(): {
    registeredTypes: number
    totalInstances: number
    instancesByType: Record<string, number>
    instancesByStatus: Record<string, number>
  } {
    const instancesByType: Record<string, number> = {}
    const instancesByStatus: Record<string, number> = {}

    this.instances.forEach((instance) => {
      instancesByType[instance.type] = (instancesByType[instance.type] || 0) + 1
      instancesByStatus[instance.status] = (instancesByStatus[instance.status] || 0) + 1
    })

    return {
      registeredTypes: this.factories.size,
      totalInstances: this.instances.size,
      instancesByType,
      instancesByStatus,
    }
  }
}

export const dataSourceRegistry = new DataSourceRegistry()
