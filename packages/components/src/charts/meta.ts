import type { ComponentMeta } from '../types'

export const barChartMeta: ComponentMeta = {
  type: 'chart-bar',
  name: '柱状图',
  category: 'chart',
  icon: 'i-carbon-chart-bar',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    title: '柱状图',
    showLegend: true,
    showTooltip: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
    },
  },
  resizable: true,
}

export const lineChartMeta: ComponentMeta = {
  type: 'chart-line',
  name: '折线图',
  category: 'chart',
  icon: 'i-carbon-chart-line',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    title: '折线图',
    showLegend: true,
    smooth: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      smooth: { type: 'boolean', title: '平滑曲线', default: true },
    },
  },
  resizable: true,
}

export const pieChartMeta: ComponentMeta = {
  type: 'chart-pie',
  name: '饼图',
  category: 'chart',
  icon: 'i-carbon-chart-pie',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    title: '饼图',
    showLegend: true,
    radius: ['40%', '70%'],
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
    },
  },
  resizable: true,
}

export const gaugeChartMeta: ComponentMeta = {
  type: 'chart-gauge',
  name: '仪表盘',
  category: 'chart',
  icon: 'i-carbon-dashboard',
  defaultSize: { w: 300, h: 300 },
  defaultProps: {
    title: '仪表盘',
    value: 75,
    max: 100,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      value: { type: 'number', title: '当前值', default: 75 },
      max: { type: 'number', title: '最大值', default: 100 },
    },
  },
  resizable: true,
  aspectRatio: 1,
}
