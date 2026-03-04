<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@vue-flow/core'
import type { EdgeAnimationConfig } from './types'

const props = defineProps<EdgeProps & {
  data?: {
    animation?: EdgeAnimationConfig
  }
}>()

const animation = computed(() => props.data?.animation || {
  type: 'arrowFlow',
  speed: 1,
  direction: 'forward',
  color: '#0073ff',
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

const arrowOffset = ref(0)
let animationFrame: number | null = null

onMounted(() => {
  function animate() {
    arrowOffset.value = (arrowOffset.value + animation.value.speed * 2) % 100
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

const arrowStyle = computed(() => ({
  stroke: animation.value.color,
  strokeWidth: 2,
  fill: 'none',
  opacity: 0.3,
}))

const markerStyle = computed(() => ({
  fill: animation.value.color,
  opacity: animation.value.opacity,
}))
</script>

<template>
  <g class="arrow-flow-edge">
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" :style="markerStyle" />
      </marker>
    </defs>
    <path :d="edgePath" :style="arrowStyle" marker-end="url(#arrowhead)" />
  </g>
</template>
