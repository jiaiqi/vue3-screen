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
  type: 'particle',
  speed: 1,
  direction: 'forward',
  color: '#00ff88',
  opacity: 1,
  particleCount: 5,
  particleSize: 4,
  particleGlow: true,
})

const [edgePath] = getSmoothStepPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  targetX: props.targetX,
  targetY: props.targetY,
  sourcePosition: props.sourcePosition,
  targetPosition: props.targetPosition,
})

interface Particle {
  id: number
  offset: number
}

const particles = ref<Particle[]>([])

onMounted(() => {
  const count = animation.value.particleCount || 5
  particles.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    offset: (i / count) * 100,
  }))
})

const pathStyle = computed(() => ({
  stroke: 'rgba(255, 255, 255, 0.1)',
  strokeWidth: 2,
  fill: 'none',
}))

const particleStyle = computed(() => ({
  fill: animation.value.color,
  filter: animation.value.particleGlow 
    ? `drop-shadow(0 0 6px ${animation.value.color})` 
    : 'none',
}))
</script>

<template>
  <g class="particle-edge">
    <path :d="edgePath" :style="pathStyle" />
    <circle
      v-for="particle in particles"
      :key="particle.id"
      :r="animation.particleSize || 4"
      :style="particleStyle"
    >
      <animateMotion
        :dur="`${3 / animation.speed}s`"
        repeatCount="indefinite"
        :begin="`${particle.offset * (3 / animation.speed / 100)}s`"
      >
        <mpath :href="`#path-${id}`" />
      </animateMotion>
    </circle>
    <path :id="`path-${id}`" :d="edgePath" fill="none" stroke="none" />
  </g>
</template>
