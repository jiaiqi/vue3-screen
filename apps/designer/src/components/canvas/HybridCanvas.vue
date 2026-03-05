<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import { VueFlow, useVueFlow, Background } from '@vue-flow/core'
import { useCanvasStore } from '@/stores/canvas'
import { useDesignerStore } from '@/stores/designer'
import { useSelectionStore } from '@/stores/selection'
import { useCoordinateTransform } from '@/composables/useCoordinateTransform'
import { useDrop, type DropData } from '@/composables/useDrop'
import { useDrag } from '@/composables/useDrag'
import { useMultiSelect, getSelectionBounds } from '@/composables/useMultiSelect'
import { useResize, type ResizeHandle } from '@/composables/useResize'
import CanvasBackground from './CanvasBackground.vue'
import CanvasGrid from './CanvasGrid.vue'
import CanvasRuler from './CanvasRuler.vue'
import GuideLines from './GuideLines.vue'
import Minimap from './Minimap.vue'
import ResizeHandles from './ResizeHandles.vue'
import SelectionBox from './SelectionBox.vue'
import type { ComponentNode } from '@screen/core'
import type { Edge, Node } from '@vue-flow/core'

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLElement | null>(null)
const vueFlowContainerRef = ref<HTMLElement | null>(null)

const canvasStore = useCanvasStore()
const designerStore = useDesignerStore()
const selectionStore = useSelectionStore()

const vueFlowInstance = shallowRef<any>(null)

const {
  addEdges,
  setElements,
  fitView,
  vueFlowRef,
  viewport,
} = useVueFlow({
  preventScrolling: true,
  zoomOnScroll: true,
  zoomOnPinch: true,
  zoomOnDoubleClick: false,
  panOnScroll: false,
  panOnDrag: false,
  connectOnClick: false,
  connectionMode: 'loose',
})

const nodes = computed(() => designerStore.nodes)

const vueFlowNodes = computed<Node[]>(() => {
  return nodes.value
    .filter(n => n.type === 'graph')
    .map(n => ({
      id: n.id,
      type: 'default',
      position: { x: n.layout.x, y: n.layout.y },
      data: { label: n.label },
      style: {
        width: `${n.layout.w}px`,
        height: `${n.layout.h}px`,
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
      },
    }))
})

const vueFlowEdges = computed<Edge[]>(() => {
  return designerStore.connections.map(conn => ({
    id: `edge-${conn.source}-${conn.target}`,
    source: conn.source,
    target: conn.target,
    sourceHandle: conn.sourceHandle,
    targetHandle: conn.targetHandle,
    type: 'default',
    animated: true,
    style: {
      stroke: 'var(--color-primary)',
      strokeWidth: 2,
    },
  }))
})

const dragNodes = computed(() =>
  nodes.value.map(n => ({
    id: n.id,
    layout: n.layout,
  }))
)

const { isDragOver, dropPreview, handleDragEnter, handleDragOver, handleDragLeave, handleDrop } = useDrop(
  containerRef,
  (data: DropData, x: number, y: number) => {
    const meta = data.meta
    designerStore.addNodeAt(data.type, x, y, {
      width: meta?.defaultSize?.w,
      height: meta?.defaultSize?.h,
      label: meta?.name,
    })
  }
)

const { isDragging, startDrag } = useDrag(containerRef, {
  nodes: dragNodes,
  onMove: (id, x, y) => {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      node.layout.x = x
      node.layout.y = y
    }
  },
  onMoveEnd: (moves) => {
    designerStore.moveNodes(
      moves.map(m => ({ id: m.id, x: m.newX, y: m.newY })),
      true
    )
  },
})

const { isSelecting, selectionRect, startSelection } = useMultiSelect(containerRef, {
  nodes: dragNodes,
})

const resizingNode = ref<string | null>(null)
const resizingLayout = ref(designerStore.nodes[0]?.layout ?? { x: 0, y: 0, w: 200, h: 150 })

const { isResizing, startResize } = useResize(containerRef, {
  layout: resizingLayout,
  minWidth: 20,
  minHeight: 20,
  onResize: (newLayout) => {
    if (resizingNode.value) {
      const node = nodes.value.find(n => n.id === resizingNode.value)
      if (node) {
        node.layout.x = newLayout.x
        node.layout.y = newLayout.y
        node.layout.w = newLayout.w
        node.layout.h = newLayout.h
      }
    }
  },
  onResizeEnd: (oldLayout, newLayout) => {
    if (resizingNode.value) {
      designerStore.resizeNode(resizingNode.value, newLayout, true)
      resizingNode.value = null
    }
  },
})

function handleResizeStart(handle: ResizeHandle, event: MouseEvent, nodeId: string) {
  const node = nodes.value.find(n => n.id === nodeId)
  if (!node) return

  resizingNode.value = nodeId
  resizingLayout.value = { ...node.layout }
  startResize(event, handle)
}

const canvasStyle = computed(() => ({
  width: `${canvasStore.config.width}px`,
  height: `${canvasStore.config.height}px`,
  transform: canvasStore.transform,
  transformOrigin: 'top left',
}))

const showRulers = computed(() => canvasStore.config.rulers)
const rulerOffset = computed(() => showRulers.value ? 20 : 0)

const selectedBounds = computed(() => {
  if (selectionStore.selectedCount === 0) return null
  return getSelectionBounds(dragNodes.value, selectionStore.selectedIds)
})

const singleSelectedNode = computed(() => {
  if (selectionStore.selectedCount !== 1) return null
  const id = selectionStore.firstSelectedId
  return nodes.value.find(n => n.id === id)
})

function handleNodeClick(e: MouseEvent, node: ComponentNode) {
  if (isDragging.value || isResizing.value) return

  e.stopPropagation()

  if (e.shiftKey) {
    selectionStore.toggleSelection(node.id)
  } else {
    selectionStore.select(node.id)
  }
}

function handleCanvasClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.node')) return
  if ((e.target as HTMLElement).closest('.resize-handle')) return
  selectionStore.clearSelection()
}

function getNodeStyle(node: ComponentNode) {
  return {
    left: `${node.layout.x}px`,
    top: `${node.layout.y}px`,
    width: `${node.layout.w}px`,
    height: `${node.layout.h}px`,
  }
}

function getNodeClass(node: ComponentNode) {
  return {
    'node': true,
    'selected': selectionStore.isSelected(node.id),
    'hovered': selectionStore.hoveredId === node.id,
    'locked': node.locked,
  }
}

watch(() => canvasStore.scale, (newScale) => {
  if (vueFlowInstance.value) {
    vueFlowInstance.value.zoom(newScale, { duration: 200 })
  }
})

watch(() => [canvasStore.offsetX, canvasStore.offsetY], ([newX, newY]) => {
  if (vueFlowInstance.value) {
    vueFlowInstance.value.move([newX, newY], { duration: 200 })
  }
})

watch([vueFlowNodes, vueFlowEdges], () => {
  setElements({
    nodes: vueFlowNodes.value,
    edges: vueFlowEdges.value,
  })
}, { immediate: true })

onMounted(() => {
  if (vueFlowRef.value) {
    vueFlowInstance.value = vueFlowRef.value
    canvasStore.setVueFlowInstance(vueFlowRef.value)
  }
  
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    canvasStore.fitToScreen(rect.width, rect.height)
  }
})

onUnmounted(() => {
  canvasStore.setVueFlowInstance(null)
})
</script>

<template>
  <div
    ref="containerRef"
    class="hybrid-canvas-container relative h-full w-full overflow-hidden"
    :class="{ 'is-drag-over': isDragOver }"
    @click="handleCanvasClick"
    @mousedown="startSelection"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <CanvasRuler v-if="showRulers" />

    <div
      class="canvas-viewport absolute"
      :style="{
        left: `${rulerOffset}px`,
        top: `${rulerOffset}px`,
        right: 0,
        bottom: 0,
      }"
    >
      <div
        ref="canvasRef"
        class="hybrid-canvas absolute top-0 left-0 tech-border"
        :style="canvasStyle"
      >
        <div class="layer-background">
          <CanvasBackground />
          <CanvasGrid v-if="canvasStore.config.grid?.enabled" />
        </div>

        <div class="layer-edges">
          <VueFlow
            ref="vueFlowRef"
            v-model:nodes="vueFlowNodes"
            v-model:edges="vueFlowEdges"
            :default-zoom="canvasStore.scale"
            :default-position="[canvasStore.offsetX, canvasStore.offsetY]"
            :min-zoom="0.1"
            :max-zoom="4"
            :fit-view-on-init="false"
            :prevent-scrolling="true"
            :zoom-on-scroll="true"
            :zoom-on-pinches="true"
            :pan-on-scroll="false"
            :pan-on-drag="false"
            :connect-on-click="false"
            :connection-mode="'loose'"
            class="vue-flow-instance"
            @move="canvasStore.syncTransform()"
          >
            <Background
              :color="canvasStore.config.grid?.color || 'rgba(255,255,255,0.05)'"
              :gap="canvasStore.config.grid?.size || 20"
              :size="1"
            />
          </VueFlow>
        </div>

        <div class="layer-nodes">
          <div
            v-for="node in nodes"
            :key="node.id"
            :class="getNodeClass(node)"
            :style="getNodeStyle(node)"
            @mousedown.stop="startDrag($event, node.id)"
            @click="handleNodeClick($event, node)"
            @mouseenter="selectionStore.setHovered(node.id)"
            @mouseleave="selectionStore.setHovered(null)"
          >
            <div class="node-content w-full h-full flex items-center justify-center text-text-muted text-sm">
              {{ node.label }}
            </div>

            <ResizeHandles
              v-if="selectionStore.isSelected(node.id) && !node.locked"
              :layout="node.layout"
              :scale="canvasStore.scale"
              @resize-start="(handle, e) => handleResizeStart(handle, e, node.id)"
            />
          </div>
        </div>

        <div class="layer-interaction">
          <GuideLines />
          <SelectionBox
            v-if="isSelecting && selectionRect.width > 0 && selectionRect.height > 0"
            :rect="selectionRect"
            :count="selectionStore.selectedCount"
            :scale="canvasStore.scale"
          />
        </div>

        <div
          v-if="isDragOver && dropPreview"
          class="drop-preview absolute border-2 border-dashed border-primary bg-primary/10 pointer-events-none"
          :style="{
            left: `${dropPreview.x}px`,
            top: `${dropPreview.y}px`,
            width: `${dropPreview.width}px`,
            height: `${dropPreview.height}px`,
          }"
        />
      </div>
      
      <Minimap v-if="canvasStore.showMinimap" />
    </div>
  </div>
</template>

<style scoped>
.hybrid-canvas-container {
  user-select: none;
  background: var(--color-canvas-bg);
}

.hybrid-canvas-container.is-drag-over {
  background: rgba(0, 212, 255, 0.05);
}

.hybrid-canvas {
  background: var(--color-canvas-bg);
  box-shadow: var(--shadow-lg);
}

.layer-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.layer-edges {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.layer-edges :deep(.vue-flow__viewport) {
  pointer-events: none;
}

.layer-edges :deep(.vue-flow__pane) {
  pointer-events: none;
}

.layer-edges :deep(.vue-flow__edges) {
  pointer-events: none;
}

.layer-edges :deep(.vue-flow-edge-path) {
  pointer-events: none;
}

.layer-nodes {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.layer-nodes > * {
  pointer-events: auto;
}

.layer-interaction {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.layer-interaction > * {
  pointer-events: auto;
}

.node {
  position: absolute;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: grab;
  transition: all 0.2s ease;
  overflow: hidden;
}

.node::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.node:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.node:hover::before {
  opacity: 1;
}

.node.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary), var(--shadow-glow);
}

.node.selected::before {
  opacity: 1;
}

.node.locked {
  cursor: not-allowed;
  opacity: 0.7;
}

.node-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.drop-preview {
  z-index: 1000;
  border-color: var(--color-primary);
  background-color: rgba(0, 212, 255, 0.1);
  box-shadow: var(--shadow-glow);
}

.vue-flow-instance {
  width: 100%;
  height: 100%;
}

.vue-flow-instance :deep(.vue-flow__container) {
  background: transparent;
}

.vue-flow-instance :deep(.vue-flow__edge-path) {
  stroke: var(--color-primary);
  stroke-width: 2px;
}

.vue-flow-instance :deep(.vue-flow__edge-path-animated) {
  stroke-dasharray: 5;
  animation: dash 30s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -1000;
  }
}
</style>
