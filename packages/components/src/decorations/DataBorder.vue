<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  speed?: number
  dataDensity?: number
  borderWidth?: number
  direction?: 'horizontal' | 'vertical' | 'matrix'
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#00ff00',
  secondaryColor: '#008800',
  speed: 1,
  dataDensity: 20,
  borderWidth: 2,
  direction: 'matrix',
})

const animationDuration = computed(() => `${3 / props.speed}s`)

const dataSegments = computed(() => {
  const segments = []
  const count = props.dataDensity
  
  for (let i = 0; i < count; i++) {
    if (props.direction === 'horizontal') {
      segments.push({
        x: (i / count) * 100,
        y: 0,
        width: 100 / count,
        height: 2,
        delay: i * 0.1,
      })
    } else if (props.direction === 'vertical') {
      segments.push({
        x: 0,
        y: (i / count) * 100,
        width: 2,
        height: 100 / count,
        delay: i * 0.1,
      })
    } else {
      const side = i % 4
      const offset = ((i / count) * 100) % 50
      
      if (side === 0) {
        segments.push({ x: offset, y: 0, width: 10, height: 2, delay: i * 0.1 })
      } else if (side === 1) {
        segments.push({ x: 100, y: offset, width: 2, height: 10, delay: i * 0.1 })
      } else if (side === 2) {
        segments.push({ x: 100 - offset, y: 100, width: 10, height: 2, delay: i * 0.1 })
      } else {
        segments.push({ x: 0, y: 100 - offset, width: 2, height: 10, delay: i * 0.1 })
      }
    }
  }
  
  return segments
})

const binaryDigits = computed(() => {
  const digits = []
  const count = 16
  
  for (let i = 0; i < count; i++) {
    digits.push({
      value: Math.random() > 0.5 ? '1' : '0',
      x: 5 + (i % 8) * 12,
      y: i < 8 ? 5 : 95,
      delay: i * 0.2,
    })
  }
  
  return digits
})
</script>

<template>
  <div class="data-border relative h-full w-full">
    <svg class="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="primaryColor" />
          <stop offset="100%" :stop-color="secondaryColor" />
        </linearGradient>
        
        <filter id="dataGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" :stroke="primaryColor" stroke-width="0.5" opacity="0.3" />
        </pattern>
      </defs>
      
      <rect width="100" height="100" fill="url(#gridPattern)" />
      
      <rect
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :stroke-width="borderWidth"
        :stroke="'url(#dataGradient)'"
        fill="none"
        filter="url(#dataGlow)"
        opacity="0.5"
      />
      
      <g v-for="(segment, index) in dataSegments" :key="index">
        <rect
          :x="segment.x"
          :y="segment.y"
          :width="segment.width"
          :height="segment.height"
          :fill="primaryColor"
          filter="url(#dataGlow)"
          class="animate-data-segment"
          :style="{
            animationDuration,
            animationDelay: `${segment.delay}s`,
          }"
        />
      </g>
      
      <text
        v-for="(digit, index) in binaryDigits"
        :key="index"
        :x="digit.x"
        :y="digit.y"
        font-size="8"
        font-family="monospace"
        :fill="primaryColor"
        filter="url(#dataGlow)"
        class="animate-data-digit"
        :style="{ animationDelay: `${digit.delay}s` }"
      >
        {{ digit.value }}
      </text>
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes data-segment {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

@keyframes data-digit {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.animate-data-segment {
  animation: data-segment ease-in-out infinite;
}

.animate-data-digit {
  animation: data-digit ease-in-out infinite;
}
</style>
