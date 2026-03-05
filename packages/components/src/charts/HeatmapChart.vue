<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { HeatmapData, ChartTheme } from '../charts/types'
import { useChartTheme } from './useChart'

interface Props {
  title?: string
  showTooltip?: boolean
  showLabel?: boolean
  data?: HeatmapData
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}

const props = withDefaults(defineProps<Props>(), {
  title: '热力图',
  showTooltip: true,
  showLabel: true,
  data: () => ({
    name: '热力数据',
    coords: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    data: [
      [0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0],
      [1, 0, 3], [1, 1, 5], [1, 2, 8], [1, 3, 2], [1, 4, 1], [1, 5, 0], [1, 6, 0],
      [2, 0, 2], [2, 1, 3], [2, 2, 6], [2, 3, 8], [2, 4, 5], [2, 5, 2], [2, 6, 1],
      [3, 0, 1], [3, 1, 2], [3, 2, 4], [3, 3, 7], [3, 4, 8], [3, 5, 6], [3, 6, 3],
      [4, 0, 0], [4, 1, 1], [4, 2, 3], [4, 3, 5], [4, 4, 7], [4, 5, 8], [4, 6, 5],
      [5, 0, 0], [5, 1, 0], [5, 2, 2], [5, 3, 3], [5, 4, 5], [5, 5, 7], [5, 6, 6],
      [6, 0, 0], [6, 1, 0], [6, 2, 1], [6, 3, 2], [6, 4, 3], [6, 5, 5], [6, 6, 4],
    ],
  }),
})

const { theme } = useChartTheme(props.theme)

const hours = props.data.coords || ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p']
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    textStyle: { color: theme.value.textColor },
  },
  tooltip: props.showTooltip ? { 
    position: 'top',
    formatter: (params: any) => {
      const dayIndex = Math.floor(params.value[0])
      const hourIndex = Math.floor(params.value[1])
      const value = params.value[2]
      return `${days[dayIndex] || hours[dayIndex]}: ${value}`
    }
  } : undefined,
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: hours.slice(0, Math.max(...props.data.data.map(d => d[1])) + 1),
    splitArea: {
      show: true,
      areaStyle: {
        color: theme.value.splitLineColor === '#30363d' 
          ? ['rgba(48, 54, 61, 0.3)', 'rgba(48, 54, 61, 0.5)'].reverse()
          : ['rgba(240, 246, 252, 0.1)', 'rgba(240, 246, 252, 0.2)'].reverse()
      }
    },
    axisLine: { lineStyle: { color: theme.value.axisColor } },
    axisLabel: { color: theme.value.textColor },
  },
  yAxis: {
    type: 'category',
    data: days.slice(0, Math.max(...props.data.data.map(d => d[0])) + 1),
    splitArea: {
      show: true,
      areaStyle: {
        color: theme.value.splitLineColor === '#30363d' 
          ? ['rgba(48, 54, 61, 0.3)', 'rgba(48, 54, 61, 0.5)'].reverse()
          : ['rgba(240, 246, 252, 0.1)', 'rgba(240, 246, 252, 0.2)'].reverse()
      }
    },
    axisLine: { lineStyle: { color: theme.value.axisColor } },
    axisLabel: { color: theme.value.textColor },
  },
  visualMap: {
    min: 0,
    max: Math.max(...props.data.data.map(d => d[2])),
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '0%',
    inRange: {
      color: ['#0d1117', '#0073ff', '#00c853', '#ffab00'],
    },
    textStyle: {
      color: theme.value.textColor,
    },
  },
  series: [
    {
      type: 'heatmap',
      data: props.data.data,
      label: props.showLabel ? {
        show: true,
        color: theme.value.textColor,
        fontSize: 11,
      } : undefined,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
    },
  ],
  backgroundColor: theme.value.backgroundColor,
  ...props.option,
}))
</script>

<template>
  <VChart 
    :option="chartOption" 
    autoresize
    class="h-full w-full"
  />
</template>
