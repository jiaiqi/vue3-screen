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
    showLabel: false,
    stacked: false,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      showLabel: { type: 'boolean', title: '显示数值', default: false },
      stacked: { type: 'boolean', title: '堆叠模式', default: false },
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
    showTooltip: true,
    smooth: true,
    showArea: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      smooth: { type: 'boolean', title: '平滑曲线', default: true },
      showArea: { type: 'boolean', title: '显示面积', default: true },
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
    showTooltip: true,
    radius: '70%',
    roseType: false,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      radius: { type: 'string', title: '半径', default: '70%' },
      roseType: { type: 'boolean', title: '玫瑰图模式', default: false },
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
    min: 0,
    showDetail: true,
    unit: '',
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      value: { type: 'number', title: '当前值', default: 75 },
      max: { type: 'number', title: '最大值', default: 100 },
      min: { type: 'number', title: '最小值', default: 0 },
      showDetail: { type: 'boolean', title: '显示详情', default: true },
      unit: { type: 'string', title: '单位', default: '' },
    },
  },
  resizable: true,
  aspectRatio: 1,
}

export const horizontalBarChartMeta: ComponentMeta = {
  type: 'chart-horizontal-bar',
  name: '条形图',
  category: 'chart',
  icon: 'i-carbon-chart-horizontal',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    title: '条形图',
    showLegend: true,
    showTooltip: true,
    showLabel: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      showLabel: { type: 'boolean', title: '显示数值', default: true },
    },
  },
  resizable: true,
}

export const radarChartMeta: ComponentMeta = {
  type: 'chart-radar',
  name: '雷达图',
  category: 'chart',
  icon: 'i-carbon-plot-radar',
  defaultSize: { w: 400, h: 350 },
  defaultProps: {
    title: '雷达图',
    showLegend: true,
    showTooltip: true,
    shape: 'circle',
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      shape: { 
        type: 'string', 
        title: '形状', 
        enum: ['circle', 'polygon'],
        default: 'circle' 
      },
    },
  },
  resizable: true,
}

export const funnelChartMeta: ComponentMeta = {
  type: 'chart-funnel',
  name: '漏斗图',
  category: 'chart',
  icon: 'i-carbon-funnel',
  defaultSize: { w: 400, h: 400 },
  defaultProps: {
    title: '漏斗图',
    showLegend: true,
    showTooltip: true,
    sort: 'descending',
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      sort: { 
        type: 'string', 
        title: '排序', 
        enum: ['ascending', 'descending', 'none'],
        default: 'descending' 
      },
    },
  },
  resizable: true,
}

export const heatmapChartMeta: ComponentMeta = {
  type: 'chart-heatmap',
  name: '热力图',
  category: 'chart',
  icon: 'i-carbon-heatmap',
  defaultSize: { w: 500, h: 400 },
  defaultProps: {
    title: '热力图',
    showTooltip: true,
    showLabel: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      showLabel: { type: 'boolean', title: '显示数值', default: true },
    },
  },
  resizable: true,
}

export const scatterChartMeta: ComponentMeta = {
  type: 'chart-scatter',
  name: '散点图',
  category: 'chart',
  icon: 'i-carbon-chart-scatter',
  defaultSize: { w: 400, h: 350 },
  defaultProps: {
    title: '散点图',
    showLegend: true,
    showTooltip: true,
    showLine: false,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showLegend: { type: 'boolean', title: '显示图例', default: true },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      showLine: { type: 'boolean', title: '显示趋势线', default: false },
    },
  },
  resizable: true,
}

export const candlestickChartMeta: ComponentMeta = {
  type: 'chart-candlestick',
  name: 'K 线图',
  category: 'chart',
  icon: 'i-carbon-chart-candlestick',
  defaultSize: { w: 500, h: 400 },
  defaultProps: {
    title: 'K 线图',
    showTooltip: true,
    showVolume: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showTooltip: { type: 'boolean', title: '显示提示', default: true },
      showVolume: { type: 'boolean', title: '显示成交量', default: true },
    },
  },
  resizable: true,
}
