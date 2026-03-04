import { ref, computed } from 'vue'
import { useDesignerStore } from '@/stores/designer'

export function useLayerSort() {
  const designerStore = useDesignerStore()

  function moveUp(id: string) {
    const nodes = designerStore.nodes
    const index = nodes.findIndex(n => n.id === id)
    if (index < nodes.length - 1) {
      const temp = nodes[index]
      nodes[index] = nodes[index + 1]
      nodes[index + 1] = temp
    }
  }

  function moveDown(id: string) {
    const nodes = designerStore.nodes
    const index = nodes.findIndex(n => n.id === id)
    if (index > 0) {
      const temp = nodes[index]
      nodes[index] = nodes[index - 1]
      nodes[index - 1] = temp
    }
  }

  function moveToTop(id: string) {
    const nodes = designerStore.nodes
    const index = nodes.findIndex(n => n.id === id)
    if (index > 0) {
      const node = nodes.splice(index, 1)[0]
      nodes.unshift(node)
    }
  }

  function moveToBottom(id: string) {
    const nodes = designerStore.nodes
    const index = nodes.findIndex(n => n.id === id)
    if (index < nodes.length - 1) {
      const node = nodes.splice(index, 1)[0]
      nodes.push(node)
    }
  }

  return {
    moveUp,
    moveDown,
    moveToTop,
    moveToBottom,
  }
}
