import type { GraphNodeMeta, GraphNodeInstance } from './types'
import { ref, computed } from 'vue'

const nodes = ref<Map<string, GraphNodeInstance>>(new Map())

export function registerGraphNode(meta: GraphNodeMeta, component: any) {
  nodes.value.set(meta.type, {
    id: meta.type,
    type: meta.type,
    meta,
    component,
  })
}

export function unregisterGraphNode(type: string) {
  nodes.value.delete(type)
}

export function getGraphNode(type: string): GraphNodeInstance | undefined {
  return nodes.value.get(type)
}

export function getGraphNodesByCategory(category: string): GraphNodeInstance[] {
  return Array.from(nodes.value.values()).filter(
    n => n.meta.category === category
  )
}

export function getAllGraphNodes(): GraphNodeInstance[] {
  return Array.from(nodes.value.values())
}

export const graphNodeCategories = computed(() => {
  const cats = new Set<string>()
  nodes.value.forEach(n => cats.add(n.meta.category))
  return Array.from(cats)
})
