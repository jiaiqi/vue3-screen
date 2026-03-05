<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  metalType?: 'steel' | 'gold' | 'bronze' | 'chrome'
  speed?: number
  borderWidth?: number
  cornerRadius?: number
  shineIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#c0c0c0',
  secondaryColor: '#e8e8e8',
  metalType: 'steel',
  speed: 1,
  borderWidth: 4,
  cornerRadius: 4,
  shineIntensity: 0.7,
})

const animationDuration = computed(() => `${4 / props.speed}s`)

const metalColors = computed(() => {
  const colors = {
    steel: { primary: '#c0c0c0', secondary: '#e8e8e8', highlight: '#ffffff' },
    gold: { primary: '#ffd700', secondary: '#ffec8b', highlight: '#fffacd' },
    bronze: { primary: '#cd7f32', secondary: '#e6a86c', highlight: '#ffb347' },
    chrome: { primary: '#e8e8e8', secondary: '#ffffff', highlight: '#f0f0f0' },
  }
  return colors[props.metalType]
})
</script>

<template>
  <div class="metal-border relative h-full w-full">
    <svg class="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="metalColors.secondary" />
          <stop offset="25%" :stop-color="metalColors.primary" />
          <stop offset="50%" :stop-color="metalColors.highlight" />
          <stop offset="75%" :stop-color="metalColors.primary" />
          <stop offset="100%" :stop-color="metalColors.secondary" />
        </linearGradient>
        
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="metalColors.highlight" stop-opacity="0" />
          <stop offset="50%" :stop-color="metalColors.highlight" :stop-opacity="shineIntensity" />
          <stop offset="100%" :stop-color="metalColors.highlight" stop-opacity="0" />
        </linearGradient>
        
        <filter id="metalBevel">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="2"
            specularConstant="0.8"
            specularExponent="20"
            lighting-color="white"
          >
            <fePointLight x="100" y="0" z="200" />
          </feSpecularLighting>
          <feComposite in="SourceGraphic" operator="in" in2="specularOut" />
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
        stroke="url(#metalGradient)"
        fill="none"
        filter="url(#metalBevel)"
        class="animate-metal-shine"
        :style="{ animationDuration }"
      />
      
      <rect
        :width="100 - borderWidth * 2"
        :height="100 - borderWidth * 2"
        :x="borderWidth"
        :y="borderWidth"
        :rx="cornerRadius"
        :ry="cornerRadius"
        :stroke-width="borderWidth / 2"
        stroke="url(#shineGradient)"
        fill="none"
        class="animate-shine"
        :style="{ animationDuration }"
      />
      
      <path
        v-for="i in 4"
        :key="i"
        :d="`
          M ${i === 1 ? borderWidth : i === 2 ? 100 - borderWidth : i === 3 ? 100 - borderWidth : borderWidth} 
            ${i === 1 || i === 2 ? borderWidth : 100 - borderWidth}
          L ${i === 1 ? borderWidth + 10 : i === 2 ? 100 - borderWidth - 10 : i === 3 ? 100 - borderWidth - 10 : borderWidth + 10}
            ${i === 1 || i === 2 ? borderWidth : 100 - borderWidth}
        `"
        :stroke="metalColors.highlight"
        stroke-width="2"
        fill="none"
        opacity="0.6"
      />
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes metal-shine {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

@keyframes shine {
  0% {
    stroke-dasharray: 0 400;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100 300;
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dasharray: 0 400;
    stroke-dashoffset: -400;
  }
}

.animate-metal-shine {
  animation: metal-shine ease-in-out infinite;
}

.animate-shine {
  stroke-dasharray: 100 300;
  animation: shine linear infinite;
}
</style>
