<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  borderWidth?: number
  cornerRadius?: number
  cornerSize?: number
  dashed?: boolean
  dashArray?: string
  glowIntensity?: number
  animationType?: 'none' | 'flow' | 'pulse' | 'dash'
  speed?: number
  gradientDirection?: 'horizontal' | 'vertical' | 'diagonal'
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#00ffff',
  secondaryColor: '#ff00ff',
  borderWidth: 2,
  cornerRadius: 0,
  cornerSize: 20,
  dashed: false,
  dashArray: '10 5',
  glowIntensity: 0.5,
  animationType: 'flow',
  speed: 1,
  gradientDirection: 'horizontal',
})

const animationDuration = computed(() => `${3 / props.speed}s`)

const gradientCoords = computed(() => {
  const coords = {
    horizontal: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
    vertical: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    diagonal: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
  }
  return coords[props.gradientDirection]
})

const borderPath = computed(() => {
  if (props.cornerRadius > 0) {
    return `
      M ${props.cornerRadius} ${props.borderWidth}
      L ${100 - props.cornerRadius} ${props.borderWidth}
      A ${props.cornerRadius} ${props.cornerRadius} 0 0 1 ${100 - props.borderWidth} ${props.cornerRadius}
      L ${100 - props.borderWidth} ${100 - props.cornerRadius}
      A ${props.cornerRadius} ${props.cornerRadius} 0 0 1 ${100 - props.cornerRadius} ${100 - props.borderWidth}
      L ${props.cornerRadius} ${100 - props.borderWidth}
      A ${props.cornerRadius} ${props.cornerRadius} 0 0 1 ${props.borderWidth} ${100 - props.cornerRadius}
      L ${props.borderWidth} ${props.cornerRadius}
      A ${props.cornerRadius} ${props.cornerRadius} 0 0 1 ${props.cornerRadius} ${props.borderWidth}
      Z
    `
  }
  
  return `
    M ${props.borderWidth} ${props.borderWidth}
    L ${100 - props.borderWidth} ${props.borderWidth}
    L ${100 - props.borderWidth} ${100 - props.borderWidth}
    L ${props.borderWidth} ${100 - props.borderWidth}
    Z
  `
})

const strokeDasharrayValue = computed(() => {
  if (props.dashed) {
    return props.dashArray
  }
  if (props.animationType === 'flow') {
    return '100 300'
  }
  return 'none'
})
</script>

<template>
  <div
    class="custom-border relative h-full w-full"
    :style="{
      filter: glowIntensity > 0 ? `drop-shadow(0 0 ${glowIntensity * 10}px ${primaryColor})` : 'none',
    }"
  >
    <svg class="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <linearGradient
          id="customGradient"
          :x1="gradientCoords.x1"
          :y1="gradientCoords.y1"
          :x2="gradientCoords.x2"
          :y2="gradientCoords.y2"
        >
          <stop offset="0%" :stop-color="primaryColor" />
          <stop offset="100%" :stop-color="secondaryColor" />
        </linearGradient>
        
        <filter id="customGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <clipPath id="customClip">
          <path :d="borderPath" />
        </clipPath>
      </defs>
      
      <path
        :d="borderPath"
        :stroke-width="borderWidth"
        :stroke="dashed || animationType === 'flow' ? 'url(#customGradient)' : primaryColor"
        :stroke-dasharray="strokeDasharrayValue"
        fill="none"
        filter="url(#customGlow)"
        :class="{
          'animate-custom-flow': animationType === 'flow',
          'animate-custom-pulse': animationType === 'pulse',
          'animate-custom-dash': animationType === 'dash',
        }"
        :style="{ animationDuration }"
      />
      
      <path
        v-if="animationType === 'flow'"
        :d="borderPath"
        :stroke-width="borderWidth / 2"
        stroke="url(#customGradient)"
        fill="none"
        class="animate-custom-flow-overlay"
        :style="{ animationDuration }"
      />
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes custom-flow {
  0% {
    stroke-dashoffset: 400;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes custom-pulse {
  0%,
  100% {
    opacity: 1;
    stroke-width: v-bind(borderWidth);
  }
  50% {
    opacity: 0.5;
    stroke-width: calc(v-bind(borderWidth) * 0.8);
  }
}

@keyframes custom-dash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -20;
  }
}

@keyframes custom-flow-overlay {
  0% {
    stroke-dashoffset: 400;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.animate-custom-flow {
  animation: custom-flow linear infinite;
}

.animate-custom-pulse {
  animation: custom-pulse ease-in-out infinite;
}

.animate-custom-dash {
  animation: custom-dash linear infinite;
}

.animate-custom-flow-overlay {
  animation: custom-flow-overlay linear infinite;
  mix-blend-mode: screen;
}
</style>
