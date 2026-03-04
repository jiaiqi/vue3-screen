<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

const store = useCanvasStore()

const gridStyle = computed(() => {
  const grid = store.config.grid!
  const size = grid.size
  const color = grid.color || 'rgba(255, 255, 255, 0.05)'
  return {
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px),
                      linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  }
})
</script>

<template>
  <div class="canvas-grid absolute inset-0 pointer-events-none" :style="gridStyle" />
</template>
