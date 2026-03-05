<script setup lang="ts">
import { computed, ref } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import { useSelectionStore } from '@/stores/selection'
import { useCanvasStore } from '@/stores/canvas'
import Port from '@/components/canvas/Port.vue'

const props = defineProps<NodeProps>()

const selectionStore = useSelectionStore()
const canvasStore = useCanvasStore()

const isSelected = computed(() => selectionStore.isSelected(props.id))

const ports = computed(() => props.data?.ports || [])

const sourcePorts = computed(() => 
  ports.value.filter((p: any) => p.type === 'source' || p.type === 'both')
)

const targetPorts = computed(() => 
  ports.value.filter((p: any) => p.type === 'target' || p.type === 'both')
)

function getHandlePosition(position: string): Position {
  const map: Record<string, Position> = {
    top: Position.Top,
    right: Position.Right,
    bottom: Position.Bottom,
    left: Position.Left,
  }
  return map[position] || Position.Right
}

function getHandleStyle(port: any): Record<string, string> {
  const offset = port.offset || { x: 50, y: 50 }
  return {
    top: port.position === 'top' || port.position === 'bottom' 
      ? `${offset.x}%` 
      : undefined as any,
    left: port.position === 'left' || port.position === 'right' 
      ? `${offset.x}%` 
      : undefined as any,
    transform: 'translate(-50%, -50%)',
  }
}

function getPortType(port: any): 'input' | 'output' | 'both' {
  if (port.type === 'source') return 'output'
  if (port.type === 'target') return 'input'
  return 'both'
}

function handlePortDragStart(portId: string, event: MouseEvent) {
  const port = ports.value.find((p: any) => p.id === portId)
  if (!port) return
  
  const portInfo = {
    id: portId,
    nodeId: props.id,
    position: port.position as 'top' | 'right' | 'bottom' | 'left',
    portType: getPortType(port),
    offset: port.offset,
    dataType: port.dataType,
  }
  
  canvasStore.startEdgeDrag(portInfo)
}

function handlePortDragEnd(portId: string, event: MouseEvent) {
  const targetElement = document.elementFromPoint(event.clientX, event.clientY)
  const targetPortElement = targetElement?.closest('[data-port-id]') as HTMLElement
  
  if (targetPortElement) {
    const targetPortId = targetPortElement.dataset.portId
    const targetNodeId = targetPortElement.dataset.nodeId
    
    if (targetPortId && targetNodeId && targetNodeId !== props.id) {
      canvasStore.endEdgeDrag(targetPortId)
    } else {
      canvasStore.cancelEdgeDrag()
    }
  } else {
    canvasStore.cancelEdgeDrag()
  }
}

const nodeClass = computed(() => [
  'graph-node',
  'relative',
  'rounded',
  'border-2',
  'transition-all',
  'duration-200',
  isSelected.value ? 'border-primary shadow-glow' : 'border-border hover:border-node-hover',
])
</script>

<template>
  <div :class="nodeClass" class="min-w-16 min-h-16 bg-surface-elevated p-2">
    <div class="node-content flex h-full w-full items-center justify-center">
      <div v-if="data?.svgSource" v-html="data.svgSource" class="h-full w-full" />
      <div v-else class="text-text-secondary text-sm">
        {{ data?.label || 'Graph Node' }}
      </div>
    </div>

    <Port
      v-for="port in ports"
      :key="port.id"
      :port-id="port.id"
      :node-id="id"
      :position="port.position"
      :port-type="getPortType(port)"
      :offset="port.offset"
      :data-type="port.dataType"
      @drag-start="handlePortDragStart"
      @drag-end="handlePortDragEnd"
    />

    <Handle
      v-for="port in sourcePorts"
      :key="port.id"
      :id="port.id"
      type="source"
      :position="getHandlePosition(port.position)"
      :style="getHandleStyle(port)"
      class="!bg-primary !w-3 !h-3 !border-2 !border-white"
    />

    <Handle
      v-for="port in targetPorts"
      :key="port.id"
      :id="port.id"
      type="target"
      :position="getHandlePosition(port.position)"
      :style="getHandleStyle(port)"
      class="!bg-secondary !w-3 !h-3 !border-2 !border-white"
    />
  </div>
</template>
