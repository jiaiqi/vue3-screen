<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  speed?: number
  hologramType?: 'scanline' | 'grid' | 'projection'
  intensity?: number
  borderWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#00ffff',
  secondaryColor: '#0088ff',
  tertiaryColor: '#00ff88',
  speed: 1,
  hologramType: 'scanline',
  intensity: 0.6,
  borderWidth: 2,
})

const animationDuration = computed(() => `${3 / props.speed}s`)

const scanlines = computed(() => {
  return Array.from({ length: 20 }, (_, i) => ({
    y: i * 5,
    delay: i * 0.1,
  }))
})
</script>

<template>
  <div class="holo-border relative h-full w-full">
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      :style="{
        filter: `drop-shadow(0 0 ${8 * intensity}px ${primaryColor})`,
      }"
    >
      <defs>
        <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="primaryColor" stop-opacity="0.8" />
          <stop offset="50%" :stop-color="secondaryColor" stop-opacity="0.6" />
          <stop offset="100%" :stop-color="tertiaryColor" stop-opacity="0.8" />
        </linearGradient>
        
        <linearGradient id="holoVertical" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="primaryColor" stop-opacity="0" />
          <stop offset="50%" :stop-color="primaryColor" stop-opacity="1" />
          <stop offset="100%" :stop-color="primaryColor" stop-opacity="0" />
        </linearGradient>
        
        <filter id="holoGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <clipPath id="borderClip">
          <rect
            :width="100 - borderWidth * 2"
            :height="100 - borderWidth * 2"
            :x="borderWidth"
            :y="borderWidth"
          />
        </clipPath>
      </defs>
      
      <rect
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :stroke-width="borderWidth"
        :stroke="'url(#holoGradient)'"
        fill="none"
        filter="url(#holoGlow)"
        class="animate-holo-border"
        :style="{ animationDuration }"
      />
      
      <g v-if="hologramType === 'scanline'" clip-path="url(#borderClip)">
        <line
          v-for="scanline in scanlines"
          :key="scanline.y"
          :x1="0"
          :y1="scanline.y"
          :x2="100"
          :y2="scanline.y"
          :stroke="primaryColor"
          stroke-width="0.5"
          :opacity="intensity * 0.3"
          class="animate-scanline"
          :style="{
            animationDuration,
            animationDelay: `${scanline.delay}s`,
          }"
        />
      </g>
      
      <g v-else-if="hologramType === 'grid'" clip-path="url(#borderClip)">
        <line
          v-for="i in 10"
          :key="'h' + i"
          :x1="0"
          :y1="i * 10"
          :x2="100"
          :y2="i * 10"
          :stroke="primaryColor"
          stroke-width="0.5"
          :opacity="intensity * 0.2"
          class="animate-grid-line"
          :style="{ animationDelay: `${i * 0.1}s` }"
        />
        <line
          v-for="i in 10"
          :key="'v' + i"
          :x1="i * 10"
          :y1="0"
          :x2="i * 10"
          :y2="100"
          :stroke="primaryColor"
          stroke-width="0.5"
          :opacity="intensity * 0.2"
          class="animate-grid-line"
          :style="{ animationDelay: `${i * 0.1}s` }"
        />
      </g>
      
      <g v-else-if="hologramType === 'projection'" clip-path="url(#borderClip)">
        <circle
          cx="50"
          cy="50"
          r="30"
          :stroke="primaryColor"
          :stroke-width="0.5"
          fill="none"
          :opacity="intensity * 0.3"
          class="animate-projection"
          :style="{ animationDuration }"
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          :stroke="secondaryColor"
          :stroke-width="0.5"
          fill="none"
          :opacity="intensity * 0.3"
          class="animate-projection-reverse"
          :style="{ animationDuration }"
        />
      </g>
      
      <rect
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        fill="url(#holoVertical)"
        :opacity="intensity * 0.2"
        class="animate-holo-sweep"
        :style="{ animationDuration }"
      />
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes holo-border {
  0%,
  100% {
    opacity: 1;
    stroke-dasharray: 100 300;
  }
  50% {
    opacity: 0.6;
    stroke-dasharray: 300 100;
  }
}

@keyframes scanline {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes grid-line {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes projection {
  0% {
    r: 20;
    opacity: 0.8;
  }
  100% {
    r: 40;
    opacity: 0;
  }
}

@keyframes projection-reverse {
  0% {
    r: 40;
    opacity: 0;
  }
  100% {
    r: 20;
    opacity: 0.8;
  }
}

@keyframes holo-sweep {
  0% {
    y: 0;
    height: 10;
  }
  100% {
    y: 100;
    height: 10;
  }
}

.animate-holo-border {
  animation: holo-border linear infinite;
}

.animate-scanline {
  animation: scanline ease-in-out infinite;
}

.animate-grid-line {
  animation: grid-line ease-in-out infinite;
}

.animate-projection {
  animation: projection linear infinite;
}

.animate-projection-reverse {
  animation: projection-reverse linear infinite;
}

.animate-holo-sweep {
  animation: holo-sweep linear infinite;
}
</style>
