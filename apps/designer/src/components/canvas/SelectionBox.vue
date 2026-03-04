<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rect: { x: number; y: number; width: number; height: number }
}

const props = defineProps<Props>()

const boxStyle = computed(() => ({
  left: `${props.rect.x}px`,
  top: `${props.rect.y}px`,
  width: `${props.rect.width}px`,
  height: `${props.rect.height}px`,
}))
</script>

<template>
  <div
    v-if="rect.width > 0 && rect.height > 0"
    class="selection-box absolute border border-primary bg-primary/10 pointer-events-none"
    :style="boxStyle"
  />
</template>
