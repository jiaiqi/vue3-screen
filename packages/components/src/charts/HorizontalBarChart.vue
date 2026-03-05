<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { ChartData, ChartTheme } from '../charts/types'
import { useChartTheme, createAxisConfig } from './useChart'

interface Props {
  title?: string
  showLegend?: boolean
  showTooltip?: boolean
  showLabel?: boolean
  data?: ChartData
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}

const props = withDefaults(defineProps<Props>(), {
  title: '条形图',
  showLegend: true,
  showTooltip: true,
  showLabel: true,
  data: () => ({
    categories: ['产品 A', '产品 B', '产品 C', '产品 D', '产品 E'],
    series: [
      { name: '销量', data: [320, 280, 250, 180, 150] },
    ],
  }),
})

const { theme, getThemeColor } = useChartTheme(props.theme)

const chartOption = computed<EChartsOption>(() => {
  const axisConfig = createAxisConfig(theme.value)
  
  return {
    title: {
      text: props.title,
      textStyle: { color: theme.value.textColor },
    },
    tooltip: props.showTooltip ? { 
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    } : undefined,
    legend: props.showLegend ? { 
      textStyle: { color: theme.value.textColor },
      data: props.data.series.map(s => s.name)
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      ...axisConfig.xAxis,
      type: 'value',
    },
    yAxis: {
      ...axisConfig.yAxis,
      type: 'category',
      data: props.data.categories,
    },
    series: props.data.series.map((series, index) => ({
      name: series.name,
      type: 'bar',
      data: series.data,
      barWidth: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: getThemeColor(index) },
            { offset: 1, color: `${getThemeColor(index)}80` }
          ]
        },
        borderRadius: [0, 4, 4, 0]
      },
      label: props.showLabel ? {
        show: true,
        position: 'right',
        color: theme.value.textColor,
        formatter: '{c}'
      } : undefined,
    })),
    backgroundColor: theme.value.backgroundColor,
    ...props.option,
  }
})
</script>

<template>
  <VChart 
    :option="chartOption" 
    autoresize
    class="h-full w-full"
  />
</template>
