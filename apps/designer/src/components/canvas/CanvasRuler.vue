<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useRuler } from '@/composables/useRuler'

const store = useCanvasStore()

const { marks: hMarks, rulerSize } = useRuler('horizontal')
const { marks: vMarks } = useRuler('vertical')

const hRulerStyle = computed(() => ({
  width: `${store.config.width * store.scale}px`,
  transform: `translateX(${store.offsetX}px)`,
}))

const vRulerStyle = computed(() => ({
  height: `${store.config.height * store.scale}px`,
  transform: `translateY(${store.offsetY}px)`,
}))

const rulerWidth = rulerSize
const rulerHeight = rulerSize

const isDraggingGuide = ref(false)
const dragType = ref<'horizontal' | 'vertical'>('horizontal')
const dragPosition = ref(0)

const previewLineStyle = computed(() => {
  if (!isDraggingGuide.value) return null
  
  if (dragType.value === 'horizontal') {
    return {
      top: `${dragPosition.value}px`,
      left: `${rulerWidth}px`,
      right: 0,
      height: '1px',
    }
  } else {
    return {
      left: `${dragPosition.value}px`,
      top: `${rulerHeight}px`,
      bottom: 0,
      width: '1px',
    }
  }
})

function handleHRulerMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  
  isDraggingGuide.value = true
  dragType.value = 'horizontal'
  dragPosition.value = e.clientY
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleVRulerMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  
  isDraggingGuide.value = true
  dragType.value = 'vertical'
  dragPosition.value = e.clientX
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  if (!isDraggingGuide.value) return
  
  if (dragType.value === 'horizontal') {
    dragPosition.value = e.clientY
  } else {
    dragPosition.value = e.clientX
  }
}

function handleMouseUp(e: MouseEvent) {
  if (!isDraggingGuide.value) return
  
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  
  const viewportRect = (e.target as HTMLElement).closest('.canvas-viewport')?.getBoundingClientRect()
  
  if (viewportRect) {
    let position: number
    
    if (dragType.value === 'horizontal') {
      position = (e.clientY - viewportRect.top - store.offsetY) / store.scale
    } else {
      position = (e.clientX - viewportRect.left - store.offsetX) / store.scale
    }
    
    if (position >= 0 && position <= (dragType.value === 'horizontal' ? store.config.height : store.config.width)) {
      store.addGuide(dragType.value, position)
    }
  }
  
  isDraggingGuide.value = false
}
</script>

<template>
  <div class="rulers pointer-events-none absolute inset-0">
    <div
      class="ruler-h absolute top-0 z-50 overflow-hidden pointer-events-auto cursor-crosshair"
      :style="{
        left: `${rulerWidth}px`,
        right: 0,
        height: `${rulerHeight}px`,
      }"
      @mousedown="handleHRulerMouseDown"
    >
      <div
        class="ruler-h-content h-full"
        :style="hRulerStyle"
      >
        <svg :width="store.config.width * store.scale" :height="rulerHeight">
          <rect width="100%" height="100%" fill="#1e1e2e" />
          <g v-for="mark in hMarks" :key="mark.value">
            <line
              :x1="mark.position"
              :x2="mark.position"
              :y1="mark.isMajor ? 0 : rulerHeight / 2"
              :y2="rulerHeight"
              stroke="rgba(255, 255, 255, 0.3)"
              stroke-width="1"
            />
            <text
              v-if="mark.isMajor"
              :x="mark.position + 3"
              :y="rulerHeight / 2 - 2"
              fill="rgba(255, 255, 255, 0.5)"
              font-size="10"
              font-family="monospace"
            >
              {{ mark.value }}
            </text>
          </g>
        </svg>
      </div>
    </div>

    <div
      class="ruler-v absolute left-0 z-50 overflow-hidden pointer-events-auto cursor-crosshair"
      :style="{
        top: `${rulerHeight}px`,
        bottom: 0,
        width: `${rulerWidth}px`,
      }"
      @mousedown="handleVRulerMouseDown"
    >
      <div
        class="ruler-v-content w-full"
        :style="vRulerStyle"
      >
        <svg :width="rulerWidth" :height="store.config.height * store.scale">
          <rect width="100%" height="100%" fill="#1e1e2e" />
          <g v-for="mark in vMarks" :key="mark.value">
            <line
              :y1="mark.position"
              :y2="mark.position"
              :x1="mark.isMajor ? 0 : rulerWidth / 2"
              :x2="rulerWidth"
              stroke="rgba(255, 255, 255, 0.3)"
              stroke-width="1"
            />
            <text
              v-if="mark.isMajor"
              :y="mark.position + 3"
              :x="rulerWidth / 2 - 2"
              fill="rgba(255, 255, 255, 0.5)"
              font-size="10"
              font-family="monospace"
              writing-mode="vertical-rl"
              text-orientation="mixed"
              transform-origin="left top"
            >
              {{ mark.value }}
            </text>
          </g>
        </svg>
      </div>
    </div>

    <div
      class="ruler-corner absolute left-0 top-0 z-50"
      :style="{
        width: `${rulerWidth}px`,
        height: `${rulerHeight}px`,
      }"
    >
      <svg width="100%" height="100%">
        <rect width="100%" height="100%" fill="#1e1e2e" />
        <line
          x1="0"
          y1="100%"
          x2="100%"
          y2="0"
          stroke="rgba(255, 255, 255, 0.2)"
          stroke-width="1"
        />
      </svg>
    </div>

    <div
      v-if="isDraggingGuide && previewLineStyle"
      class="guide-preview absolute z-40 pointer-events-none"
      :style="previewLineStyle"
    />
  </div>
</template>

<style scoped>
.ruler-h-content,
.ruler-v-content {
  will-change: transform;
}

.ruler-corner {
  background: #1e1e2e;
}

.guide-preview {
  background: #00d4ff;
  box-shadow: 0 0 4px #00d4ff;
}
</style>
