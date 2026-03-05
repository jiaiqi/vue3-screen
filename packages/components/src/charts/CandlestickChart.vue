<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { CandlestickData, ChartTheme } from '../charts/types'
import { useChartTheme } from './useChart'

interface Props {
  title?: string
  showTooltip?: boolean
  showVolume?: boolean
  data?: {
    dates: string[]
    values: [number, number, number, number][]
    volumes?: number[]
  }
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}

const props = withDefaults(defineProps<Props>(), {
  title: 'K 线图',
  showTooltip: true,
  showVolume: true,
  data: () => ({
    dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', 
            '2024-01-08', '2024-01-09', '2024-01-10', '2024-01-11', '2024-01-12'],
    values: [
      [2320.26, 2320.26, 2287.3, 2362.94],
      [2300.02, 2291.3, 2288.26, 2308.38],
      [2295.35, 2346.5, 2295.35, 2346.92],
      [2347.22, 2358.98, 2337.35, 2363.8],
      [2360.75, 2382.48, 2347.89, 2383.76],
      [2383.43, 2385.42, 2371.23, 2391.82],
      [2377.41, 2419.02, 2369.57, 2421.15],
      [2425.92, 2428.15, 2417.58, 2440.38],
      [2411.0, 2433.13, 2403.3, 2437.42],
      [2432.68, 2334.48, 2427.82, 2441.73],
    ],
    volumes: [1000, 1200, 800, 1500, 1100, 900, 1300, 1600, 1400, 1200],
  }),
})

const { theme } = useChartTheme(props.theme)

const calculateMA = (dayCount: number, data: any[]) => {
  const ma = []
  for (let i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      ma.push('-')
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += data[i - j][1]
    }
    ma.push(+(sum / dayCount).toFixed(2))
  }
  return ma
}

const chartOption = computed<EChartsOption>(() => {
  const upColor = '#00c853'
  const downColor = '#ff3d00'
  
  return {
    title: {
      text: props.title,
      textStyle: { color: theme.value.textColor },
    },
    tooltip: props.showTooltip ? { 
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    } : undefined,
    grid: [
      {
        left: '3%',
        right: '4%',
        height: props.showVolume ? '60%' : '80%',
        containLabel: true
      },
      props.showVolume ? {
        left: '3%',
        right: '4%',
        top: '65%',
        height: '15%',
        containLabel: true
      } : {} as any
    ],
    xAxis: [
      {
        type: 'category',
        data: props.data.dates,
        axisLine: { lineStyle: { color: theme.value.axisColor } },
        axisLabel: { color: theme.value.textColor },
      },
      ...(props.showVolume ? [{
        type: 'category',
        gridIndex: 1,
        data: props.data.dates,
        axisLabel: { show: false }
      }] : [])
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        axisLine: { lineStyle: { color: theme.value.axisColor } },
        axisLabel: { color: theme.value.textColor },
        splitLine: { lineStyle: { color: theme.value.splitLineColor } },
      },
      ...(props.showVolume ? [{
        type: 'value',
        gridIndex: 1,
        axisLabel: { show: false },
        splitLine: { show: false }
      }] : [])
    ],
    series: [
      {
        name: '日 K',
        type: 'candlestick',
        data: props.data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upColor,
          borderColor0: downColor,
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            {
              yAxis: calculateMA(5, props.data.values).filter((v: any) => v !== '-').pop(),
              name: 'MA5'
            }
          ]
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, props.data.values),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, props.data.values),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      ...(props.showVolume && props.data.volumes ? [{
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: props.data.volumes.map((vol, i) => {
          const isOpenUp = props.data.values[i][1] >= props.data.values[i][0]
          return {
            value: vol,
            itemStyle: {
              color: isOpenUp ? upColor : downColor
            }
          }
        }),
      }] : [])
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
