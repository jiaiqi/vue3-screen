<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

const store = useCanvasStore()

const gridConfig = computed(() => store.config.grid)

const gridStyle = computed(() => {
  const grid = gridConfig.value
  if (!grid || !grid.enabled) return {}

  const size = grid.size || 10
  const color = grid.color || 'rgba(255, 255, 255, 0.08)'
  const majorColor = grid.majorColor || 'rgba(255, 255, 255, 0.15)'
  const showMajor = grid.showMajor ?? true
  const majorInterval = grid.majorInterval || 5

  if (showMajor && majorInterval > 1) {
    const majorSize = size * majorInterval
    return {
      backgroundImage: `
        linear-gradient(${majorColor} 1px, transparent 1px),
        linear-gradient(90deg, ${majorColor} 1px, transparent 1px),
        linear-gradient(${color} 1px, transparent 1px),
        linear-gradient(90deg, ${color} 1px, transparent 1px)
      `,
      backgroundSize: `${majorSize}px ${majorSize}px, ${majorSize}px ${majorSize}px, ${size}px ${size}px, ${size}px ${size}px`,
    }
  }

  return {
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px),
                      linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  }
})
</script>

<template>
  <div
    v-if="gridConfig?.enabled"
    class="canvas-grid absolute inset-0 pointer-events-none"
    :style="gridStyle"
  />
</template>

<style scoped>
.canvas-grid {
  will-change: background-position;
}
</style>
