import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ChartTheme } from './types'
import { defaultChartTheme } from './types'

export function useChartTheme(customTheme?: Partial<ChartTheme>) {
  const theme = computed<ChartTheme>(() => ({
    ...defaultChartTheme,
    ...customTheme,
  }))

  const baseOption = computed<Partial<EChartsOption>>(() => ({
    backgroundColor: theme.value.backgroundColor,
    textStyle: {
      color: theme.value.textColor,
    },
  }))

  return {
    theme,
    baseOption,
    getThemeColor: (index: number) => {
      const colors = theme.value.colors!
      return colors[index % colors.length]
    },
  }
}

export function createAxisConfig(theme: ChartTheme) {
  return {
    xAxis: {
      axisLine: { lineStyle: { color: theme.axisColor } },
      axisLabel: { color: theme.textColor },
    },
    yAxis: {
      axisLine: { lineStyle: { color: theme.axisColor } },
      axisLabel: { color: theme.textColor },
      splitLine: { lineStyle: { color: theme.splitLineColor } },
    },
  }
}
