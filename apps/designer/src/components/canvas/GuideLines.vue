<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCanvasStore, type GuideLine } from '@/stores/canvas'

const store = useCanvasStore()

const hoveredGuide = ref<string | null>(null)
const draggingGuide = ref<GuideLine | null>(null)

const horizontalGuides = computed(() => 
  store.guides.filter(g => g.type === 'horizontal')
)

const verticalGuides = computed(() => 
  store.guides.filter(g => g.type === 'vertical')
)

function getHorizontalGuideStyle(guide: GuideLine) {
  return {
    top: `${guide.position * store.scale + store.offsetY}px`,
    left: 0,
    right: 0,
  }
}

function getVerticalGuideStyle(guide: GuideLine) {
  return {
    left: `${guide.position * store.scale + store.offsetX}px`,
    top: 0,
    bottom: 0,
  }
}

function handleGuideMouseDown(e: MouseEvent, guide: GuideLine) {
  if (e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()
  
  draggingGuide.value = guide
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  if (!draggingGuide.value) return
  
  const viewport = document.querySelector('.canvas-viewport')
  if (!viewport) return
  
  const rect = viewport.getBoundingClientRect()
  
  if (draggingGuide.value.type === 'horizontal') {
    const newPosition = (e.clientY - rect.top - store.offsetY) / store.scale
    store.updateGuidePosition(draggingGuide.value.id, newPosition)
  } else {
    const newPosition = (e.clientX - rect.left - store.offsetX) / store.scale
    store.updateGuidePosition(draggingGuide.value.id, newPosition)
  }
}

function handleMouseUp(e: MouseEvent) {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  
  if (draggingGuide.value) {
    const guide = store.guides.find(g => g.id === draggingGuide.value!.id)
    if (guide) {
      const maxPosition = guide.type === 'horizontal' ? store.config.height : store.config.width
      if (guide.position < 0 || guide.position > maxPosition) {
        store.removeGuide(guide.id)
      }
    }
  }
  
  draggingGuide.value = null
}

function handleDoubleClick(guide: GuideLine) {
  store.removeGuide(guide.id)
}

function handleMouseEnter(guideId: string) {
  hoveredGuide.value = guideId
}

function handleMouseLeave() {
  hoveredGuide.value = null
}
</script>

<template>
  <div class="guide-lines absolute inset-0 pointer-events-none z-30">
    <div
      v-for="guide in horizontalGuides"
      :key="guide.id"
      class="guide-line guide-line-h pointer-events-auto"
      :class="{ 
        'is-hovered': hoveredGuide === guide.id,
        'is-dragging': draggingGuide?.id === guide.id 
      }"
      :style="getHorizontalGuideStyle(guide)"
      @mousedown="handleGuideMouseDown($event, guide)"
      @dblclick="handleDoubleClick(guide)"
      @mouseenter="handleMouseEnter(guide.id)"
      @mouseleave="handleMouseLeave"
    >
      <div class="guide-line-inner" />
      <div 
        v-if="hoveredGuide === guide.id"
        class="guide-delete-btn"
        @click.stop="store.removeGuide(guide.id)"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div v-if="hoveredGuide === guide.id" class="guide-tooltip">
        {{ Math.round(guide.position) }}px
      </div>
    </div>

    <div
      v-for="guide in verticalGuides"
      :key="guide.id"
      class="guide-line guide-line-v pointer-events-auto"
      :class="{ 
        'is-hovered': hoveredGuide === guide.id,
        'is-dragging': draggingGuide?.id === guide.id 
      }"
      :style="getVerticalGuideStyle(guide)"
      @mousedown="handleGuideMouseDown($event, guide)"
      @dblclick="handleDoubleClick(guide)"
      @mouseenter="handleMouseEnter(guide.id)"
      @mouseleave="handleMouseLeave"
    >
      <div class="guide-line-inner" />
      <div 
        v-if="hoveredGuide === guide.id"
        class="guide-delete-btn"
        @click.stop="store.removeGuide(guide.id)"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div v-if="hoveredGuide === guide.id" class="guide-tooltip">
        {{ Math.round(guide.position) }}px
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-line {
  position: absolute;
  cursor: move;
}

.guide-line-h {
  height: 6px;
  transform: translateY(-3px);
}

.guide-line-v {
  width: 6px;
  transform: translateX(-3px);
}

.guide-line-inner {
  position: absolute;
  background: #00d4ff;
  box-shadow: 0 0 4px #00d4ff;
  transition: opacity 0.2s ease;
}

.guide-line-h .guide-line-inner {
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  transform: translateY(-0.5px);
}

.guide-line-v .guide-line-inner {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-0.5px);
}

.guide-line.is-hovered .guide-line-inner,
.guide-line.is-dragging .guide-line-inner {
  box-shadow: 0 0 8px #00d4ff, 0 0 12px #00d4ff;
}

.guide-delete-btn {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #ff4757;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.guide-line-h .guide-delete-btn {
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
}

.guide-line-v .guide-delete-btn {
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
}

.guide-line.is-hovered .guide-delete-btn {
  opacity: 1;
}

.guide-delete-btn:hover {
  background: #ff6b7a;
}

.guide-tooltip {
  position: absolute;
  background: rgba(0, 212, 255, 0.9);
  color: #000;
  font-size: 10px;
  font-family: monospace;
  padding: 2px 6px;
  border-radius: 2px;
  white-space: nowrap;
  pointer-events: none;
}

.guide-line-h .guide-tooltip {
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
}

.guide-line-v .guide-tooltip {
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
