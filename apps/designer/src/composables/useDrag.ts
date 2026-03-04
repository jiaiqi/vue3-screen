import type { Ref } from 'vue'
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'
import { useCanvasStore } from '@/stores/canvas'
import { useSelectionStore } from '@/stores/selection'
import { useSnap } from './useSnap'
import type { NodeLayout } from '@screen/core'

export interface DragItem {
  id: string
  layout: NodeLayout
}

export function useDrag(
  el: Ref<HTMLElement | null>,
  item: DragItem,
  nodes: DragItem[],
  onMove?: (id: string, x: number, y: number) => void
) {
  const canvasStore = useCanvasStore()
  const selectionStore = useSelectionStore()
  const { snapToPoint } = useSnap()

  const isDragging = ref(false)
  const dragStartPos = ref({ x: 0, y: 0 })
  const dragOffset = ref({ x: 0, y: 0 })

  const { position, isDragging: vueUseDragging } = useDraggable(el, {
    onStart: (pos, event) => {
      if (!el.value) return
      
      const rect = el.value.getBoundingClientRect()
      dragStartPos.value = { x: item.layout.x, y: item.layout.y }
      dragOffset.value = {
        x: pos.x - rect.left,
        y: pos.y - rect.top,
      }
      isDragging.value = true

      if (!selectionStore.isSelected(item.id)) {
        if (!event.shiftKey) {
          selectionStore.clearSelection()
        }
        selectionStore.select(item.id)
      }
    },
    onMove: (pos) => {
      if (!isDragging.value) return

      const canvasPos = {
        x: (pos.x - dragOffset.value.x - canvasStore.offsetX) / canvasStore.scale,
        y: (pos.y - dragOffset.value.y - canvasStore.offsetY) / canvasStore.scale,
      }

      const snapResult = snapToPoint(
        canvasPos.x,
        canvasPos.y,
        nodes,
        Array.from(selectionStore.selectedIds)
      )

      const dx = snapResult.x - dragStartPos.value.x
      const dy = snapResult.y - dragStartPos.value.y

      selectionStore.selectedIds.forEach(id => {
        const node = nodes.find(n => n.id === id)
        if (node && onMove) {
          onMove(id, node.layout.x + dx, node.layout.y + dy)
        }
      })
    },
    onEnd: () => {
      isDragging.value = false
    },
  })

  return {
    isDragging,
    position,
  }
}
