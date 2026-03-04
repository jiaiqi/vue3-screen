<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  title?: string
  showLegend?: boolean
  showTooltip?: boolean
  data?: { categories: string[]; series: { name: string; data: number[] }[] }
}

const props = withDefaults(defineProps<Props>(), {
  title: '柱状图',
  showLegend: true,
  showTooltip: true,
  data: () => ({
    categories: ['周一', '周二', '周三', '周四', '周五'],
    series: [{ name: '销量', data: [120, 200, 150, 80, 70] }],
  }),
})

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const option = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    textStyle: { color: '#f0f6fc' },
  },
  tooltip: props.showTooltip ? { trigger: 'axis' } : undefined,
  legend: props.showLegend ? { textStyle: { color: '#8b949e' } } : undefined,
  xAxis: {
    type: 'category',
    data: props.data.categories,
    axisLine: { lineStyle: { color: '#30363d' } },
    axisLabel: { color: '#8b949e' },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#30363d' } },
    axisLabel: { color: '#8b949e' },
    splitLine: { lineStyle: { color: '#30363d' } },
  },
  series: props.data.series.map(s => ({
    name: s.name,
    type: 'bar',
    data: s.data,
    itemStyle: { color: '#0073ff' },
  })),
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
