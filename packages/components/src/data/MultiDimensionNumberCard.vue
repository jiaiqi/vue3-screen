<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

interface DimensionItem {
  label: string
  value: number
  prefix?: string
  suffix?: string
  color?: string
}

interface Props {
  title?: string
  mainValue?: number
  mainPrefix?: string
  mainSuffix?: string
  decimalPlaces?: number
  dimensions?: DimensionItem[]
  animated?: boolean
  animationDuration?: number
  showBarChart?: boolean
  dimensionColors?: string[]
  backgroundColor?: string
  borderRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '多维度数据',
  mainValue: 0,
  mainPrefix: '',
  mainSuffix: '',
  decimalPlaces: 0,
  dimensions: () => [
    { label: '维度 A', value: 100, suffix: '个' },
    { label: '维度 B', value: 200, suffix: '个' },
    { label: '维度 C', value: 150, suffix: '个' },
  ],
  animated: true,
  animationDuration: 1000,
  showBarChart: true,
  dimensionColors: () => [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
  ],
  backgroundColor: 'bg-surface-elevated',
  borderRadius: 8,
})

const displayValue = ref(0)
const currentMainValue = ref(0)
const currentDimensionValues = ref<number[]>([])

const formattedMainValue = computed(() => {
  return currentMainValue.value.toLocaleString('zh-CN', {
    minimumFractionDigits: props.decimalPlaces,
    maximumFractionDigits: props.decimalPlaces,
  })
})

const maxDimensionValue = computed(() => {
  if (props.dimensions.length === 0) return 0
  return Math.max(...props.dimensions.map(d => d.value))
})

function getColor(index: number): string {
  return props.dimensionColors?.[index % props.dimensionColors.length] || '#3b82f6'
}

function animateValue(start: number, end: number, duration: number) {
  const startTime = performance.now()
  
  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    
    currentMainValue.value = start + (end - start) * easeOutQuart
    
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      currentMainValue.value = end
    }
  }
  
  requestAnimationFrame(update)
}

function animateDimensionValues() {
  if (!props.animated) {
    currentDimensionValues.value = props.dimensions.map(d => d.value)
    return
  }
  
  const startTime = performance.now()
  
  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.animationDuration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    
    currentDimensionValues.value = props.dimensions.map(d => d.value * easeOutQuart)
    
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      currentDimensionValues.value = props.dimensions.map(d => d.value)
    }
  }
  
  requestAnimationFrame(update)
}

onMounted(() => {
  if (props.animated) {
    animateValue(0, props.mainValue, props.animationDuration)
    animateDimensionValues()
  } else {
    currentMainValue.value = props.mainValue
    currentDimensionValues.value = props.dimensions.map(d => d.value)
  }
})

watch(() => props.mainValue, (newVal, oldVal) => {
  if (props.animated && oldVal !== undefined) {
    animateValue(oldVal, newVal, props.animationDuration)
  } else {
    currentMainValue.value = newVal
  }
})

watch(() => props.dimensions, () => {
  animateDimensionValues()
}, { deep: true })
</script>

<template>
  <div 
    class="multi-dimension-number-card flex h-full w-full flex-col p-4 transition-all duration-300 hover:shadow-lg"
    :class="[backgroundColor]"
    :style="{ borderRadius: `${borderRadius}px` }"
  >
    <div class="text-sm font-medium text-text-secondary">
      {{ title }}
    </div>
    
    <div class="mt-2 flex items-baseline gap-1">
      <span v-if="mainPrefix" class="text-lg text-text-primary">{{ mainPrefix }}</span>
      <span 
        class="text-4xl font-bold text-text-primary tabular-nums"
      >
        {{ formattedMainValue }}
      </span>
      <span v-if="mainSuffix" class="text-lg text-text-primary">{{ mainSuffix }}</span>
    </div>
    
    <div v-if="showBarChart && dimensions.length > 0" class="mt-4 flex-1 space-y-3">
      <div 
        v-for="(dimension, index) in dimensions" 
        :key="dimension.label"
        class="flex items-center gap-3"
      >
        <div class="w-16 shrink-0 text-xs text-text-secondary">
          {{ dimension.label }}
        </div>
        
        <div class="flex-1 overflow-hidden rounded-full bg-surface-overlay">
          <div 
            class="h-2 rounded-full transition-all duration-1000 ease-out"
            :style="{ 
              width: `${(currentDimensionValues[index] / maxDimensionValue) * 100}%`,
              backgroundColor: getColor(index)
            }"
          />
        </div>
        
        <div class="w-20 shrink-0 text-right text-xs font-medium tabular-nums" :style="{ color: getColor(index) }">
          <span v-if="dimension.prefix">{{ dimension.prefix }}</span>
          <span>{{ currentDimensionValues[index].toLocaleString() }}</span>
          <span v-if="dimension.suffix">{{ dimension.suffix }}</span>
        </div>
      </div>
    </div>
    
    <div v-else-if="dimensions.length > 0" class="mt-4 grid grid-cols-2 gap-3">
      <div 
        v-for="(dimension, index) in dimensions" 
        :key="dimension.label"
        class="flex flex-col items-center justify-center rounded-lg bg-surface-overlay/50 p-2"
      >
        <div class="text-xs text-text-secondary">
          {{ dimension.label }}
        </div>
        <div class="mt-1 text-lg font-bold tabular-nums" :style="{ color: getColor(index) }">
          <span v-if="dimension.prefix">{{ dimension.prefix }}</span>
          <span>{{ dimension.value.toLocaleString() }}</span>
          <span v-if="dimension.suffix">{{ dimension.suffix }}</span>
        </div>
      </div>
    </div>
  </div>
</template>