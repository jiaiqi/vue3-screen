<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import { ElMessage } from 'element-plus'
import { useCanvasStore } from '@/stores/canvas'
import { useDesignerStore } from '@/stores/designer'
import { useSelectionStore } from '@/stores/selection'
import { useDrop } from '@/composables/useDrop'
import type { DropData } from '@/composables/useDrop'
import type { ComponentNode } from '@screen/core'
import CanvasBackground from './CanvasBackground.vue'
import CanvasGrid from './CanvasGrid.vue'
import GuideLines from './GuideLines.vue'
import Minimap from './Minimap.vue'
import ResizeHandles from './ResizeHandles.vue'
import SelectionBox from './SelectionBox.vue'
import { useResize, type ResizeHandle } from '@/composables/useResize'

const canvasStore = useCanvasStore()
const designerStore = useDesignerStore()
const selectionStore = useSelectionStore()

const sketchRuleRef = ref<InstanceType<typeof SketchRule>>()
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLElement | null>(null)

// 画布配置
const rectWidth = ref(window.innerWidth - 320) // 减去左右面板
const rectHeight = ref(window.innerHeight - 100) // 减去顶部工具栏
const canvasWidth = computed(() => canvasStore.config.width)
const canvasHeight = computed(() => canvasStore.config.height)

// 缩放和偏移
const scale = computed({
  get: () => canvasStore.scale,
  set: (val) => canvasStore.setScale(val),
})

const offsetX = computed(() => canvasStore.offsetX)
const offsetY = computed(() => canvasStore.offsetY)

// 辅助线
const lines = computed(() => ({
  h: canvasStore.guides.filter(g => g.type === 'horizontal').map(g => g.position),
  v: canvasStore.guides.filter(g => g.type === 'vertical').map(g => g.position),
}))

// 拖拽相关
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

// Resize 相关
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

// 节点点击选择
function handleNodeClick(e: MouseEvent, node: ComponentNode) {
  e.stopPropagation()
  if (e.shiftKey) {
    selectionStore.toggleSelection(node.id)
  } else {
    selectionStore.select(node.id)
  }
}

function handleCanvasClick() {
  selectionStore.clearSelection()
}

// 节点样式
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

// 处理标尺角标点击（还原）
function handleCornerClick() {
  canvasStore.resetScale()
  ElMessage.success('已还原画布')
}

// 监听窗口大小变化
function handleResize() {
  rectWidth.value = window.innerWidth - 320
  rectHeight.value = window.innerHeight - 100
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="containerRef" class="canvas-wrapper h-full w-full">
    <SketchRule
      ref="sketchRuleRef"
      :thick="20"
      v-model:scale="scale"
      :width="rectWidth"
      :height="rectHeight"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :start-x="offsetX"
      :start-y="offsetY"
      :is-show-refer-line="true"
      :lines="lines"
      :shadow-scale="0.05"
      :is-no-line="false"
      @on-corner-click="handleCornerClick"
      @on-scale-change="(newScale: number) => canvasStore.setScale(newScale)"
    >
      <template #default>
        <div
          class="canvas-content relative"
          :style="{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }"
          @click="handleCanvasClick"
          @dragenter="handleDragEnter"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          <CanvasBackground />
          <CanvasGrid v-if="canvasStore.config.grid?.enabled" />
          <GuideLines />

          <!-- 节点层 -->
          <div
            v-for="node in nodes"
            :key="node.id"
            :class="getNodeClass(node)"
            :style="getNodeStyle(node)"
            class="node absolute"
            @mousedown.stop="() => {}"
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
              :scale="scale"
              @resize-start="(handle, e) => handleResizeStart(handle, e, node.id)"
            />
          </div>

          <!-- 拖拽预览 -->
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
      </template>

      <!-- 自定义缩放按钮 -->
      <template #btn="{ reset, zoomIn, zoomOut }">
        <div class="zoom-controls flex items-center gap-2">
          <button class="zoom-btn" @click="zoomOut" title="缩小">
            <span class="i-carbon-zoom-out" />
          </button>
          <span class="zoom-value">{{ Math.round(scale * 100) }}%</span>
          <button class="zoom-btn" @click="zoomIn" title="放大">
            <span class="i-carbon-zoom-in" />
          </button>
          <button class="zoom-btn reset-btn" @click="reset" title="还原">
            <span class="i-carbon-reset" />
          </button>
        </div>
      </template>
    </SketchRule>

    <!-- 鸟瞰图 -->
    <Minimap />
  </div>
</template>

<style scoped>
.canvas-wrapper {
  position: relative;
  background: var(--color-canvas-bg);
}

.canvas-content {
  background: var(--color-canvas-bg);
  box-shadow: var(--shadow-lg);
}

/* 节点样式 */
.node {
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

/* 拖拽预览 */
.drop-preview {
  z-index: 1000;
  border-color: var(--color-primary);
  background-color: rgba(0, 212, 255, 0.1);
  box-shadow: var(--shadow-glow);
}

/* 缩放控制按钮 */
.zoom-controls {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 4px 8px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
}

.reset-btn:hover {
  background: var(--color-primary);
  color: #000;
}

.zoom-value {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 40px;
  text-align: center;
}

/* 覆盖 vue3-sketch-ruler 主题 */
:deep(.sketch-rule-container) {
  background: var(--color-canvas-bg);
}

:deep(.ruler-box) {
  background: var(--color-bg-surface) !important;
  border-color: var(--color-border) !important;
}

:deep(.ruler-box text) {
  fill: var(--color-text-muted) !important;
}

:deep(.ruler-box line) {
  stroke: rgba(255, 255, 255, 0.2) !important;
}

:deep(.refer-line) {
  stroke: var(--color-primary) !important;
}

:deep(.corner-box) {
  background: var(--color-bg-surface) !important;
  border-color: var(--color-border) !important;
}
</style>
