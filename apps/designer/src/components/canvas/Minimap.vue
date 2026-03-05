<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useDesignerStore } from '@/stores/designer'

const canvasStore = useCanvasStore()
const designerStore = useDesignerStore()

const minimapRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const minimapSize = { width: 180, height: 120 }

const minimapScale = computed(() => {
  const scaleX = minimapSize.width / canvasStore.config.width
  const scaleY = minimapSize.height / canvasStore.config.height
  return Math.min(scaleX, scaleY) * 0.95
})

const scaledCanvasWidth = computed(() => canvasStore.config.width * minimapScale.value)
const scaledCanvasHeight = computed(() => canvasStore.config.height * minimapScale.value)

const viewportStyle = computed(() => {
  const containerRect = minimapRef.value?.getBoundingClientRect()
  if (!containerRect) return {}
  
  const offsetX = containerRect.width / 2 - scaledCanvasWidth.value / 2
  const offsetY = containerRect.height / 2 - scaledCanvasHeight.value / 2
  
  const viewX = -canvasStore.offsetX / canvasStore.scale * minimapScale.value
  const viewY = -canvasStore.offsetY / canvasStore.scale * minimapScale.value
  const viewWidth = (containerRect.width - 20) / canvasStore.scale * minimapScale.value
  const viewHeight = (containerRect.height - 20) / canvasStore.scale * minimapScale.value
  
  return {
    left: `${offsetX + viewX}px`,
    top: `${offsetY + viewY}px`,
    width: `${Math.min(viewWidth, scaledCanvasWidth.value)}px`,
    height: `${Math.min(viewHeight, scaledCanvasHeight.value)}px`,
  }
})

const nodes = computed(() => designerStore.nodes)

const getNodeStyle = (node: { layout: { x: number; y: number; w: number; h: number } }) => ({
  left: `${node.layout.x * minimapScale.value}px`,
  top: `${node.layout.y * minimapScale.value}px`,
  width: `${Math.max(node.layout.w * minimapScale.value, 2)}px`,
  height: `${Math.max(node.layout.h * minimapScale.value, 2)}px`,
})

function handleMinimapClick(e: MouseEvent) {
  if (isDragging.value) return
  
  const rect = minimapRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const offsetX = rect.width / 2 - scaledCanvasWidth.value / 2
  const offsetY = rect.height / 2 - scaledCanvasHeight.value / 2
  
  const clickX = (e.clientX - rect.left - offsetX) / minimapScale.value
  const clickY = (e.clientY - rect.top - offsetY) / minimapScale.value
  
  const container = document.querySelector('.canvas-viewport')
  if (!container) return
  
  const containerRect = container.getBoundingClientRect()
  const newOffsetX = -clickX * canvasStore.scale + containerRect.width / 2
  const newOffsetY = -clickY * canvasStore.scale + containerRect.height / 2
  
  canvasStore.setOffset(newOffsetX, newOffsetY)
}

function handleViewportMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()
  
  isDragging.value = true
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  
  const rect = minimapRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const offsetX = rect.width / 2 - scaledCanvasWidth.value / 2
  const offsetY = rect.height / 2 - scaledCanvasHeight.value / 2
  
  const moveX = e.movementX / minimapScale.value * canvasStore.scale
  const moveY = e.movementY / minimapScale.value * canvasStore.scale
  
  canvasStore.setOffset(
    canvasStore.offsetX + moveX,
    canvasStore.offsetY + moveY
  )
}

function handleMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

function handleToggle() {
  canvasStore.toggleMinimap()
}
</script>

<template>
  <div class="minimap-container" :class="{ 'is-collapsed': !canvasStore.showMinimap }">
    <div class="minimap-header" @click="handleToggle">
      <span class="minimap-title">鸟瞰图</span>
      <svg 
        class="minimap-toggle-icon" 
        :class="{ 'is-collapsed': !canvasStore.showMinimap }"
        width="12" 
        height="12" 
        viewBox="0 0 12 12" 
        fill="none"
      >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    
    <div 
      v-show="canvasStore.showMinimap"
      ref="minimapRef"
      class="minimap"
      @click="handleMinimapClick"
    >
      <div 
        class="minimap-canvas"
        :style="{
          width: `${scaledCanvasWidth}px`,
          height: `${scaledCanvasHeight}px`,
        }"
      >
        <div class="minimap-nodes">
          <div
            v-for="node in nodes"
            :key="node.id"
            class="minimap-node"
            :style="getNodeStyle(node)"
          />
        </div>
        
        <div
          class="minimap-viewport"
          :style="viewportStyle"
          @mousedown="handleViewportMouseDown"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.minimap-container {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 100;
  background: rgba(30, 30, 46, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.minimap-container.is-collapsed {
  background: rgba(30, 30, 46, 0.8);
}

.minimap-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
}

.minimap-container.is-collapsed .minimap-header {
  border-bottom: none;
}

.minimap-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.minimap-toggle-icon {
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease;
}

.minimap-toggle-icon.is-collapsed {
  transform: rotate(-90deg);
}

.minimap {
  width: 180px;
  height: 120px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
}

.minimap-canvas {
  position: relative;
  background: rgba(13, 17, 23, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.minimap-nodes {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.minimap-node {
  position: absolute;
  background: rgba(0, 212, 255, 0.4);
  border-radius: 1px;
  pointer-events: none;
}

.minimap-viewport {
  position: absolute;
  border: 2px solid #00d4ff;
  background: rgba(0, 212, 255, 0.1);
  cursor: grab;
  border-radius: 2px;
  transition: background 0.2s ease;
}

.minimap-viewport:hover {
  background: rgba(0, 212, 255, 0.2);
}

.minimap-viewport:active {
  cursor: grabbing;
}
</style>
