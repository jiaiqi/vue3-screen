<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value?: number
  maxValue?: number
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  maxValue: 100,
  size: 60,
})

const needleAngle = computed(() => {
  const percentage = Math.min(props.value / props.maxValue, 1)
  return -135 + percentage * 270
})

const needleRotation = computed(() => {
  return `rotate(${needleAngle.value} 50 50)`
})
</script>

<template>
  <div :style="{ width: `${size}px`, height: `${size}px` }">
    <svg viewBox="0 0 100 100" class="h-full w-full">
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="currentColor"
        stroke-width="3"
        fill="var(--color-surface-elevated)"
      />
      <path
        d="M20 70 A35 35 0 0 1 80 70"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <g :transform="needleRotation">
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          stroke="#ff4081"
          stroke-width="2"
          stroke-linecap="round"
        />
      </g>
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  </div>
</template>
