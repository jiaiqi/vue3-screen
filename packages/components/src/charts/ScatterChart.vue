<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { ScatterData, ChartTheme } from '../charts/types'
import { useChartTheme, createAxisConfig } from './useChart'

interface Props {
  title?: string
  showLegend?: boolean
  showTooltip?: boolean
  showLine?: boolean
  data?: ScatterData[]
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}

const props = withDefaults(defineProps<Props>(), {
  title: '散点图',
  showLegend: true,
  showTooltip: true,
  showLine: false,
  data: () => ([
    { 
      name: '系列 1', 
      data: [
        [10.0, 8.04], [8.0, 6.95], [13.0, 7.58], [9.0, 8.81], [11.0, 8.33],
        [14.0, 9.96], [6.0, 7.24], [4.0, 4.26], [12.0, 10.84], [7.0, 4.82], [5.0, 5.68]
      ] 
    },
    { 
      name: '系列 2', 
      data: [
        [10.0, 9.14], [8.0, 8.14], [13.0, 8.74], [9.0, 8.77], [11.0, 9.26],
        [14.0, 8.10], [6.0, 6.13], [4.0, 3.10], [12.0, 9.13], [7.0, 7.26], [5.0, 4.74]
      ] 
    },
  ]),
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
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.seriesName}<br/>(${params.value[0]}, ${params.value[1]})`
      }
    } : undefined,
    legend: props.showLegend ? { 
      textStyle: { color: theme.value.textColor },
      data: props.data.map(s => s.name)
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      ...axisConfig.xAxis,
      type: 'value',
      name: 'X 轴',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      ...axisConfig.yAxis,
      type: 'value',
      name: 'Y 轴',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: props.data.map((series, index) => ({
      name: series.name,
      type: 'scatter',
      data: series.data,
      symbolSize: 12,
      itemStyle: {
        color: getThemeColor(index),
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      markLine: props.showLine ? {
        symbol: ['none', 'none'],
        label: { show: false },
        lineStyle: {
          type: 'dashed',
          color: getThemeColor(index),
        },
        data: [{
          type: 'average',
          name: '平均值'
        }]
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
