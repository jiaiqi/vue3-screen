import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import type { CanvasConfig, GridConfig } from '@screen/core'
import type { VueFlow } from '@vue-flow/core'

export interface GuideLine {
  id: string
  type: 'horizontal' | 'vertical'
  position: number
}

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

export interface Edge {
  id: string
  sourcePortId: string
  sourceNodeId: string
  targetPortId: string
  targetNodeId: string
  dataType?: string
}

export const useCanvasStore = defineStore('canvas', () => {
  const config = ref<CanvasConfig>({
    width: 1920,
    height: 1080,
    background: { color: '#0d1117' },
    fitMode: 'scale',
    canvasMode: 'hybrid',
    grid: { enabled: true, size: 20, snap: true, color: 'rgba(255,255,255,0.05)' },
    rulers: true,
  })

  const scale = ref(0.8) // 初始缩放
  const offsetX = ref(50) // 初始偏移
  const offsetY = ref(50)
  const guides = ref<GuideLine[]>([])
  const showMinimap = ref(true)
  
  const edgeDragging = ref(false)
  const edgePreview = ref<EdgePreviewData | null>(null)
  const edges = ref<Edge[]>([])

  const scalePercent = computed(() => Math.round(scale.value * 100))

  const transform = computed(() =>
    `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`
  )

  const scaleOptions = [25, 50, 75, 100, 125, 150, 200, 300, 400]

  function setScale(newScale: number) {
    scale.value = Math.max(0.1, Math.min(5, newScale))
  }

  function setScalePercent(percent: number) {
    setScale(percent / 100)
  }

  function resetScale() {
    setScale(1)
  }

  function setOffset(x: number, y: number) {
    offsetX.value = x
    offsetY.value = y
  }

  function zoomIn() {
    setScale(scale.value * 1.1)
  }

  function zoomOut() {
    setScale(scale.value / 1.1)
  }

  function fitToScreen(containerWidth: number, containerHeight: number) {
    const scaleX = containerWidth / config.value.width
    const scaleY = containerHeight / config.value.height
    setScale(Math.min(scaleX, scaleY) * 0.95)
    setOffset(
      (containerWidth - config.value.width * scale.value) / 2,
      (containerHeight - config.value.height * scale.value) / 2
    )
  }

  function setCanvasSize(width: number, height: number) {
    config.value.width = width
    config.value.height = height
  }

  function setGridConfig(gridConfig: Partial<GridConfig>) {
    const currentGrid = config.value.grid || { enabled: true, size: 10, snap: false }
    config.value.grid = { ...currentGrid, ...gridConfig } as GridConfig
  }

  function addGuide(type: 'horizontal' | 'vertical', position: number) {
    const guide: GuideLine = {
      id: `guide-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      position,
    }
    guides.value.push(guide)
    return guide
  }

  function removeGuide(id: string) {
    const index = guides.value.findIndex(g => g.id === id)
    if (index > -1) {
      guides.value.splice(index, 1)
    }
  }

  function updateGuidePosition(id: string, position: number) {
    const guide = guides.value.find(g => g.id === id)
    if (guide) {
      guide.position = position
    }
  }

  function clearGuides() {
    guides.value = []
  }

  function toggleMinimap() {
    showMinimap.value = !showMinimap.value
  }

  function startEdgeDrag(port: PortInfo) {
    edgeDragging.value = true
    edgePreview.value = {
      sourcePortId: port.id,
      sourceNodeId: port.nodeId,
      sourcePosition: port.position,
      targetX: 0,
      targetY: 0,
      isValid: true,
      path: '',
    }
  }

  function updateEdgeDrag(x: number, y: number, isValid: boolean = true, path: string = '') {
    if (!edgePreview.value) return
    
    edgePreview.value.targetX = x
    edgePreview.value.targetY = y
    edgePreview.value.isValid = isValid
    edgePreview.value.path = path
  }

  function endEdgeDrag(targetPortId?: string) {
    if (edgePreview.value && targetPortId) {
      edgePreview.value.targetPortId = targetPortId
    }
    
    edgeDragging.value = false
    edgePreview.value = null
  }

  function addEdge(edge: Edge) {
    edges.value.push(edge)
  }

  function removeEdge(edgeId: string) {
    const index = edges.value.findIndex(e => e.id === edgeId)
    if (index > -1) {
      edges.value.splice(index, 1)
    }
  }

  function getEdgesForNode(nodeId: string): { incoming: Edge[]; outgoing: Edge[] } {
    const incoming = edges.value.filter(e => e.targetNodeId === nodeId)
    const outgoing = edges.value.filter(e => e.sourceNodeId === nodeId)
    return { incoming, outgoing }
  }

  function clearEdges() {
    edges.value = []
  }

  function cancelEdgeDrag() {
    edgeDragging.value = false
    edgePreview.value = null
  }

  return {
    config,
    scale,
    scalePercent,
    scaleOptions,
    offsetX,
    offsetY,
    transform,
    guides,
    showMinimap,
    edgeDragging,
    edgePreview,
    edges,
    setScale,
    setScalePercent,
    resetScale,
    setOffset,
    zoomIn,
    zoomOut,
    fitToScreen,
    setCanvasSize,
    setGridConfig,
    addGuide,
    removeGuide,
    updateGuidePosition,
    clearGuides,
    toggleMinimap,
    startEdgeDrag,
    updateEdgeDrag,
    endEdgeDrag,
    addEdge,
    removeEdge,
    getEdgesForNode,
    clearEdges,
    cancelEdgeDrag,
  }
})
