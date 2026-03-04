<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  state?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  state: 'unknown',
  size: 60,
})

const isClosed = computed(() => props.state === 'closed')
const isOpen = computed(() => props.state === 'open')
const isTripped = computed(() => props.state === 'tripped')

const fillColor = computed(() => {
  if (isClosed.value) return '#00e676'
  if (isOpen.value) return '#ff9800'
  if (isTripped.value) return '#ff4081'
  return 'var(--color-surface-elevated)'
})

const switchAngle = computed(() => {
  if (isClosed.value) return 0
  return -30
})
</script>

<template>
  <div :style="{ width: `${size}px`, height: `${size * 1.33}px` }">
    <svg viewBox="0 0 60 80" class="h-full w-full">
      <rect
        x="10"
        y="10"
        width="40"
        height="60"
        stroke="currentColor"
        stroke-width="2"
        :fill="fillColor"
      />
      <line x1="30" y1="20" x2="30" y2="35" stroke="currentColor" stroke-width="2" />
      <line x1="30" y1="45" x2="30" y2="60" stroke="currentColor" stroke-width="2" />
      <line
        x1="20"
        y1="40"
        x2="40"
        y2="30"
        stroke="currentColor"
        stroke-width="2"
        :transform="`rotate(${switchAngle} 30 40)`"
      />
    </svg>

    <div
      v-if="isTripped"
      class="absolute -top-2 -right-2 rounded bg-error px-1 text-xs text-white"
    >
      跳闸
    </div>
  </div>
</template>
