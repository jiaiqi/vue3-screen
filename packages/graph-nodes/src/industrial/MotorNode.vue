<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  state?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  state: 'unknown',
  size: 80,
})

const isRunning = computed(() => props.state === 'running')
const isFault = computed(() => props.state === 'fault')

const nodeClass = computed(() => [
  'motor-node',
  'relative',
  'transition-all',
  'duration-300',
  {
    'animate-spin': isRunning.value,
    'animate-pulse': isFault.value,
  },
])

const borderColor = computed(() => {
  if (isRunning.value) return '#00e676'
  if (isFault.value) return '#ff4081'
  return 'currentColor'
})
</script>

<template>
  <div :class="nodeClass" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg viewBox="0 0 100 100" class="h-full w-full">
      <rect
        x="10"
        y="30"
        width="60"
        height="40"
        rx="5"
        :stroke="borderColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
      <circle
        cx="80"
        cy="50"
        r="15"
        stroke="currentColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
      <circle cx="80" cy="50" r="5" fill="currentColor" />
      <line x1="30" y1="40" x2="50" y2="40" stroke="currentColor" stroke-width="2" />
      <line x1="30" y1="50" x2="50" y2="50" stroke="currentColor" stroke-width="2" />
      <line x1="30" y1="60" x2="50" y2="60" stroke="currentColor" stroke-width="2" />
    </svg>

    <div
      v-if="isFault"
      class="absolute -top-2 -right-2 rounded bg-error px-1 text-xs text-white"
    >
      故障
    </div>
  </div>
</template>
