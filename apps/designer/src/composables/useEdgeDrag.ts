import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { useCanvasStore } from '@/stores/canvas'

export interface PortInfo {
  id: string
  nodeId: string
  position: 'top' | 'right' | 'bottom' | 'left'
  portType: 'input' | 'output' | 'both'
  offset?: { x: number; y: number }
  dataType?: string
}

export interface EdgePreviewData {
  sourcePortId: string
  sourceNodeId: string
  sourcePosition: 'top' | 'right' | 'bottom' | 'left'
  targetX: number
  targetY: number
  targetPortId?: string
  isValid: boolean
  path: string
}

export interface UseEdgeDragOptions {
  canvasStore: ReturnType<typeof useCanvasStore>
  containerRef: Ref<HTMLElement | null>
  onEdgeCreate?: (sourcePortId: string, targetPortId: string) => void
  onEdgeDrag?: (edgeData: EdgePreviewData) => void
  onEdgeEnd?: () => void
}

export function useEdgeDrag(options: UseEdgeDragOptions) {
  const { canvasStore, containerRef } = options
  
  const isDraggingEdge = ref(false)
  const dragSourcePort = ref<PortInfo | null>(null)
  const edgePreview = ref<EdgePreviewData | null>(null)
  const dragStartPos = ref({ x: 0, y: 0 })
  const currentMousePos = ref({ x: 0, y: 0 })

  function screenToCanvas(screenX: number, screenY: number) {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: (screenX - rect.left - canvasStore.offsetX) / canvasStore.scale,
      y: (screenY - rect.top - canvasStore.offsetY) / canvasStore.scale,
    }
  }

  function getPortPosition(port: PortInfo): { x: number; y: number } {
    const nodeElement = document.querySelector(`[data-node-id="${port.nodeId}"]`)
    if (!nodeElement) return { x: 0, y: 0 }

    const nodeRect = nodeElement.getBoundingClientRect()
    const containerRect = containerRef.value?.getBoundingClientRect()
    if (!containerRect) return { x: 0, y: 0 }

    const nodeLeft = (nodeRect.left - containerRect.left - canvasStore.offsetX) / canvasStore.scale
    const nodeTop = (nodeRect.top - containerRect.top - canvasStore.offsetY) / canvasStore.scale
    const nodeWidth = nodeRect.width / canvasStore.scale
    const nodeHeight = nodeRect.height / canvasStore.scale

    const offsetX = (port.offset?.x || 50) / 100
    const offsetY = (port.offset?.y || 50) / 100

    switch (port.position) {
      case 'top':
        return {
          x: nodeLeft + nodeWidth * offsetX,
          y: nodeTop,
        }
      case 'bottom':
        return {
          x: nodeLeft + nodeWidth * offsetX,
          y: nodeTop + nodeHeight,
        }
      case 'left':
        return {
          x: nodeLeft,
          y: nodeTop + nodeHeight * offsetY,
        }
      case 'right':
        return {
          x: nodeLeft + nodeWidth,
          y: nodeTop + nodeHeight * offsetY,
        }
      default:
        return { x: nodeLeft + nodeWidth / 2, y: nodeTop + nodeHeight / 2 }
    }
  }

  function calculatePath(
    sourcePos: { x: number; y: number },
    sourcePosition: string,
    targetPos: { x: number; y: number }
  ): string {
    const sourceX = sourcePos.x
    const sourceY = sourcePos.y
    const targetX = targetPos.x
    const targetY = targetPos.y

    const curvature = 0.5
    const controlOffset = Math.abs(targetX - sourceX) * curvature

    let controlX1: number
    let controlY1: number
    let controlX2: number
    let controlY2: number

    switch (sourcePosition) {
      case 'top':
        controlX1 = sourceX
        controlY1 = sourceY - controlOffset
        controlX2 = targetX
        controlY2 = targetY + controlOffset
        break
      case 'bottom':
        controlX1 = sourceX
        controlY1 = sourceY + controlOffset
        controlX2 = targetX
        controlY2 = targetY - controlOffset
        break
      case 'left':
        controlX1 = sourceX - controlOffset
        controlY1 = sourceY
        controlX2 = targetX + controlOffset
        controlY2 = targetY
        break
      case 'right':
        controlX1 = sourceX + controlOffset
        controlY1 = sourceY
        controlX2 = targetX - controlOffset
        controlY2 = targetY
        break
      default:
        controlX1 = sourceX
        controlY1 = sourceY
        controlX2 = targetX
        controlY2 = targetY
    }

    return `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${targetX} ${targetY}`
  }

  function handleDragStart(port: PortInfo, event: MouseEvent) {
    if (port.portType === 'input') return

    event.preventDefault()
    event.stopPropagation()

    isDraggingEdge.value = true
    dragSourcePort.value = port

    const canvasPos = screenToCanvas(event.clientX, event.clientY)
    dragStartPos.value = { ...canvasPos }
    currentMousePos.value = { ...canvasPos }

    const sourcePos = getPortPosition(port)
    
    edgePreview.value = {
      sourcePortId: port.id,
      sourceNodeId: port.nodeId,
      sourcePosition: port.position,
      targetX: canvasPos.x,
      targetY: canvasPos.y,
      isValid: true,
      path: calculatePath(sourcePos, port.position, canvasPos),
    }

    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)

    if (options.onEdgeDrag && edgePreview.value) {
      options.onEdgeDrag(edgePreview.value)
    }
  }

  function handleDragMove(event: MouseEvent) {
    if (!isDraggingEdge.value || !dragSourcePort.value || !edgePreview.value) return

    const canvasPos = screenToCanvas(event.clientX, event.clientY)
    currentMousePos.value = { ...canvasPos }

    const sourcePos = getPortPosition(dragSourcePort.value)
    
    edgePreview.value.targetX = canvasPos.x
    edgePreview.value.targetY = canvasPos.y
    edgePreview.value.path = calculatePath(sourcePos, dragSourcePort.value.position, canvasPos)

    if (options.onEdgeDrag) {
      options.onEdgeDrag(edgePreview.value)
    }
  }

  function handleDragEnd(event: MouseEvent) {
    if (!isDraggingEdge.value) return

    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)

    const targetElement = document.elementFromPoint(event.clientX, event.clientY)
    const targetPortElement = targetElement?.closest('[data-port-id]') as HTMLElement

    if (targetPortElement && dragSourcePort.value) {
      const targetPortId = targetPortElement.dataset.portId
      const targetNodeId = targetPortElement.dataset.nodeId
      const targetPortType = targetPortElement.dataset.portType as PortInfo['portType']

      if (targetPortId && targetNodeId && targetPortType !== 'output') {
        const targetPort: PortInfo = {
          id: targetPortId,
          nodeId: targetNodeId,
          position: 'right',
          portType: targetPortType,
        }

        if (options.onEdgeCreate) {
          options.onEdgeCreate(dragSourcePort.value.id, targetPortId)
        }
      }
    }

    isDraggingEdge.value = false
    dragSourcePort.value = null
    edgePreview.value = null

    if (options.onEdgeEnd) {
      options.onEdgeEnd()
    }
  }

  function cancelDrag() {
    if (!isDraggingEdge.value) return

    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)

    isDraggingEdge.value = false
    dragSourcePort.value = null
    edgePreview.value = null

    if (options.onEdgeEnd) {
      options.onEdgeEnd()
    }
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
  })

  return {
    isDraggingEdge,
    dragSourcePort,
    edgePreview,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    cancelDrag,
  }
}
