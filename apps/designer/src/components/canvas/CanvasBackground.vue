<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

const store = useCanvasStore()

const backgroundStyle = computed(() => {
  const bg = store.config.background
  const styles: Record<string, string | number> = {
    backgroundColor: bg.color || '#0d1117',
  }

  if (bg.image) {
    styles.backgroundImage = `url(${bg.image})`
    styles.backgroundSize = bg.size || 'cover'
    styles.backgroundPosition = bg.position || 'center'
    styles.backgroundRepeat = bg.repeat || 'no-repeat'
  }

  return styles
})

const overlayStyle = computed(() => {
  const bg = store.config.background
  const opacity = bg.opacity ?? 1
  return {
    opacity,
  }
})
</script>

<template>
  <div class="canvas-background absolute inset-0 overflow-hidden">
    <div
      v-if="store.config.background.image"
      class="background-image absolute inset-0"
      :style="backgroundStyle"
    />
    <div
      v-else
      class="background-color absolute inset-0"
      :style="backgroundStyle"
    />
    <div
      v-if="store.config.background.image"
      class="background-overlay absolute inset-0"
      :style="overlayStyle"
    />
  </div>
</template>

<style scoped>
.canvas-background {
  pointer-events: none;
}

.background-image,
.background-color {
  width: 100%;
  height: 100%;
}

.background-overlay {
  background-color: var(--color-canvas-bg, #1a1a2e);
}
</style>
