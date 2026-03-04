import type { Ref, ComputedRef } from 'vue'
import { ref } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import { useCanvasStore } from '@/stores/canvas'
import type { NodeLayout } from '@screen/core'

export interface SelectableNode {
  id: string
  layout: NodeLayout
}

export function useMultiSelect(
  containerRef: Ref<HTMLElement | null>,
  nodes: ComputedRef<SelectableNode[]>
) {
  const selectionStore = useSelectionStore()
  const canvasStore = useCanvasStore()

  const isSelecting = ref(false)
  const selectionRect = ref({ x: 0, y: 0, width: 0, height: 0 })
  const startPoint = ref({ x: 0, y: 0 })

  function startSelection(e: MouseEvent) {
    if (!containerRef.value) return
    if ((e.target as HTMLElement).closest('.node')) return

    const rect = containerRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    isSelecting.value = true
    startPoint.value = { x, y }
    selectionRect.value = { x, y, width: 0, height: 0 }

    if (!e.shiftKey) {
      selectionStore.clearSelection()
    }
  }

  function updateSelection(e: MouseEvent) {
    if (!isSelecting.value || !containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const minX = Math.min(startPoint.value.x, x)
    const minY = Math.min(startPoint.value.y, y)
    const maxX = Math.max(startPoint.value.x, x)
    const maxY = Math.max(startPoint.value.y, y)

    selectionRect.value = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }

    const canvasRect = {
      x: (minX - canvasStore.offsetX) / canvasStore.scale,
      y: (minY - canvasStore.offsetY) / canvasStore.scale,
      width: (maxX - minX) / canvasStore.scale,
      height: (maxY - minY) / canvasStore.scale,
    }

    nodes.value.forEach(node => {
      const nodeRect = {
        x: node.layout.x,
        y: node.layout.y,
        width: node.layout.w,
        height: node.layout.h,
      }

      if (rectsIntersect(canvasRect, nodeRect)) {
        selectionStore.addToSelection(node.id)
      } else if (!e.shiftKey) {
        selectionStore.removeFromSelection(node.id)
      }
    })
  }

  function endSelection() {
    isSelecting.value = false
  }

  function rectsIntersect(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    )
  }

  return {
    isSelecting,
    selectionRect,
    startSelection,
    updateSelection,
    endSelection,
  }
}
