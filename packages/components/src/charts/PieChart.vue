<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  title?: string
  showLegend?: boolean
  data?: { name: string; value: number }[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '饼图',
  showLegend: true,
  data: () => [
    { name: '直接访问', value: 335 },
    { name: '邮件营销', value: 310 },
    { name: '联盟广告', value: 234 },
    { name: '视频广告', value: 135 },
    { name: '搜索引擎', value: 1548 },
  ],
})

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const option = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    textStyle: { color: '#f0f6fc' },
  },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: props.showLegend ? { textStyle: { color: '#8b949e' } } : undefined,
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      data: props.data,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#0d1117',
        borderWidth: 2,
      },
      label: { color: '#8b949e' },
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
