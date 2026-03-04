<script setup lang="ts">
interface Props {
  borderColor?: string
  cornerSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  borderColor: '#0073ff',
  cornerSize: 20,
})
</script>

<template>
  <div class="tech-border relative h-full w-full">
    <svg class="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <path
        :d="`
          M ${cornerSize} 0
          L 0 0
          L 0 ${cornerSize}
          M ${`calc(100% - ${cornerSize})`} 0
          L 100% 0
          L 100% ${cornerSize}
          M 100% ${`calc(100% - ${cornerSize})`}
          L 100% 100%
          L ${`calc(100% - ${cornerSize})`} 100%
          M ${cornerSize} 100%
          L 0 100%
          L 0 ${`calc(100% - ${cornerSize})`}
        `"
        :stroke="borderColor"
        stroke-width="2"
        fill="none"
        filter="url(#glow)"
      />
    </svg>
    
    <div class="relative h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tech-border svg {
  overflow: visible;
}
</style>
