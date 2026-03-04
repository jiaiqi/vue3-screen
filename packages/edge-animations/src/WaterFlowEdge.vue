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
  type: 'waterFlow',
  speed: 1,
  direction: 'forward',
  color: '#00bfff',
  opacity: 1,
  pipeWidth: 8,
  fluidWidth: 4,
  showPipe: true,
})

const [edgePath] = getSmoothStepPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  targetX: props.targetX,
  targetY: props.targetY,
  sourcePosition: props.sourcePosition,
  targetPosition: props.targetPosition,
})

const pipeStyle = computed(() => ({
  stroke: animation.value.pipeColor || 'rgba(255, 255, 255, 0.1)',
  strokeWidth: animation.value.pipeWidth || 8,
  fill: 'none',
}))

const fluidStyle = computed(() => ({
  stroke: animation.value.color,
  strokeWidth: animation.value.fluidWidth || 4,
  fill: 'none',
  strokeDasharray: '10 5',
  animation: `waterFlow ${2 / animation.value.speed}s linear infinite`,
  opacity: animation.value.opacity,
}))
</script>

<template>
  <g class="water-flow-edge">
    <path :d="edgePath" :style="pipeStyle" class="pipe" />
    <path :d="edgePath" :style="fluidStyle" class="fluid" />
  </g>
</template>

<style scoped>
@keyframes waterFlow {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -30;
  }
}
</style>
