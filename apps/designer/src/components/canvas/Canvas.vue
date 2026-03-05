<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useDesignerStore } from '@/stores/designer'
import { useSelectionStore } from '@/stores/selection'
import { useCanvas } from '@/composables/useCanvas'
import { useDrop } from '@/composables/useDrop'
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
import type { DropData } from '@/composables/useDrop'
import type { ComponentNode } from '@screen/core'

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLElement | null>(null)

const canvasStore = useCanvasStore()
const designerStore = useDesignerStore()
const selectionStore = useSelectionStore()

const { cursor, isPanning, isSpacePressed } = useCanvas(containerRef)

const nodes = computed(() => designerStore.nodes)

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

const containerStyle = computed(() => ({
  cursor: cursor.value,
}))

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
</script>

<template>
  <div
    ref="containerRef"
    class="canvas-container relative h-full w-full overflow-hidden"
    :style="containerStyle"
    :class="{ 'is-panning': isPanning, 'is-space-pressed': isSpacePressed, 'is-drag-over': isDragOver }"
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
        class="canvas absolute top-0 left-0 tech-border"
        :style="canvasStyle"
      >
        <CanvasBackground />
        <CanvasGrid v-if="canvasStore.config.grid?.enabled" />
        <GuideLines />
        
        <div class="canvas-content absolute inset-0">
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

          <SelectionBox
            v-if="isSelecting && selectionRect.width > 0 && selectionRect.height > 0"
            :rect="selectionRect"
            :count="selectionStore.selectedCount"
            :scale="canvasStore.scale"
          />

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
      </div>
      
      <Minimap />
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  user-select: none;
  background: var(--color-canvas-bg);
}

.canvas-container.is-panning {
  cursor: grabbing !important;
}

.canvas-container.is-space-pressed {
  cursor: grab;
}

.canvas-container.is-drag-over {
  background: rgba(0, 212, 255, 0.05);
}

.canvas-container:deep(.canvas) {
  will-change: transform;
}

.canvas {
  background: var(--color-canvas-bg);
  box-shadow: var(--shadow-lg);
}

.canvas-content {
  position: relative;
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
</style>
