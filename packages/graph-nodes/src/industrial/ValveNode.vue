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

const isOpen = computed(() => props.state === 'open')
const isClosed = computed(() => props.state === 'closed')

const fillColor = computed(() => {
  if (isOpen.value) return '#00e676'
  if (isClosed.value) return '#ff4081'
  return 'currentColor'
})
</script>

<template>
  <div :style="{ width: `${size}px`, height: `${size}px` }">
    <svg viewBox="0 0 100 100" class="h-full w-full">
      <path d="M20 30 L50 50 L20 70 Z" :fill="fillColor" opacity="0.5" />
      <path d="M80 30 L50 50 L80 70 Z" :fill="fillColor" opacity="0.5" />
      <rect x="45" y="10" width="10" height="40" fill="currentColor" />
      <circle
        cx="50"
        cy="10"
        r="8"
        stroke="currentColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
    </svg>
  </div>
</template>
