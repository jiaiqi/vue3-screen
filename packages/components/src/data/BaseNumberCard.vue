<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

interface Props {
  title?: string
  value?: number
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  animated?: boolean
  animationDuration?: number
  titleColor?: string
  valueColor?: string
  backgroundColor?: string
  borderRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '基础数据',
  value: 0,
  prefix: '',
  suffix: '',
  decimalPlaces: 0,
  animated: true,
  animationDuration: 1000,
  titleColor: 'text-text-secondary',
  valueColor: 'text-text-primary',
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
    class="base-number-card flex h-full w-full flex-col justify-center p-4 transition-all duration-300 hover:shadow-lg"
    :class="[backgroundColor]"
    :style="{ borderRadius: `${borderRadius}px` }"
  >
    <div 
      class="text-sm font-medium"
      :class="[titleColor]"
    >
      {{ title }}
    </div>
    <div class="mt-2 flex items-baseline gap-1">
      <span v-if="prefix" class="text-lg" :class="[valueColor]">{{ prefix }}</span>
      <span 
        class="text-4xl font-bold tabular-nums"
        :class="[valueColor]"
      >
        {{ formattedValue }}
      </span>
      <span v-if="suffix" class="text-lg" :class="[valueColor]">{{ suffix }}</span>
    </div>
  </div>
</template>
