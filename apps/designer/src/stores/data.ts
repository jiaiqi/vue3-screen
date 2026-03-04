import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DataSource } from '@screen/core'

export const useDataStore = defineStore('data', () => {
  const dataSources = ref<DataSource[]>([])
  const dataCache = ref<Map<string, unknown>>(new Map())
  const loadingStates = ref<Map<string, boolean>>(new Map())

  function addDataSource(dataSource: DataSource) {
    dataSources.value.push(dataSource)
  }

  function removeDataSource(id: string) {
    const index = dataSources.value.findIndex(ds => ds.id === id)
    if (index > -1) {
      dataSources.value.splice(index, 1)
      dataCache.value.delete(id)
    }
  }

  function updateDataSource(id: string, updates: Partial<DataSource>) {
    const ds = dataSources.value.find(d => d.id === id)
    if (ds) {
      Object.assign(ds, updates)
    }
  }

  async function fetchData(id: string): Promise<unknown> {
    const ds = dataSources.value.find(d => d.id === id)
    if (!ds) return null

    loadingStates.value.set(id, true)

    try {
      let data: unknown

      if (ds.type === 'rest') {
        const response = await fetch(ds.config.url as string, {
          method: (ds.config.method as string) || 'GET',
          headers: ds.config.headers as Record<string, string>,
          body: ds.config.body ? JSON.stringify(ds.config.body) : undefined,
        })
        data = await response.json()
      } else if (ds.type === 'static') {
        data = ds.config.data
      } else {
        data = null
      }

      dataCache.value.set(id, data)
      return data
    } catch (error) {
      console.error(`Failed to fetch data source ${id}:`, error)
      return null
    } finally {
      loadingStates.value.set(id, false)
    }
  }

  function getCachedData(id: string): unknown {
    return dataCache.value.get(id)
  }

  function isLoading(id: string): boolean {
    return loadingStates.value.get(id) || false
  }

  return {
    dataSources,
    dataCache,
    loadingStates,
    addDataSource,
    removeDataSource,
    updateDataSource,
    fetchData,
    getCachedData,
    isLoading,
  }
})
