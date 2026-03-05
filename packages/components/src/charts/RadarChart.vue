<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { ChartData, ChartTheme } from '../charts/types'
import { useChartTheme } from './useChart'

interface Props {
  title?: string
  showLegend?: boolean
  showTooltip?: boolean
  shape?: 'circle' | 'polygon'
  data?: ChartData
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}

const props = withDefaults(defineProps<Props>(), {
  title: '雷达图',
  showLegend: true,
  showTooltip: true,
  shape: 'circle',
  data: () => ({
    categories: ['销售', '管理', '信息技术', '客服', '研发', '市场'],
    series: [
      { name: '预算分配', data: [4200, 3000, 20000, 3500, 5000, 1800] },
      { name: '实际开销', data: [5000, 14000, 28000, 2600, 4200, 2100] },
    ],
  }),
})

const { theme, getThemeColor } = useChartTheme(props.theme)

const chartOption = computed<EChartsOption>(() => {
  const indicator = props.data.categories?.map(cat => ({
    name: cat,
    max: Math.max(...props.data.series.map(s => Math.max(...s.data))) * 1.2,
  })) || []
  
  return {
    title: {
      text: props.title,
      textStyle: { color: theme.value.textColor },
    },
    tooltip: props.showTooltip ? { 
      trigger: 'item'
    } : undefined,
    legend: props.showLegend ? { 
      textStyle: { color: theme.value.textColor },
      data: props.data.series.map(s => s.name)
    } : undefined,
    radar: {
      indicator,
      shape: props.shape,
      splitNumber: 5,
      axisName: {
        color: theme.value.textColor,
        fontSize: 13,
      },
      splitLine: {
        lineStyle: {
          color: theme.value.splitLineColor,
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: [
            `${theme.value.splitLineColor}10`,
            `${theme.value.splitLineColor}20`,
            `${theme.value.splitLineColor}30`,
            `${theme.value.splitLineColor}40`,
          ].reverse(),
        },
      },
      axisLine: {
        lineStyle: {
          color: theme.value.axisColor,
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: props.data.series.map((series, index) => ({
          name: series.name,
          value: series.data,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: getThemeColor(index),
          },
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            color: `${getThemeColor(index)}40`,
          },
        })),
      },
    ],
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
