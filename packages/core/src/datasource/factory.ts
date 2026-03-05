import type {
  DataSourceType,
  DataSourceAdapter,
  DataSourceConfigBase,
  AnyDataSourceConfig,
  DataSourceInstance,
} from './types'
import { DataSourceRegistry, dataSourceRegistry } from './registry'

export class DataSourceFactory {
  private registry: DataSourceRegistry

  constructor(registry: DataSourceRegistry = dataSourceRegistry) {
    this.registry = registry
  }

  create<TConfig extends DataSourceConfigBase>(config: TConfig): DataSourceInstance | null {
    return this.registry.createInstance(config)
  }

  createBatch(configs: AnyDataSourceConfig[]): Map<string, DataSourceInstance | null> {
    const results = new Map<string, DataSourceInstance | null>()
    configs.forEach((config) => {
      results.set(config.id, this.create(config))
    })
    return results
  }

  get(id: string): DataSourceInstance | undefined {
    return this.registry.getInstance(id)
  }

  getAdapter<T extends DataSourceAdapter>(id: string): T | undefined {
    const instance = this.registry.getInstance(id)
    return instance?.adapter as T | undefined
  }

  async connect(id: string): Promise<boolean> {
    const instance = this.registry.getInstance(id)
    if (!instance) {
      console.error(`[DataSourceFactory] 未找到数据源实例: ${id}`)
      return false
    }

    try {
      await instance.adapter.connect()
      return true
    } catch (error) {
      console.error(`[DataSourceFactory] 连接失败: ${id}`, error)
      return false
    }
  }

  async disconnect(id: string): Promise<boolean> {
    const instance = this.registry.getInstance(id)
    if (!instance) {
      return false
    }

    try {
      await instance.adapter.disconnect()
      return true
    } catch (error) {
      console.error(`[DataSourceFactory] 断开连接失败: ${id}`, error)
      return false
    }
  }

  async connectAll(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>()
    const instances = this.registry.getAllInstances()

    await Promise.all(
      instances.map(async (instance) => {
        results.set(instance.id, await this.connect(instance.id))
      })
    )

    return results
  }

  async disconnectAll(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>()
    const instances = this.registry.getAllInstances()

    await Promise.all(
      instances.map(async (instance) => {
        results.set(instance.id, await this.disconnect(instance.id))
      })
    )

    return results
  }

  destroy(id: string): boolean {
    return this.registry.destroyInstance(id)
  }

  destroyAll(): void {
    this.registry.destroyAllInstances()
  }

  getAll(): DataSourceInstance[] {
    return this.registry.getAllInstances()
  }

  getByType(type: DataSourceType): DataSourceInstance[] {
    return this.registry.getInstancesByType(type)
  }

  has(id: string): boolean {
    return this.registry.getInstance(id) !== undefined
  }

  getStats() {
    return this.registry.getStats()
  }
}

export const dataSourceFactory = new DataSourceFactory()
