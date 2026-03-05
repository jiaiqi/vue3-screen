<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  speed?: number
  flickerIntensity?: number
  borderWidth?: number
  cornerRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#ff00ff',
  secondaryColor: '#00ffff',
  tertiaryColor: '#ffff00',
  speed: 1,
  flickerIntensity: 0.8,
  borderWidth: 3,
  cornerRadius: 8,
})

const animationDuration = computed(() => `${2 / props.speed}s`)
</script>

<template>
  <div class="neon-border relative h-full w-full">
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      :style="{
        filter: `drop-shadow(0 0 ${10 * flickerIntensity}px ${primaryColor}) drop-shadow(0 0 ${20 * flickerIntensity}px ${primaryColor})`,
      }"
    >
      <defs>
        <linearGradient id="neonGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="primaryColor" />
          <stop offset="50%" :stop-color="secondaryColor" />
          <stop offset="100%" :stop-color="primaryColor" />
        </linearGradient>
        
        <linearGradient id="neonGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="secondaryColor" />
          <stop offset="50%" :stop-color="tertiaryColor" />
          <stop offset="100%" :stop-color="secondaryColor" />
        </linearGradient>
        
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
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
        :rx="cornerRadius"
        :ry="cornerRadius"
        :stroke-width="borderWidth"
        stroke="url(#neonGradient1)"
        fill="none"
        filter="url(#neonGlow)"
        class="animate-neon-top"
        :style="{ animationDuration }"
      />
      
      <rect
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :rx="cornerRadius"
        :ry="cornerRadius"
        :stroke-width="borderWidth"
        stroke="url(#neonGradient2)"
        fill="none"
        filter="url(#neonGlow)"
        class="animate-neon-side"
        :style="{ animationDuration }"
      />
      
      <rect
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :rx="cornerRadius"
        :ry="cornerRadius"
        :stroke-width="borderWidth"
        :stroke="primaryColor"
        fill="none"
        filter="url(#neonGlow)"
        class="animate-neon-flicker"
        :style="{ animationDuration }"
      />
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes neon-top {
  0%,
  100% {
    stroke-dasharray: 100 300;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 300 100;
    stroke-dashoffset: -100;
  }
}

@keyframes neon-side {
  0%,
  100% {
    stroke-dasharray: 100 300;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 300 100;
    stroke-dashoffset: 100;
  }
}

@keyframes neon-flicker {
  0%,
  100% {
    opacity: 1;
  }
  10% {
    opacity: 0.8;
  }
  20% {
    opacity: 1;
  }
  30% {
    opacity: 0.6;
  }
  40% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
  60% {
    opacity: 1;
  }
  70% {
    opacity: 0.7;
  }
  80% {
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
}

.animate-neon-top {
  animation: neon-top linear infinite;
}

.animate-neon-side {
  animation: neon-side linear infinite;
}

.animate-neon-flicker {
  animation: neon-flicker ease-in-out infinite;
}
</style>
