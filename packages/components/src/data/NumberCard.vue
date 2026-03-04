<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  value?: number
  unit?: string
  showTrend?: boolean
  trend?: 'up' | 'down' | 'flat'
}

const props = withDefaults(defineProps<Props>(), {
  title: '总数量',
  value: 12345,
  unit: '个',
  showTrend: true,
  trend: 'up',
})

const formattedValue = computed(() => {
  return props.value.toLocaleString()
})

const trendColor = computed(() => {
  if (props.trend === 'up') return 'text-success'
  if (props.trend === 'down') return 'text-error'
  return 'text-text-secondary'
})

const trendIcon = computed(() => {
  if (props.trend === 'up') return '↑'
  if (props.trend === 'down') return '↓'
  return '→'
})
</script>

<template>
  <div class="number-card flex h-full w-full flex-col justify-center rounded-lg bg-surface-elevated p-4">
    <div class="text-sm text-text-secondary">{{ title }}</div>
    <div class="mt-2 flex items-baseline gap-2">
      <span class="text-3xl font-bold text-text-primary">{{ formattedValue }}</span>
      <span class="text-sm text-text-secondary">{{ unit }}</span>
    </div>
    <div v-if="showTrend" class="mt-2" :class="trendColor">
      {{ trendIcon }} 12.5%
    </div>
  </div>
</template>
