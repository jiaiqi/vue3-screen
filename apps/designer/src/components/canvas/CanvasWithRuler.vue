<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import { ElMessage } from 'element-plus'
import { useCanvasStore } from '@/stores/canvas'
import { useDesignerStore } from '@/stores/designer'
import { useSelectionStore } from '@/stores/selection'
import { useDrop } from '@/composables/useDrop'
import type { DropData } from '@/composables/useDrop'
import type { ComponentNode } from '@screen/core'
import { getComponent } from '@screen/components'
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

// 标尺深色主题调色板 - 优化配置
const rulerPalette = {
  bgColor: '#161b22', // 标尺背景色 - 深色
  longfgColor: '#8b949e', // 长刻度线颜色
  shortfgColor: '#6e7681', // 短刻度线颜色
  fontColor: '#c9d1d9', // 字体颜色
  fontShadowColor: '#0d1117',
  shadowColor: 'rgba(0, 212, 255, 0.1)', // 阴影颜色
  lineColor: '#00d4ff', // 辅助线颜色
  lineType: 'dashed', // 辅助线类型：dashed | solid
  lockLineColor: '#484f58', // 锁定辅助线颜色
  hoverBg: '#21262d', // 悬停背景
  hoverColor: '#00d4ff', // 悬停颜色
  borderColor: 'rgba(255, 255, 255, 0.1)', // 边框颜色
  cornerActiveColor: '#00d4ff', // 角标激活颜色
  cornerColor: '#30363d', // 角标颜色
}

// 拖拽相关
const nodes = computed(() => designerStore.nodes)

// 使用 vue3-sketch-ruler 的拖拽支持
const { isDragOver, dropPreview, handleDragEnter, handleDragOver, handleDragLeave, handleDrop } = useDrop(
  containerRef,
  (data: DropData, x: number, y: number) => {
    const meta = data.meta
    console.log('[CanvasWithRuler] onDrop callback:', {
      type: data.type,
      meta: data.meta,
      x,
      y,
    })
    const node = designerStore.addNodeAt(data.type, x, y, {
      width: meta?.defaultSize?.w,
      height: meta?.defaultSize?.h,
      label: meta?.name,
    })
    console.log('[CanvasWithRuler] Node created:', node)
  }
)

// 节点移动处理（使用 vue3-sketch-ruler 的拖拽功能）
function handleNodeMove(nodeId: string, newX: number, newY: number) {
  const node = nodes.value.find(n => n.id === nodeId)
  if (!node) return
  designerStore.moveNode(nodeId, newX, newY, true)
}

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

// 处理节点鼠标按下（开始拖拽）
let isDragging = false
let currentNodeId: string | null = null
let dragOffsetX = 0
let dragOffsetY = 0

function handleNodeMouseDown(e: MouseEvent, node: ComponentNode) {
  if (e.button !== 0 || node.locked) return
  
  e.stopPropagation()
  e.preventDefault()
  selectionStore.select(node.id)
  
  isDragging = true
  currentNodeId = node.id
  
  // 计算鼠标相对于节点左上角的偏移
  const nodeElement = e.currentTarget as HTMLElement
  const rect = nodeElement.getBoundingClientRect()
  dragOffsetX = e.clientX - rect.left
  dragOffsetY = e.clientY - rect.top
  
  // 设置拖动光标
  document.body.style.cursor = 'grabbing'
  nodeElement.style.cursor = 'grabbing'
  
  // 添加拖动中类
  nodeElement.classList.add('dragging')
  
  function onMouseMove(moveEvent: MouseEvent) {
    if (!isDragging || !currentNodeId) return
    moveEvent.preventDefault()
    
    // 使用 requestAnimationFrame 优化性能
    requestAnimationFrame(() => {
      const containerRect = containerRef.value?.getBoundingClientRect()
      if (!containerRect) return
      
      // 计算新的位置（考虑缩放和偏移）
      const deltaX = (moveEvent.clientX - containerRect.left - dragOffsetX) / canvasStore.scale
      const deltaY = (moveEvent.clientY - containerRect.top - dragOffsetY) / canvasStore.scale
      
      // 更新节点位置（不启用吸附，拖动结束后再吸附）
      designerStore.moveNode(currentNodeId, deltaX, deltaY, false)
    })
  }
  
  function onMouseUp() {
    if (!currentNodeId) return
    
    const nodeElement = document.querySelector(`[data-node-id="${currentNodeId}"]`)
    if (nodeElement) {
      nodeElement.classList.remove('dragging')
      ;(nodeElement as HTMLElement).style.cursor = 'move'
    }
    
    document.body.style.cursor = ''
    isDragging = false
    currentNodeId = null
    
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove, { passive: false })
  document.addEventListener('mouseup', onMouseUp)
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

// 处理辅助线创建
function handleLineCreate(type: 'h' | 'v', value: number) {
  // 验证位置值有效性
  if (value === undefined || value === null || isNaN(value)) {
    ElMessage.warning('无效的辅助线位置')
    return
  }
  
  // 根据当前缩放调整位置
  const adjustedValue = value / scale.value
  
  canvasStore.addGuide({
    type: type === 'h' ? 'horizontal' : 'vertical',
    position: adjustedValue,
  })
  
  ElMessage.success(`已添加${type === 'h' ? '水平' : '垂直'}辅助线`)
}

// 键盘快捷键
function handleKeyDown(e: KeyboardEvent) {
  // Ctrl/Cmd + 滚轮 = 缩放
  if ((e.ctrlKey || e.metaKey) && e.key === '0') {
    e.preventDefault()
    canvasStore.resetScale()
  }
  
  // +/- 缩放
  if (e.key === '=' || e.key === '+') {
    e.preventDefault()
    canvasStore.setScale(Math.min(canvasStore.scale + 0.1, 2))
  }
  if (e.key === '-' || e.key === '_') {
    e.preventDefault()
    canvasStore.setScale(Math.max(canvasStore.scale - 0.1, 0.25))
  }
}

// 监听窗口大小变化
function handleResize() {
  rectWidth.value = window.innerWidth - 320
  rectHeight.value = window.innerHeight - 100
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
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
      :is-no-line="false"
      :is-adsorb="true"
      :lines="lines"
      :shadow-scale="0.05"
      :palette="rulerPalette"
      :shadow-opts="{
        show: true,
        opacity: 0.6,
        blur: 10,
        offsetX: 5,
        offsetY: 5,
      }"
      @on-corner-click="handleCornerClick"
      @on-scale-change="(newScale: number) => canvasStore.setScale(newScale)"
      @on-line-create="handleLineCreate"
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
            :data-node-id="node.id"
            :class="getNodeClass(node)"
            :style="getNodeStyle(node)"
            class="node absolute group"
            @click="handleNodeClick($event, node)"
            @mouseenter="selectionStore.setHovered(node.id)"
            @mouseleave="selectionStore.setHovered(null)"
          >
            <!-- 节点内容 -->
            <div 
              class="w-full h-full overflow-hidden cursor-move node-content"
              @mousedown="handleNodeMouseDown($event, node)"
            >
              <template v-if="getComponent(node.type)">
                <component
                  :is="markRaw(getComponent(node.type)!.component)"
                  v-bind="node.props || {}"
                  @mousedown.stop
                />
              </template>
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-text-muted text-sm p-4">
                <span class="mb-2 text-red-400">⚠️ 组件未找到</span>
                <span class="text-xs">类型：{{ node.type }}</span>
                <span class="text-xs">标签：{{ node.label }}</span>
                <span class="text-xs mt-2 text-text-muted">请检查组件是否正确注册</span>
              </div>
            </div>

            <!-- 选中时的操作手柄 -->
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

      <!-- 自定义角标 -->
      <template #corner>
        <div class="corner-custom" @click="handleCornerClick">
          <span class="i-carbon-reset" />
        </div>
      </template>

      <!-- 自定义缩放按钮 -->
      <template #btn="{ reset, zoomIn, zoomOut }">
        <div class="zoom-controls flex items-center gap-2">
          <button class="zoom-btn" @click="zoomOut" title="缩小 (-)">
            <span class="i-carbon-zoom-out" />
          </button>
          <span class="zoom-value">{{ Math.round(scale * 100) }}%</span>
          <button class="zoom-btn" @click="zoomIn" title="放大 (+)">
            <span class="i-carbon-zoom-in" />
          </button>
          <button class="zoom-btn reset-btn" @click="reset" title="还原 (100%)">
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
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: grab;
  overflow: hidden;
  user-select: none;
  will-change: transform, left, top;
}

.node:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.node.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary), var(--shadow-glow);
  z-index: 100;
}

.node.locked {
  cursor: not-allowed;
  opacity: 0.7;
}

/* 拖动中的节点 */
.node.dragging {
  cursor: grabbing !important;
  opacity: 0.8;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: none;
}

.node.dragging .node-content {
  cursor: grabbing !important;
}

.node-content {
  overflow: hidden;
  cursor: move;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-secondary);
  font-size: 13px;
}
}

/* 拖拽预览 */
.drop-preview {
  z-index: 1000;
  border-color: var(--color-primary);
  background-color: rgba(0, 212, 255, 0.1);
  box-shadow: var(--shadow-glow);
}

/* 自定义角标 */
.corner-custom {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--color-bg-surface);
  transition: all 0.2s ease;
}

.corner-custom:hover {
  background: var(--color-primary);
  color: #000;
}

.corner-custom span {
  font-size: 16px;
}

/* 缩放控制按钮 */
.zoom-controls {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 6px 10px;
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 1001;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 6px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.zoom-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
}

.zoom-btn:active {
  transform: scale(0.95);
}

.reset-btn:hover {
  background: var(--color-primary);
  color: #000;
}

.zoom-value {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 45px;
  text-align: center;
  font-weight: 500;
  user-select: none;
}

/* 覆盖 vue3-sketch-ruler 主题 */
:deep(.sketch-ruler) {
  background: var(--color-canvas-bg);
}

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

/* 强制画布背景色 - 确保内容区域也是深色 */
:deep(.canvasedit-parent) {
  background: transparent !important;
}

:deep(.canvasedit) {
  background: transparent !important;
}
</style>
