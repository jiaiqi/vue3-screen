import type { Ref, ComputedRef } from 'vue'
import { ref, computed, onUnmounted } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useSelectionStore } from '@/stores/selection'
import { useSnap } from './useSnap'
import type { NodeLayout, ComponentNode } from '@screen/core'
import { MoveCommand, BatchCommand } from '@screen/core'

export interface DragNode {
  id: string
  layout: NodeLayout
}

export interface DragOptions {
  nodes: ComputedRef<DragNode[]>
  onMoveStart?: (id: string) => void
  onMove?: (id: string, x: number, y: number) => void
  onMoveEnd?: (moves: { id: string; oldX: number; oldY: number; newX: number; newY: number }[]) => void
}

export function useDrag(
  containerRef: Ref<HTMLElement | null>,
  options: DragOptions
) {
  const canvasStore = useCanvasStore()
  const selectionStore = useSelectionStore()
  const { snapToGrid, snapRect } = useSnap()

  const isDragging = ref(false)
  const dragStartPos = ref({ x: 0, y: 0 })
  const dragOffset = ref({ x: 0, y: 0 })
  const initialPositions = ref<Map<string, { x: number; y: number }>>(new Map())
  const currentNodeId = ref<string | null>(null)

  const selectedNodes = computed(() => {
    return options.nodes.value.filter(n => selectionStore.isSelected(n.id))
  })

  function screenToCanvas(screenX: number, screenY: number) {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: (screenX - rect.left - canvasStore.offsetX) / canvasStore.scale,
      y: (screenY - rect.top - canvasStore.offsetY) / canvasStore.scale,
    }
  }

  function startDrag(e: MouseEvent, nodeId: string) {
    if (e.button !== 0) return

    const node = options.nodes.value.find(n => n.id === nodeId)
    if (!node) return

    e.preventDefault()
    e.stopPropagation()

    currentNodeId.value = nodeId

    if (!selectionStore.isSelected(nodeId)) {
      if (!e.shiftKey) {
        selectionStore.clearSelection()
      }
      selectionStore.select(nodeId)
    }

    const canvasPos = screenToCanvas(e.clientX, e.clientY)
    dragStartPos.value = { x: node.layout.x, y: node.layout.y }
    dragOffset.value = {
      x: canvasPos.x - node.layout.x,
      y: canvasPos.y - node.layout.y,
    }

    initialPositions.value.clear()
    selectedNodes.value.forEach(n => {
      initialPositions.value.set(n.id, { x: n.layout.x, y: n.layout.y })
    })

    isDragging.value = true

    if (options.onMoveStart) {
      options.onMoveStart(nodeId)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging.value || !currentNodeId.value) return

    const canvasPos = screenToCanvas(e.clientX, e.clientY)

    const targetX = canvasPos.x - dragOffset.value.x
    const targetY = canvasPos.y - dragOffset.value.y

    const snappedX = snapToGrid(targetX)
    const snappedY = snapToGrid(targetY)

    const dx = snappedX - dragStartPos.value.x
    const dy = snappedY - dragStartPos.value.y

    selectedNodes.value.forEach(node => {
      const initial = initialPositions.value.get(node.id)
      if (!initial) return

      const newX = snapToGrid(initial.x + dx)
      const newY = snapToGrid(initial.y + dy)

      if (options.onMove) {
        options.onMove(node.id, newX, newY)
      }
    })
  }

  function handleMouseUp(e: MouseEvent) {
    if (!isDragging.value) return

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    const moves: { id: string; oldX: number; oldY: number; newX: number; newY: number }[] = []

    selectedNodes.value.forEach(node => {
      const initial = initialPositions.value.get(node.id)
      if (!initial) return

      if (node.layout.x !== initial.x || node.layout.y !== initial.y) {
        moves.push({
          id: node.id,
          oldX: initial.x,
          oldY: initial.y,
          newX: node.layout.x,
          newY: node.layout.y,
        })
      }
    })

    if (options.onMoveEnd && moves.length > 0) {
      options.onMoveEnd(moves)
    }

    isDragging.value = false
    currentNodeId.value = null
    initialPositions.value.clear()
  }

  function getDragStyle(nodeId: string) {
    if (!isDragging.value || !selectionStore.isSelected(nodeId)) {
      return {}
    }
    return {
      cursor: 'grabbing',
    }
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    isDragging,
    currentNodeId,
    selectedNodes,
    startDrag,
    getDragStyle,
    screenToCanvas,
  }
}

export function createMoveCommands(
  moves: { id: string; oldX: number; oldY: number; newX: number; newY: number }[],
  nodes: ComponentNode[]
): BatchCommand | null {
  if (moves.length === 0) return null

  const commands = moves.map(move => {
    const node = nodes.find(n => n.id === move.id)
    if (!node) return null

    const deltaX = move.newX - move.oldX
    const deltaY = move.newY - move.oldY

    return new MoveCommand(
      [{ id: node.id, layout: node.layout }],
      deltaX,
      deltaY
    )
  }).filter((cmd): cmd is MoveCommand => cmd !== null)

  if (commands.length === 0) return null
  if (commands.length === 1) return new BatchCommand(commands)

  return new BatchCommand(commands)
}
