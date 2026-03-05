import type { EChartsOption } from 'echarts'

export interface ChartData {
  categories?: string[]
  series: SeriesData[]
}

export interface SeriesData {
  name: string
  data: any[]
}

export interface PieData {
  name: string
  value: number
  itemStyle?: {
    color?: string
  }
}

export interface GaugeData {
  value: number
  name?: string
}

export interface ScatterData {
  name: string
  data: [number, number][]
}

export interface HeatmapData {
  name: string
  data: [number, number, number][]
  coords?: string[]
}

export interface CandlestickData {
  name: string
  data: [number, number, number, number][]
}

export interface ChartTheme {
  backgroundColor?: string
  textColor?: string
  axisColor?: string
  splitLineColor?: string
  colors?: string[]
}

export const defaultChartTheme: ChartTheme = {
  backgroundColor: 'transparent',
  textColor: '#f0f6fc',
  axisColor: '#30363d',
  splitLineColor: '#30363d',
  colors: ['#0073ff', '#00c853', '#ffab00', '#ff3d00', '#aa00ff', '#00bcd4'],
}

export interface BaseChartProps {
  title?: string
  showLegend?: boolean
  showTooltip?: boolean
  theme?: ChartTheme
  option?: Partial<EChartsOption>
}
