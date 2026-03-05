<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

interface Props {
  title?: string
  value?: number
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  trendValue?: number
  trendType?: 'absolute' | 'percentage'
  trendDirection?: 'up' | 'down' | 'flat'
  animated?: boolean
  animationDuration?: number
  showTrendIcon?: boolean
  trendColors?: {
    up: string
    down: string
    flat: string
  }
  backgroundColor?: string
  borderRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '趋势数据',
  value: 0,
  prefix: '',
  suffix: '',
  decimalPlaces: 0,
  trendValue: 0,
  trendType: 'percentage',
  trendDirection: 'up',
  animated: true,
  animationDuration: 1000,
  showTrendIcon: true,
  trendColors: () => ({
    up: 'text-success',
    down: 'text-error',
    flat: 'text-text-secondary',
  }),
  backgroundColor: 'bg-surface-elevated',
  borderRadius: 8,
})

const displayValue = ref(0)
const currentValue = ref(0)

const formattedValue = computed(() => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: props.decimalPlaces,
    maximumFractionDigits: props.decimalPlaces,
  }
  return currentValue.value.toLocaleString('zh-CN', options)
})

const formattedTrendValue = computed(() => {
  if (props.trendType === 'percentage') {
    return `${props.trendValue > 0 ? '+' : ''}${props.trendValue}%`
  }
  return props.trendValue.toLocaleString('zh-CN')
})

const trendColorClass = computed(() => {
  return props.trendColors?.[props.trendDirection] || props.trendColors?.up
})

const trendIcon = computed(() => {
  if (!props.showTrendIcon) return ''
  switch (props.trendDirection) {
    case 'up':
      return '↑'
    case 'down':
      return '↓'
    default:
      return '→'
  }
})

function animateValue(start: number, end: number, duration: number) {
  const startTime = performance.now()
  
  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    
    currentValue.value = start + (end - start) * easeOutQuart
    
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      currentValue.value = end
    }
  }
  
  requestAnimationFrame(update)
}

onMounted(() => {
  if (props.animated) {
    animateValue(0, props.value, props.animationDuration)
  } else {
    currentValue.value = props.value
  }
})

watch(() => props.value, (newVal, oldVal) => {
  if (props.animated && oldVal !== undefined) {
    animateValue(oldVal, newVal, props.animationDuration)
  } else {
    currentValue.value = newVal
  }
})
</script>

<template>
  <div 
    class="trend-number-card flex h-full w-full flex-col justify-center p-4 transition-all duration-300 hover:shadow-lg"
    :class="[backgroundColor]"
    :style="{ borderRadius: `${borderRadius}px` }"
  >
    <div class="flex items-start justify-between">
      <div class="text-sm font-medium text-text-secondary">
        {{ title }}
      </div>
    </div>
    
    <div class="mt-2 flex items-baseline gap-1">
      <span v-if="prefix" class="text-lg text-text-primary">{{ prefix }}</span>
      <span 
        class="text-4xl font-bold text-text-primary tabular-nums"
      >
        {{ formattedValue }}
      </span>
      <span v-if="suffix" class="text-lg text-text-primary">{{ suffix }}</span>
    </div>
    
    <div 
      class="mt-3 flex items-center gap-1 text-sm font-medium"
      :class="[trendColorClass]"
    >
      <span v-if="showTrendIcon" class="text-base">{{ trendIcon }}</span>
      <span>{{ formattedTrendValue }}</span>
    </div>
  </div>
</template>
