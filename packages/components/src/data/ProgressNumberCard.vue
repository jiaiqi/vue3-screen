<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

interface Props {
  title?: string
  value?: number
  total?: number
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  showTotal?: boolean
  totalLabel?: string
  animated?: boolean
  animationDuration?: number
  showCircularProgress?: boolean
  circularSize?: number
  strokeWidth?: number
  progressColors?: {
    low: string
    medium: string
    high: string
  }
  backgroundColor?: string
  borderRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '完成率',
  value: 0,
  total: 100,
  prefix: '',
  suffix: '%',
  decimalPlaces: 1,
  showTotal: true,
  totalLabel: '总数',
  animated: true,
  animationDuration: 1000,
  showCircularProgress: false,
  circularSize: 120,
  strokeWidth: 8,
  progressColors: () => ({
    low: '#ef4444',
    medium: '#f59e0b',
    high: '#10b981',
  }),
  backgroundColor: 'bg-surface-elevated',
  borderRadius: 8,
})

const displayValue = ref(0)
const currentValue = ref(0)

const percentage = computed(() => {
  if (props.total <= 0) return 0
  return Math.min(100, Math.max(0, (props.value / props.total) * 100))
})

const formattedPercentage = computed(() => {
  return currentValue.value.toFixed(props.decimalPlaces)
})

const progressColor = computed(() => {
  const ratio = percentage.value / 100
  if (ratio >= 0.8) {
    return props.progressColors?.high
  } else if (ratio >= 0.5) {
    return props.progressColors?.medium
  } else {
    return props.progressColors?.low
  }
})

const circumference = computed(() => {
  const radius = (props.circularSize - props.strokeWidth) / 2
  return 2 * Math.PI * radius
})

const strokeDashoffset = computed(() => {
  return circumference.value * (1 - percentage.value / 100)
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
    animateValue(0, percentage.value, props.animationDuration)
  } else {
    currentValue.value = percentage.value
  }
})

watch(() => props.value, (newVal, oldVal) => {
  if (oldVal === undefined) return
  
  const newPercentage = (newVal / props.total) * 100
  const oldPercentage = (oldVal / props.total) * 100
  
  if (props.animated) {
    animateValue(oldPercentage, newPercentage, props.animationDuration)
  } else {
    currentValue.value = newPercentage
  }
})
</script>

<template>
  <div 
    class="progress-number-card flex h-full w-full flex-col justify-center p-4 transition-all duration-300 hover:shadow-lg"
    :class="[backgroundColor]"
    :style="{ borderRadius: `${borderRadius}px` }"
  >
    <div class="flex items-start justify-between">
      <div class="text-sm font-medium text-text-secondary">
        {{ title }}
      </div>
    </div>
    
    <div v-if="showCircularProgress" class="mt-3 flex items-center justify-center">
      <div 
        class="relative"
        :style="{ width: `${circularSize}px`, height: `${circularSize}px` }"
      >
        <svg
          class="h-full w-full -rotate-90 transform"
          :viewBox="`0 0 ${circularSize} ${circularSize}`"
        >
          <circle
            class="text-surface-overlay"
            :stroke-width="strokeWidth"
            stroke="currentColor"
            fill="none"
            :cx="circularSize / 2"
            :cy="circularSize / 2"
            :r="(circularSize - strokeWidth) / 2"
          />
          <circle
            class="transition-all duration-1000 ease-out"
            :stroke-width="strokeWidth"
            stroke-dasharray: circumference
            :stroke-dashoffset="strokeDashoffset"
            :stroke="progressColor"
            stroke-linecap="round"
            fill="none"
            :cx="circularSize / 2"
            :cy="circularSize / 2"
            :r="(circularSize - strokeWidth) / 2"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <span 
              class="text-3xl font-bold tabular-nums"
              :style="{ color: progressColor }"
            >
              {{ formattedPercentage }}
            </span>
            <span 
              class="text-sm"
              :style="{ color: progressColor }"
            >
              {{ suffix }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-2 flex items-baseline gap-1">
      <span v-if="prefix" class="text-lg" :style="{ color: progressColor }">{{ prefix }}</span>
      <span 
        class="text-4xl font-bold tabular-nums"
        :style="{ color: progressColor }"
      >
        {{ formattedPercentage }}
      </span>
      <span class="text-lg" :style="{ color: progressColor }">{{ suffix }}</span>
    </div>
    
    <div v-if="showTotal" class="mt-3 flex justify-between text-xs text-text-secondary">
      <span>已完成：{{ value.toLocaleString() }}</span>
      <span>{{ totalLabel }}: {{ total.toLocaleString() }}</span>
    </div>
    
    <div v-if="!showCircularProgress" class="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-overlay">
      <div 
        class="h-full rounded-full transition-all duration-1000 ease-out"
        :style="{ width: `${percentage}%`, backgroundColor: progressColor }"
      />
    </div>
  </div>
</template>