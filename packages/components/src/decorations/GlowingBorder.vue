<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  speed?: number
  direction?: 'clockwise' | 'counterclockwise'
  glowIntensity?: number
  borderWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#00ffff',
  secondaryColor: '#ff00ff',
  speed: 2,
  direction: 'clockwise',
  glowIntensity: 0.8,
  borderWidth: 2,
})

const animationDuration = computed(() => `${4 / props.speed}s`)
const reverseDirection = props.direction === 'counterclockwise' ? -1 : 1
</script>

<template>
  <div class="glowing-border relative h-full w-full overflow-hidden">
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      :style="{ filter: `drop-shadow(0 0 ${glowIntensity * 10}px ${primaryColor})` }"
    >
      <defs>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="primaryColor" stop-opacity="0" />
          <stop offset="50%" :stop-color="primaryColor" stop-opacity="1" />
          <stop offset="100%" :stop-color="secondaryColor" stop-opacity="0" />
        </linearGradient>
        
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="primaryColor" stop-opacity="0" />
          <stop offset="50%" :stop-color="primaryColor" stop-opacity="1" />
          <stop offset="100%" :stop-color="secondaryColor" stop-opacity="0" />
        </linearGradient>
        
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <rect
        :width="100"
        :height="100"
        :stroke-width="borderWidth"
        fill="none"
        stroke="url(#glowGradient)"
        filter="url(#glowFilter)"
        class="animate-flow"
        :style="{
          animationDuration: animationDuration,
          animationDirection: reverseDirection ? 'reverse' : 'normal',
        }"
      />
      
      <circle
        r="4"
        fill="url(#flowGradient)"
        filter="url(#glowFilter)"
        class="animate-flow-dot"
        :style="{
          animationDuration: animationDuration,
          animationDirection: reverseDirection ? 'reverse' : 'normal',
        }"
      >
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          :calcMode="reverseDirection ? 'reverse' : 'normal'"
          path="M 5,5 L 95,5 L 95,95 L 5,95 Z"
        />
      </circle>
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes flow {
  0% {
    stroke-dashoffset: 400;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.animate-flow {
  stroke-dasharray: 100 400;
  animation: flow linear infinite;
}

.animate-flow-dot {
  animation: flow-dot linear infinite;
}

@keyframes flow-dot {
  0% {
    cx: 5;
    cy: 5;
  }
  25% {
    cx: 95;
    cy: 5;
  }
  50% {
    cx: 95;
    cy: 95;
  }
  75% {
    cx: 5;
    cy: 95;
  }
  100% {
    cx: 5;
    cy: 5;
  }
}
</style>
