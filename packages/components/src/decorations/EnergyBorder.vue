<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  energyType?: 'electric' | 'plasma' | 'fire' | 'ice'
  speed?: number
  intensity?: number
  borderWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#ff6600',
  secondaryColor: '#ffff00',
  energyType: 'electric',
  speed: 2,
  intensity: 0.8,
  borderWidth: 3,
})

const animationDuration = computed(() => `${2 / props.speed}s`)

const energyColors = computed(() => {
  const colors = {
    electric: { primary: '#ff6600', secondary: '#ffff00', tertiary: '#ffffff' },
    plasma: { primary: '#ff00ff', secondary: '#00ffff', tertiary: '#ffffff' },
    fire: { primary: '#ff0000', secondary: '#ff6600', tertiary: '#ffff00' },
    ice: { primary: '#0066ff', secondary: '#00ffff', tertiary: '#ffffff' },
  }
  return colors[props.energyType]
})

const energySegments = computed(() => {
  const segments = []
  const count = 12
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 360
    const side = i % 4
    const offset = (i / count) * 100
    
    if (side === 0) {
      segments.push({ x1: offset, y1: 0, x2: offset + 5, y2: 0 })
    } else if (side === 1) {
      segments.push({ x1: 100, y1: offset, x2: 100, y2: offset + 5 })
    } else if (side === 2) {
      segments.push({ x1: 100 - offset, y1: 100, x2: 100 - offset - 5, y2: 100 })
    } else {
      segments.push({ x1: 0, y1: 100 - offset, x2: 0, y2: 100 - offset - 5 })
    }
  }
  
  return segments
})
</script>

<template>
  <div class="energy-border relative h-full w-full">
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      :style="{
        filter: `drop-shadow(0 0 ${10 * intensity}px ${energyColors.primary})`,
      }"
    >
      <defs>
        <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="energyColors.primary" />
          <stop offset="50%" :stop-color="energyColors.secondary" />
          <stop offset="100%" :stop-color="energyColors.tertiary" />
        </linearGradient>
        
        <filter id="energyGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <rect
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :stroke-width="borderWidth"
        :stroke="'url(#energyGradient)'"
        fill="none"
        filter="url(#energyGlow)"
        class="animate-energy-pulse"
        :style="{ animationDuration }"
      />
      
      <g v-for="(segment, index) in energySegments" :key="index">
        <line
          :x1="segment.x1"
          :y1="segment.y1"
          :x2="segment.x2"
          :y2="segment.y2"
          :stroke="energyColors.secondary"
          stroke-width="2"
          filter="url(#energyGlow)"
          class="animate-energy-segment"
          :style="{
            animationDuration,
            animationDelay: `${index * 0.1}s`,
          }"
        />
      </g>
      
      <circle
        v-for="i in 4"
        :key="i"
        :cx="i === 1 ? 0 : i === 2 ? 100 : i === 3 ? 100 : 0"
        :cy="i === 1 || i === 2 ? 0 : 100"
        r="3"
        :fill="energyColors.tertiary"
        filter="url(#energyGlow)"
        class="animate-energy-node"
        :style="{ animationDuration, animationDelay: `${i * 0.2}s` }"
      />
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes energy-pulse {
  0%,
  100% {
    opacity: 1;
    stroke-width: v-bind(borderWidth);
  }
  50% {
    opacity: 0.7;
    stroke-width: calc(v-bind(borderWidth) * 1.5);
  }
}

@keyframes energy-segment {
  0%,
  100% {
    opacity: 0.3;
    stroke-dasharray: 0 10;
  }
  50% {
    opacity: 1;
    stroke-dasharray: 10 5;
  }
}

@keyframes energy-node {
  0%,
  100% {
    r: 3;
    opacity: 1;
  }
  50% {
    r: 5;
    opacity: 0.5;
  }
}

.animate-energy-pulse {
  animation: energy-pulse ease-in-out infinite;
}

.animate-energy-segment {
  animation: energy-segment ease-in-out infinite;
}

.animate-energy-node {
  animation: energy-node ease-in-out infinite;
}
</style>
