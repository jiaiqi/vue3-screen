<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComponentInstance } from '@screen/components'

interface Props {
  component: ComponentInstance
  gradient?: string
}

const props = withDefaults(defineProps<Props>(), {
  gradient: 'from-blue-500 to-cyan-400',
})

const isDragging = ref(false)
const isHovered = ref(false)

const iconClass = computed(() => props.component.meta.icon || 'i-carbon-document')
const displayName = computed(() => props.component.meta.name)

function handleDragStart(e: DragEvent) {
  if (!e.dataTransfer) return
  
  isDragging.value = true
  
  const dragData = {
    type: props.component.type,
    meta: props.component.meta,
  }
  
  e.dataTransfer.setData('application/json', JSON.stringify(dragData))
  e.dataTransfer.effectAllowed = 'copy'
  
  const ghostEl = e.target as HTMLElement
  ghostEl.style.opacity = '0.5'
  
  setTimeout(() => {
    ghostEl.style.opacity = '1'
    isDragging.value = false
  }, 0)
}

function handleDragEnd() {
  isDragging.value = false
}

function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
}
</script>

<template>
  <div
    class="material-item group relative flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated p-3 cursor-grab transition-all duration-200 select-none"
    :class="{
      'opacity-50 scale-95': isDragging,
      'border-primary shadow-glow': isHovered,
      'hover:border-primary hover:bg-surface-overlay hover:scale-105': !isDragging
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div 
      class="thumbnail relative h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center"
      :class="gradient"
    >
      <div class="absolute inset-0 bg-gradient-to-br opacity-80" :class="gradient" />
      <div 
        :class="iconClass" 
        class="relative z-10 h-6 w-6 text-white drop-shadow-lg"
      />
      <div class="absolute inset-0 bg-black/10" />
    </div>
    
    <span class="text-xs text-text-secondary text-center leading-tight line-clamp-2">
      {{ displayName }}
    </span>
    
    <div 
      v-if="isHovered"
      class="absolute inset-0 rounded-lg border-2 border-primary pointer-events-none"
    />
  </div>
</template>

<style scoped>
.material-item {
  min-height: 80px;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
}

.material-item:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-overlay);
}

.material-item:active {
  cursor: grabbing;
}

.thumbnail {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.group:hover .thumbnail {
  transform: scale(1.1);
}

.shadow-glow {
  box-shadow: 0 0 15px rgba(0, 115, 255, 0.3);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
