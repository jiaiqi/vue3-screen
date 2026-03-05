<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { PieData, ChartTheme } from '../charts/types'
import { useChartTheme } from './useChart'

interface Props {
  title?: string
  showLegend?: boolean
  showTooltip?: boolean
  sort?: 'ascending' | 'descending' | 'none'
  data?: PieData[]
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}

const props = withDefaults(defineProps<Props>(), {
  title: '漏斗图',
  showLegend: true,
  showTooltip: true,
  sort: 'descending',
  data: () => [
    { name: '访问', value: 100 },
    { name: '咨询', value: 80 },
    { name: '订单', value: 60 },
    { name: '点击', value: 40 },
    { name: '支付', value: 20 },
  ],
})

const { theme, getThemeColor } = useChartTheme(props.theme)

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    textStyle: { color: theme.value.textColor },
  },
  tooltip: props.showTooltip ? { 
    trigger: 'item',
    formatter: '{b}: {c}%'
  } : undefined,
  legend: props.showLegend ? { 
    textStyle: { color: theme.value.textColor },
    data: props.data.map(d => d.name)
  } : undefined,
  series: [
    {
      type: 'funnel',
      left: '10%',
      top: '10%',
      bottom: '10%',
      width: '80%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: props.sort !== 'none' ? props.sort : undefined,
      gap: 2,
      label: {
        show: true,
        position: 'inside',
        color: '#fff',
        fontSize: 14,
        formatter: '{b}: {c}%',
      },
      itemStyle: {
        borderColor: theme.value.backgroundColor === 'transparent' ? '#0d1117' : '#fff',
        borderWidth: 2,
      },
      emphasis: {
        label: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      data: props.data.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: item.itemStyle?.color || getThemeColor(index),
        },
      })),
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
