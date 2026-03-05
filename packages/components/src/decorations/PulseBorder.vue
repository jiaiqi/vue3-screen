<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  speed?: number
  pulseType?: 'expand' | 'opacity' | 'color'
  borderWidth?: number
  cornerRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#00ffff',
  secondaryColor: '#0088ff',
  speed: 1,
  pulseType: 'expand',
  borderWidth: 2,
  cornerRadius: 0,
})

const animationDuration = computed(() => `${2 / props.speed}s`)
</script>

<template>
  <div class="pulse-border relative h-full w-full">
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      :style="{
        filter: `drop-shadow(0 0 8px ${primaryColor})`,
      }"
    >
      <defs>
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="primaryColor" />
          <stop offset="100%" :stop-color="secondaryColor" />
        </linearGradient>
        
        <filter id="pulseGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <rect
        v-if="pulseType === 'expand'"
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :rx="cornerRadius"
        :ry="cornerRadius"
        :stroke-width="borderWidth"
        :stroke="'url(#pulseGradient)'"
        fill="none"
        filter="url(#pulseGlow)"
        class="animate-pulse-expand"
        :style="{ animationDuration }"
      />
      
      <rect
        v-else-if="pulseType === 'opacity'"
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :rx="cornerRadius"
        :ry="cornerRadius"
        :stroke-width="borderWidth"
        :stroke="'url(#pulseGradient)'"
        fill="none"
        filter="url(#pulseGlow)"
        class="animate-pulse-opacity"
        :style="{ animationDuration }"
      />
      
      <rect
        v-else-if="pulseType === 'color'"
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :rx="cornerRadius"
        :ry="cornerRadius"
        :stroke-width="borderWidth"
        :stroke="'url(#pulseGradient)'"
        fill="none"
        filter="url(#pulseGlow)"
        class="animate-pulse-color"
        :style="{ animationDuration }"
      />
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-expand {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
}

@keyframes pulse-opacity {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes pulse-color {
  0%,
  100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(180deg);
  }
}

.animate-pulse-expand {
  transform-origin: center;
  animation: pulse-expand ease-in-out infinite;
}

.animate-pulse-opacity {
  animation: pulse-opacity ease-in-out infinite;
}

.animate-pulse-color {
  animation: pulse-color ease-in-out infinite;
}
</style>
