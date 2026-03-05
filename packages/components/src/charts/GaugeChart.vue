<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { ChartTheme } from '../charts/types'
import { useChartTheme } from './useChart'

interface Props {
  title?: string
  value?: number
  max?: number
  min?: number
  showDetail?: boolean
  unit?: string
  data?: { value: number; name?: string }[]
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}

const props = withDefaults(defineProps<Props>(), {
  title: '仪表盘',
  value: 75,
  max: 100,
  min: 0,
  showDetail: true,
  unit: '',
  data: () => [{ value: 75 }],
})

const { theme, getThemeColor } = useChartTheme(props.theme)

const currentValue = computed(() => {
  return props.data && props.data.length > 0 ? props.data[0].value : props.value
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    textStyle: { color: theme.value.textColor },
    left: 'center',
    top: '85%',
  },
  series: [
    {
      type: 'gauge',
      min: props.min,
      max: props.max,
      startAngle: 200,
      endAngle: -20,
      radius: '90%',
      center: ['50%', '55%'],
      progress: { 
        show: true, 
        width: 18,
        itemStyle: {
          color: getThemeColor(0)
        }
      },
      axisLine: { 
        lineStyle: { 
          width: 18, 
          color: [[1, `${theme.value.axisColor}40`]] 
        } 
      },
      axisTick: { 
        show: true,
        length: 10,
        lineStyle: {
          color: theme.value.textColor,
          width: 2
        }
      },
      splitLine: { 
        length: 20, 
        lineStyle: { 
          width: 3, 
          color: theme.value.splitLineColor 
        } 
      },
      axisLabel: { 
        distance: 30, 
        color: theme.value.textColor, 
        fontSize: 12,
        formatter: '{value}'
      },
      anchor: { 
        show: true, 
        showAbove: true, 
        size: 25, 
        itemStyle: { 
          borderWidth: 10,
          color: getThemeColor(0)
        } 
      },
      title: { 
        show: false 
      },
      detail: props.showDetail ? {
        valueAnimation: true,
        fontSize: 30,
        fontWeight: 'bold',
        color: getThemeColor(0),
        offsetCenter: [0, '35%'],
        formatter: `{value}${props.unit}`,
      } : undefined,
      data: [{ 
        value: currentValue.value,
        name: props.data[0]?.name || ''
      }],
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
