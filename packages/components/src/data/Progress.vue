<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value?: number
  max?: number
  color?: string
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 65,
  max: 100,
  color: '#0073ff',
  showLabel: true,
})

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<template>
  <div class="progress-wrapper flex h-full w-full items-center gap-3">
    <div class="progress-bar relative h-2 flex-1 overflow-hidden rounded-full bg-surface-overlay">
      <div 
        class="progress-fill h-full rounded-full transition-all duration-300"
        :style="{ 
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`
        }"
      />
    </div>
    <span v-if="showLabel" class="progress-label text-sm font-medium text-text-primary">
      {{ Math.round(percentage) }}%
    </span>
  </div>
</template>

<style scoped>
.progress-fill {
  box-shadow: 0 0 10px v-bind('color');
}
</style>
