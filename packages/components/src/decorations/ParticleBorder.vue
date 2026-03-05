<script setup lang="ts">
interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  delay: number
}

interface Props {
  primaryColor?: string
  particleCount?: number
  speed?: number
  particleSize?: number
  direction?: 'horizontal' | 'vertical' | 'both'
  borderWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#00ffff',
  particleCount: 8,
  speed: 1,
  particleSize: 3,
  direction: 'horizontal',
  borderWidth: 1,
})

const particles = computed(() => {
  return Array.from({ length: props.particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * props.particleSize + 1,
    speed: Math.random() * props.speed + 0.5,
    delay: Math.random() * 2,
  }))
})

const animationDuration = computed(() => `${3 / props.speed}s`)
</script>

<template>
  <div class="particle-border relative h-full w-full">
    <svg class="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <filter id="particleGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <radialGradient id="particleGradient">
          <stop offset="0%" :stop-color="primaryColor" stop-opacity="1" />
          <stop offset="100%" :stop-color="primaryColor" stop-opacity="0" />
        </radialGradient>
      </defs>
      
      <rect
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :stroke-width="borderWidth"
        :stroke="primaryColor"
        fill="none"
        opacity="0.3"
      />
      
      <circle
        v-for="particle in particles"
        :key="particle.id"
        :r="particle.size"
        :fill="primaryColor"
        filter="url(#particleGlow)"
        class="animate-particle"
        :style="{
          animationDuration: animationDuration,
          animationDelay: `${particle.delay}s`,
        }"
      >
        <animate
          v-if="direction === 'horizontal'"
          attributeName="cx"
          :from="-particle.size"
          :to="100 + particle.size"
          :dur="animationDuration"
          repeatCount="indefinite"
        />
        <animate
          v-if="direction === 'horizontal'"
          attributeName="cy"
          :values="`${particle.y}; ${particle.y}`"
          :dur="animationDuration"
          repeatCount="indefinite"
        />
        
        <animate
          v-else-if="direction === 'vertical'"
          attributeName="cy"
          :from="-particle.size"
          :to="100 + particle.size"
          :dur="animationDuration"
          repeatCount="indefinite"
        />
        <animate
          v-else-if="direction === 'vertical'"
          attributeName="cx"
          :values="`${particle.x}; ${particle.x}`"
          :dur="animationDuration"
          repeatCount="indefinite"
        />
        
        <animate
          v-else
          attributeName="cx"
          :from="particle.x"
          :to="particle.x + 20"
          :dur="animationDuration"
          repeatCount="indefinite"
        />
        <animate
          v-else
          attributeName="cy"
          :from="particle.y"
          :to="particle.y + 20"
          :dur="animationDuration"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.animate-particle {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
