<script setup lang="ts">
interface Props {
  fillLevel?: number
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  fillLevel: 50,
  size: 100,
})

const fillHeight = computed(() => {
  const maxFillHeight = 50
  return (props.fillLevel / 100) * maxFillHeight
})

const fillY = computed(() => {
  return 90 - fillHeight.value
})
</script>

<template>
  <div :style="{ width: `${size}px`, height: `${size * 1.2}px` }">
    <svg viewBox="0 0 100 120" class="h-full w-full">
      <ellipse
        cx="50"
        cy="20"
        rx="40"
        ry="15"
        stroke="currentColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
      <rect
        x="10"
        y="20"
        width="80"
        height="80"
        stroke="currentColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
      <ellipse
        cx="50"
        cy="100"
        rx="40"
        ry="15"
        stroke="currentColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
      <rect
        x="20"
        :y="fillY"
        width="60"
        :height="fillHeight"
        fill="#00bcd4"
        opacity="0.5"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
export default {
  name: 'TankNode',
}
</script>
