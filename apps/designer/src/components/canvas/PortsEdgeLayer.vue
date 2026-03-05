<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useDesignerStore } from '@/stores/designer'
import Edge from './Edge.vue'
import EdgePreview from './EdgePreview.vue'
import { calculateBezierPath } from '@/utils/edgePathfinding'
import { validateConnection } from '@/utils/edgeValidation'

const canvasStore = useCanvasStore()
const designerStore = useDesignerStore()

const selectedEdgeId = ref<string | null>(null)

const edges = computed(() => canvasStore.edges)

const isDragging = computed(() => canvasStore.edgeDragging)

const previewData = computed(() => canvasStore.edgePreview)

const nodes = computed(() => designerStore.nodes)

function getNodeById(nodeId: string) {
  return nodes.value.find(n => n.id === nodeId)
}

function getPortPosition(nodeId: string, portId: string, portType: 'source' | 'target') {
  const node = getNodeById(nodeId)
  if (!node) return { x: 0, y: 0 }

  const ports = node.data?.ports || []
  const port = ports.find((p: any) => p.id === portId)
  if (!port) return { x: 0, y: 0 }

  const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`)
  if (!nodeElement) return { x: 0, y: 0 }

  const nodeRect = nodeElement.getBoundingClientRect()
  const containerElement = document.querySelector('.canvas-container')
  if (!containerElement) return { x: 0, y: 0 }

  const containerRect = (containerElement as HTMLElement).getBoundingClientRect()
  
  const nodeLeft = (nodeRect.left - containerRect.left - canvasStore.offsetX) / canvasStore.scale
  const nodeTop = (nodeRect.top - containerRect.top - canvasStore.offsetY) / canvasStore.scale
  const nodeWidth = nodeRect.width / canvasStore.scale
  const nodeHeight = nodeRect.height / canvasStore.scale

  const offsetX = (port.offset?.x || 50) / 100
  const offsetY = (port.offset?.y || 50) / 100

  switch (port.position) {
    case 'top':
      return { x: nodeLeft + nodeWidth * offsetX, y: nodeTop }
    case 'bottom':
      return { x: nodeLeft + nodeWidth * offsetX, y: nodeTop + nodeHeight }
    case 'left':
      return { x: nodeLeft, y: nodeTop + nodeHeight * offsetY }
    case 'right':
      return { x: nodeLeft + nodeWidth, y: nodeTop + nodeHeight * offsetY }
    default:
      return { x: nodeLeft + nodeWidth / 2, y: nodeTop + nodeHeight / 2 }
  }
}

function getEdgeEndpoints(edge: ReturnType<typeof edges>['value'][number]) {
  const sourcePos = getPortPosition(edge.sourceNodeId, edge.sourcePortId, 'source')
  const targetPos = getPortPosition(edge.targetNodeId, edge.targetPortId, 'target')

  return { sourcePos, targetPos }
}

function handleEdgeClick(edgeId: string, event: MouseEvent) {
  event.stopPropagation()
  selectedEdgeId.value = edgeId
}

function handleEdgeContextMenu(edgeId: string, event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  selectedEdgeId.value = edgeId
}

function handleCanvasClick() {
  selectedEdgeId.value = null
}

function validatePreviewConnection(): boolean {
  if (!previewData.value) return true

  const sourceNode = getNodeById(previewData.value.sourceNodeId)
  if (!previewData.value.targetPortId || !sourceNode) return true

  const targetNode = getNodeById(previewData.value.targetPortId)
  if (!targetNode) return false

  const sourcePorts = sourceNode.data?.ports || []
  const targetPorts = targetNode.data?.ports || []

  const sourcePort = sourcePorts.find((p: any) => p.id === previewData.value?.sourcePortId)
  const targetPort = targetPorts.find((p: any) => p.id === previewData.value?.targetPortId)

  if (!sourcePort || !targetPort) return false

  const sourcePortInfo = {
    id: sourcePort.id,
    nodeId: sourceNode.id,
    portType: sourcePort.type === 'source' ? 'output' : 'input',
    dataType: sourcePort.dataType,
  }

  const targetPortInfo = {
    id: targetPort.id,
    nodeId: targetNode.id,
    portType: targetPort.type === 'target' ? 'input' : 'output',
    dataType: targetPort.dataType,
  }

  const result = validateConnection(sourcePortInfo, targetPortInfo, canvasStore.edges)
  return result.isValid
}

const previewPath = computed(() => {
  if (!previewData.value) return ''

  const sourceNode = getNodeById(previewData.value.sourceNodeId)
  if (!sourceNode) return ''

  const sourcePos = getPortPosition(
    previewData.value.sourceNodeId,
    previewData.value.sourcePortId,
    'source'
  )

  const targetPos = {
    x: previewData.value.targetX,
    y: previewData.value.targetY,
  }

  const result = calculateBezierPath(
    sourcePos,
    targetPos,
    previewData.value.sourcePosition,
    'left'
  )

  return result.path
})

const isValidConnection = computed(() => {
  return validatePreviewConnection()
})
</script>

<template>
  <svg
    class="ports-edge-layer absolute inset-0 pointer-events-none"
    :style="{
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: 50,
    }"
    @click="handleCanvasClick"
  >
    <Edge
      v-for="edge in edges"
      :key="edge.id"
      :id="edge.id"
      v-bind="getEdgeEndpoints(edge)"
      :selected="selectedEdgeId === edge.id"
      @click="handleEdgeClick"
      @contextmenu="handleEdgeContextMenu"
    />

    <EdgePreview
      v-if="isDragging && previewData"
      :path="previewPath"
      :is-valid="isValidConnection"
      :source-x="getPortPosition(previewData.sourceNodeId, previewData.sourcePortId, 'source').x"
      :source-y="getPortPosition(previewData.sourceNodeId, previewData.sourcePortId, 'source').y"
      :target-x="previewData.targetX"
      :target-y="previewData.targetY"
    />
  </svg>
</template>

<style scoped>
.ports-edge-layer {
  overflow: visible;
  pointer-events: none;
}

.ports-edge-layer svg {
  pointer-events: none;
}

.ports-edge-layer :deep(.edge-group) {
  pointer-events: all;
}
</style>
