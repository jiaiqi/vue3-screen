<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

const store = useCanvasStore()

const backgroundStyle = computed(() => {
  const bg = store.config.background
  return {
    backgroundColor: bg.color || '#0d1117',
    backgroundImage: bg.image ? `url(${bg.image})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: bg.opacity ?? 1,
  }
})
</script>

<template>
  <div
    class="canvas-background absolute inset-0"
    :style="backgroundStyle"
  />
</template>
