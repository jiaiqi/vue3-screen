<script setup lang="ts">
interface Props {
  primaryColor?: string
  circuitColor?: string
  speed?: number
  complexity?: number
  borderWidth?: number
  cornerSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#00ffff',
  circuitColor: '#00ff88',
  speed: 1,
  complexity: 5,
  borderWidth: 2,
  cornerSize: 15,
})

const animationDuration = computed(() => `${3 / props.speed}s`)

const circuitLines = computed(() => {
  const lines = []
  const count = props.complexity
  
  for (let i = 0; i < count; i++) {
    const side = i % 4
    const offset = (i / count) * 100
    
    if (side === 0) {
      lines.push({
        x1: cornerSize,
        y1: 0,
        x2: cornerSize + offset * 0.3,
        y2: 0,
        x3: cornerSize + offset * 0.3,
        y3: offset * 0.5,
      })
    } else if (side === 1) {
      lines.push({
        x1: 100 - cornerSize,
        y1: 0,
        x2: 100 - cornerSize - offset * 0.3,
        y2: 0,
        x3: 100 - cornerSize - offset * 0.3,
        y3: offset * 0.5,
      })
    } else if (side === 2) {
      lines.push({
        x1: 100 - cornerSize,
        y1: 100,
        x2: 100 - cornerSize - offset * 0.3,
        y2: 100,
        x3: 100 - cornerSize - offset * 0.3,
        y3: 100 - offset * 0.5,
      })
    } else {
      lines.push({
        x1: cornerSize,
        y1: 100,
        x2: cornerSize + offset * 0.3,
        y2: 100,
        x3: cornerSize + offset * 0.3,
        y3: 100 - offset * 0.5,
      })
    }
  }
  
  return lines
})
</script>

<template>
  <div class="circuit-border relative h-full w-full">
    <svg class="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <filter id="circuitGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="primaryColor" />
          <stop offset="100%" :stop-color="circuitColor" />
        </linearGradient>
      </defs>
      
      <path
        :d="`
          M ${cornerSize} ${borderWidth}
          L ${100 - cornerSize} ${borderWidth}
          L ${100 - borderWidth} ${cornerSize}
          L ${100 - borderWidth} ${100 - cornerSize}
          L ${100 - cornerSize} ${100 - borderWidth}
          L ${cornerSize} ${100 - borderWidth}
          L ${borderWidth} ${100 - cornerSize}
          L ${borderWidth} ${cornerSize}
          Z
        `"
        :stroke-width="borderWidth"
        :stroke="'url(#circuitGradient)'"
        fill="none"
        filter="url(#circuitGlow)"
      />
      
      <g v-for="(line, index) in circuitLines" :key="index">
        <path
          :d="`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2} L ${line.x3} ${line.y3}`"
          :stroke="circuitColor"
          stroke-width="1"
          fill="none"
          class="animate-circuit"
          :style="{ animationDuration, animationDelay: `${index * 0.2}s` }"
        />
        
        <circle
          :cx="line.x3"
          :cy="line.y3"
          r="2"
          :fill="primaryColor"
          filter="url(#circuitGlow)"
          class="animate-circuit-dot"
          :style="{ animationDuration, animationDelay: `${index * 0.2}s` }"
        />
      </g>
      
      <circle
        v-for="i in 4"
        :key="i"
        :cx="i === 1 ? cornerSize : i === 2 ? 100 - cornerSize : i === 3 ? 100 - cornerSize : cornerSize"
        :cy="i === 1 || i === 2 ? cornerSize : 100 - cornerSize"
        r="4"
        :fill="primaryColor"
        filter="url(#circuitGlow)"
        class="animate-circuit-pulse"
        :style="{ animationDuration }"
      />
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes circuit {
  0%,
  100% {
    opacity: 0.3;
    stroke-dasharray: 0 100;
  }
  50% {
    opacity: 1;
    stroke-dasharray: 100 100;
  }
}

@keyframes circuit-dot {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes circuit-pulse {
  0%,
  100% {
    opacity: 1;
    r: 4;
  }
  50% {
    opacity: 0.5;
    r: 6;
  }
}

.animate-circuit {
  animation: circuit ease-in-out infinite;
}

.animate-circuit-dot {
  animation: circuit-dot ease-in-out infinite;
  transform-origin: center;
}

.animate-circuit-pulse {
  animation: circuit-pulse ease-in-out infinite;
}
</style>
