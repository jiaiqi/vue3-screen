<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  title?: string
  value?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '仪表盘',
  value: 75,
  max: 100,
})

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const option = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    textStyle: { color: '#f0f6fc' },
  },
  series: [
    {
      type: 'gauge',
      min: 0,
      max: props.max,
      progress: { show: true, width: 18 },
      axisLine: { lineStyle: { width: 18, color: [[1, '#30363d']] } },
      axisTick: { show: false },
      splitLine: { length: 15, lineStyle: { width: 2, color: '#30363d' } },
      axisLabel: { distance: 25, color: '#8b949e', fontSize: 12 },
      anchor: { show: true, showAbove: true, size: 25, itemStyle: { borderWidth: 10 } },
      title: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 28,
        color: '#f0f6fc',
        offsetCenter: [0, '70%'],
        formatter: '{value}%',
      },
      data: [{ value: props.value, itemStyle: { color: '#0073ff' } }],
    },
  ],
  backgroundColor: 'transparent',
}))

onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    chart.setOption(option.value)
  }
})

watch(option, (newOption) => {
  chart?.setOption(newOption)
}, { deep: true })
</script>

<template>
  <div ref="chartRef" class="h-full w-full" />
</template>
