<script setup lang="ts">
import { computed } from 'vue'
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@vue-flow/core'
import type { EdgeAnimationConfig } from './types'

const props = defineProps<EdgeProps & {
  data?: {
    animation?: EdgeAnimationConfig
  }
}>()

const animation = computed(() => props.data?.animation || {
  type: 'pulse',
  speed: 1,
  direction: 'forward',
  color: '#ff4081',
  opacity: 1,
})

const [edgePath] = getSmoothStepPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  targetX: props.targetX,
  targetY: props.targetY,
  sourcePosition: props.sourcePosition,
  targetPosition: props.targetPosition,
})

const baseStyle = computed(() => ({
  stroke: animation.value.color,
  strokeWidth: 2,
  fill: 'none',
  opacity: 0.5,
}))

const pulseStyle = computed(() => ({
  stroke: animation.value.color,
  strokeWidth: 4,
  fill: 'none',
  filter: `drop-shadow(0 0 8px ${animation.value.color})`,
  animation: `pulse ${1 / animation.value.speed}s ease-in-out infinite`,
}))
</script>

<template>
  <g class="pulse-edge">
    <path :d="edgePath" :style="baseStyle" />
    <path :d="edgePath" :style="pulseStyle" class="pulse" />
  </g>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    stroke-dasharray: 0 1500;
    opacity: 0;
  }
  50% {
    stroke-dasharray: 1500 0;
    opacity: 1;
  }
}
</style>
