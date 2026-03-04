import { ref, computed } from 'vue'

interface CacheEntry {
  data: unknown
  timestamp: number
  ttl: number
}

export function useDataCache() {
  const cache = ref<Map<string, CacheEntry>>(new Map())

  function set(key: string, data: unknown, ttl: number = 60000): void {
    cache.value.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  function get(key: string): unknown | null {
    const entry = cache.value.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.value.delete(key)
      return null
    }

    return entry.data
  }

  function has(key: string): boolean {
    const entry = cache.value.get(key)
    if (!entry) return false

    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.value.delete(key)
      return false
    }

    return true
  }

  function remove(key: string): void {
    cache.value.delete(key)
  }

  function clear(): void {
    cache.value.clear()
  }

  function getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 60000
  ): Promise<T> {
    if (has(key)) {
      return Promise.resolve(get(key) as T)
    }

    return fetcher().then(data => {
      set(key, data, ttl)
      return data
    })
  }

  const size = computed(() => cache.value.size)

  return {
    set,
    get,
    has,
    remove,
    clear,
    getOrSet,
    size,
  }
}
