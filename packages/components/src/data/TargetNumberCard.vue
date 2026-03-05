<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

interface Props {
  title?: string
  value?: number
  target?: number
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  showTargetValue?: boolean
  targetLabel?: string
  animated?: boolean
  animationDuration?: number
  progressColor?: string
  backgroundColor?: string
  borderRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '目标数据',
  value: 0,
  target: 100,
  prefix: '',
  suffix: '',
  decimalPlaces: 0,
  showTargetValue: true,
  targetLabel: '目标值',
  animated: true,
  animationDuration: 1000,
  progressColor: '#0073ff',
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

const formattedTargetValue = computed(() => {
  return props.target.toLocaleString('zh-CN', {
    minimumFractionDigits: props.decimalPlaces,
    maximumFractionDigits: props.decimalPlaces,
  })
})

const progressPercentage = computed(() => {
  if (props.target <= 0) return 0
  return Math.min(100, Math.max(0, (props.value / props.target) * 100))
})

const progressColorStyle = computed(() => {
  const ratio = progressPercentage.value / 100
  if (ratio >= 1) {
    return 'bg-success'
  } else if (ratio >= 0.8) {
    return 'bg-warning'
  } else {
    return 'bg-info'
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
    class="target-number-card flex h-full w-full flex-col justify-center p-4 transition-all duration-300 hover:shadow-lg"
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
    
    <div class="mt-3 space-y-2">
      <div class="flex justify-between text-xs text-text-secondary">
        <span>达成率: {{ progressPercentage.toFixed(1) }}%</span>
        <span v-if="showTargetValue">{{ targetLabel }}: {{ formattedTargetValue }}</span>
      </div>
      
      <div class="h-2 w-full overflow-hidden rounded-full bg-surface-overlay">
        <div 
          class="h-full rounded-full transition-all duration-1000 ease-out"
          :class="[progressColorStyle]"
          :style="{ width: `${progressPercentage}%` }"
        />
      </div>
    </div>
  </div>
</template>