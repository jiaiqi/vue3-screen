import type { DataAdapter, RestConfig } from '../types'

export class RestAdapter implements DataAdapter {
  type = 'rest' as const
  private config: RestConfig
  private abortController: AbortController | null = null

  constructor(config: RestConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    // REST 不需要持久连接
  }

  disconnect(): void {
    this.abortController?.abort()
  }

  async fetchData(params?: Record<string, unknown>): Promise<unknown> {
    this.abortController = new AbortController()
    
    const timeout = this.config.timeout || 30000
    const timeoutId = setTimeout(() => this.abortController?.abort(), timeout)

    try {
      let url = this.config.url
      
      if (params && this.config.method === 'GET') {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, String(value))
        })
        url += `?${searchParams.toString()}`
      }

      const response = await fetch(url, {
        method: this.config.method,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
        body: this.config.method !== 'GET' && params 
          ? JSON.stringify(params) 
          : this.config.body 
            ? JSON.stringify(this.config.body) 
            : undefined,
        signal: this.abortController.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  isConnected(): boolean {
    return true
  }
}
