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
  stacked?: boolean
  data?: ChartData
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}

const props = withDefaults(defineProps<Props>(), {
  title: '柱状图',
  showLegend: true,
  showTooltip: true,
  showLabel: false,
  stacked: false,
  data: () => ({
    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    series: [
      { name: '销量', data: [120, 200, 150, 80, 70, 110, 130] },
      { name: '订单', data: [80, 120, 100, 60, 50, 90, 100] },
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
      containLabel: true
    },
    xAxis: {
      ...axisConfig.xAxis,
      type: 'category',
      data: props.data.categories,
    },
    yAxis: {
      ...axisConfig.yAxis,
      type: 'value',
    },
    series: props.data.series.map((series, index) => ({
      name: series.name,
      type: 'bar',
      stack: props.stacked ? 'total' : undefined,
      data: series.data,
      barMaxWidth: 50,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: getThemeColor(index) },
            { offset: 1, color: `${getThemeColor(index)}80` }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      },
      label: props.showLabel ? {
        show: true,
        position: 'top',
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
