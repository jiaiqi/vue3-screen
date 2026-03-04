type EventHandler<T = unknown> = (payload: T) => void

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map()

  on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler as EventHandler)
    
    return () => this.off(event, handler)
  }

  off<T = unknown>(event: string, handler: EventHandler<T>): void {
    this.handlers.get(event)?.delete(handler as EventHandler)
  }

  emit<T = unknown>(event: string, payload: T): void {
    this.handlers.get(event)?.forEach(handler => handler(payload))
  }

  once<T = unknown>(event: string, handler: EventHandler<T>): void {
    const wrappedHandler: EventHandler<T> = (payload) => {
      this.off(event, wrappedHandler)
      handler(payload)
    }
    this.on(event, wrappedHandler)
  }

  clear(event?: string): void {
    if (event) {
      this.handlers.delete(event)
    } else {
      this.handlers.clear()
    }
  }
}

export const eventBus = new EventBus()
export type { EventBus }
