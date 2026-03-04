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
  type: 'electric',
  speed: 2,
  direction: 'forward',
  color: '#ffd700',
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

const electricStyle = computed(() => ({
  stroke: animation.value.color,
  strokeWidth: 2,
  fill: 'none',
  strokeDasharray: '5 3',
  animation: `electricPulse ${0.5 / animation.value.speed}s ease-in-out infinite`,
  filter: `drop-shadow(0 0 4px ${animation.value.color})`,
  opacity: animation.value.opacity,
}))
</script>

<template>
  <g class="electric-edge">
    <path :d="edgePath" :style="electricStyle" class="electric" />
  </g>
</template>

<style scoped>
@keyframes electricPulse {
  0%, 100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  50% {
    stroke-dashoffset: -16;
    opacity: 0.6;
  }
}
</style>
