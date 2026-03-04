<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useCanvas } from '@/composables/useCanvas'
import CanvasBackground from './CanvasBackground.vue'
import CanvasGrid from './CanvasGrid.vue'
import CanvasRuler from './CanvasRuler.vue'

const containerRef = ref<HTMLElement | null>(null)
const store = useCanvasStore()

useCanvas(containerRef)

const canvasStyle = computed(() => ({
  width: `${store.config.width}px`,
  height: `${store.config.height}px`,
  transform: store.transform,
  transformOrigin: 'top left',
}))

const showRulers = computed(() => store.config.rulers)
</script>

<template>
  <div
    ref="containerRef"
    class="canvas-container relative h-full w-full overflow-hidden bg-canvas-bg"
  >
    <CanvasRuler v-if="showRulers" />

    <div class="canvas-viewport absolute inset-0">
      <div
        class="canvas absolute top-0 left-0"
        :style="canvasStyle"
      >
        <CanvasBackground />
        <CanvasGrid v-if="store.config.grid?.enabled" />
        <div class="canvas-content absolute inset-0">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  cursor: default;
}

.canvas-container:deep(.canvas) {
  will-change: transform;
}
</style>
