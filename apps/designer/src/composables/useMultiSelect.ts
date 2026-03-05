import type { Ref, ComputedRef } from 'vue'
import { ref, computed, onUnmounted } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import { useCanvasStore } from '@/stores/canvas'
import type { NodeLayout } from '@screen/core'

export interface SelectableNode {
  id: string
  layout: NodeLayout
}

export interface SelectionRect {
  x: number
  y: number
  width: number
  height: number
}

export interface MultiSelectOptions {
  nodes: ComputedRef<SelectableNode[]>
  onSelectionChange?: (ids: string[]) => void
}

export function useMultiSelect(
  containerRef: Ref<HTMLElement | null>,
  options: MultiSelectOptions
) {
  const selectionStore = useSelectionStore()
  const canvasStore = useCanvasStore()

  const isSelecting = ref(false)
  const selectionRect = ref<SelectionRect>({ x: 0, y: 0, width: 0, height: 0 })
  const startPoint = ref({ x: 0, y: 0 })
  const startCanvasPoint = ref({ x: 0, y: 0 })
  const isShiftPressed = ref(false)

  function screenToCanvas(screenX: number, screenY: number) {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: (screenX - rect.left - canvasStore.offsetX) / canvasStore.scale,
      y: (screenY - rect.top - canvasStore.offsetY) / canvasStore.scale,
    }
  }

  function startSelection(e: MouseEvent) {
    if (!containerRef.value) return
    if ((e.target as HTMLElement).closest('.node')) return
    if ((e.target as HTMLElement).closest('.resize-handle')) return
    if (e.button !== 0) return

    const canvasPos = screenToCanvas(e.clientX, e.clientY)

    isSelecting.value = true
    isShiftPressed.value = e.shiftKey
    startPoint.value = { x: e.clientX, y: e.clientY }
    startCanvasPoint.value = canvasPos
    selectionRect.value = { x: canvasPos.x, y: canvasPos.y, width: 0, height: 0 }

    if (!e.shiftKey) {
      selectionStore.clearSelection()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isSelecting.value || !containerRef.value) return

    const canvasPos = screenToCanvas(e.clientX, e.clientY)

    const minX = Math.min(startCanvasPoint.value.x, canvasPos.x)
    const minY = Math.min(startCanvasPoint.value.y, canvasPos.y)
    const maxX = Math.max(startCanvasPoint.value.x, canvasPos.x)
    const maxY = Math.max(startCanvasPoint.value.y, canvasPos.y)

    selectionRect.value = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }

    updateSelectionInRect()
  }

  function handleMouseUp() {
    if (!isSelecting.value) return

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    isSelecting.value = false
    selectionRect.value = { x: 0, y: 0, width: 0, height: 0 }
  }

  function updateSelectionInRect() {
    const rect = selectionRect.value

    if (rect.width < 5 && rect.height < 5) return

    const selectedIds: string[] = []

    options.nodes.value.forEach(node => {
      if (rectsIntersect(rect, {
        x: node.layout.x,
        y: node.layout.y,
        width: node.layout.w,
        height: node.layout.h,
      })) {
        selectedIds.push(node.id)
      }
    })

    if (isShiftPressed.value) {
      selectedIds.forEach(id => {
        selectionStore.addToSelection(id)
      })
    } else {
      selectionStore.selectMultiple(selectedIds)
    }

    if (options.onSelectionChange) {
      options.onSelectionChange(selectedIds)
    }
  }

  function rectsIntersect(
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number }
  ): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    )
  }

  function selectAll() {
    const allIds = options.nodes.value.map(n => n.id)
    selectionStore.selectMultiple(allIds)
  }

  function invertSelection() {
    const currentSelected = new Set(Array.from(selectionStore.selectedIds))
    const allIds = options.nodes.value.map(n => n.id)
    const newSelected = allIds.filter(id => !currentSelected.has(id))
    selectionStore.selectMultiple(newSelected)
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    isSelecting,
    selectionRect,
    startSelection,
    selectAll,
    invertSelection,
    screenToCanvas,
  }
}

export function getSelectionBounds(
  nodes: SelectableNode[],
  selectedIds: Set<string>
): SelectionRect | null {
  const selectedNodes = nodes.filter(n => selectedIds.has(n.id))
  if (selectedNodes.length === 0) return null

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  selectedNodes.forEach(node => {
    minX = Math.min(minX, node.layout.x)
    minY = Math.min(minY, node.layout.y)
    maxX = Math.max(maxX, node.layout.x + node.layout.w)
    maxY = Math.max(maxY, node.layout.y + node.layout.h)
  })

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}
