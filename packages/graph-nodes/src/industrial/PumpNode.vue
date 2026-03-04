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
const isStopped = computed(() => props.state === 'stop')

const nodeClass = computed(() => [
  'pump-node',
  'relative',
  'transition-all',
  'duration-300',
  {
    'animate-spin': isRunning.value,
    'animate-pulse': isFault.value,
    'opacity-40': isStopped.value,
  },
])

const borderColor = computed(() => {
  if (isRunning.value) return '#00e676'
  if (isFault.value) return '#ff4081'
  return 'currentColor'
})

const fillColor = computed(() => {
  if (isRunning.value) return '#00e676'
  if (isFault.value) return '#ff4081'
  return 'currentColor'
})
</script>

<template>
  <div :class="nodeClass" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg viewBox="0 0 100 100" class="h-full w-full">
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        :stroke="borderColor" 
        stroke-width="4" 
        fill="var(--color-surface-elevated)"
      />
      <path 
        d="M30 50 L50 25 L70 50 L50 75 Z" 
        :fill="fillColor" 
        opacity="0.5"
      />
      <circle cx="50" cy="50" r="12" :fill="fillColor" />
    </svg>
    
    <div 
      v-if="isFault" 
      class="absolute -top-2 -right-2 rounded bg-error px-1 text-xs text-white"
    >
      故障
    </div>
  </div>
</template>
