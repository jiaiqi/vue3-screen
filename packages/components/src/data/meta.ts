import type { ComponentMeta } from '../types'

export const numberCardMeta: ComponentMeta = {
  type: 'data-number-card',
  name: '数字卡片',
  category: 'data',
  icon: 'i-carbon-number',
  defaultSize: { w: 200, h: 120 },
  defaultProps: {
    title: '总数量',
    value: 12345,
    unit: '个',
    showTrend: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      value: { type: 'number', title: '数值' },
      unit: { type: 'string', title: '单位' },
      showTrend: { type: 'boolean', title: '显示趋势' },
    },
  },
  resizable: true,
}

export const baseNumberCardMeta: ComponentMeta = {
  type: 'data-base-number-card',
  name: '基础数字卡',
  category: 'data',
  icon: 'i-carbon-number',
  defaultSize: { w: 220, h: 130 },
  defaultProps: {
    title: '基础数据',
    value: 12345,
    prefix: '',
    suffix: '个',
    decimalPlaces: 0,
    animated: true,
    animationDuration: 1000,
    titleColor: 'text-text-secondary',
    valueColor: 'text-text-primary',
    backgroundColor: 'bg-surface-elevated',
    borderRadius: 8,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      value: { type: 'number', title: '数值' },
      prefix: { type: 'string', title: '前缀' },
      suffix: { type: 'string', title: '后缀单位' },
      decimalPlaces: { type: 'number', title: '小数位数', default: 0 },
      animated: { type: 'boolean', title: '启用动画', default: true },
      animationDuration: { type: 'number', title: '动画时长 (ms)', default: 1000 },
      titleColor: { type: 'string', title: '标题颜色类' },
      valueColor: { type: 'string', title: '数值颜色类' },
      backgroundColor: { type: 'string', title: '背景颜色类' },
      borderRadius: { type: 'number', title: '圆角大小', default: 8 },
    },
  },
  resizable: true,
}

export const trendNumberCardMeta: ComponentMeta = {
  type: 'data-trend-number-card',
  name: '趋势数字卡',
  category: 'data',
  icon: 'i-carbon-trend',
  defaultSize: { w: 220, h: 150 },
  defaultProps: {
    title: '趋势数据',
    value: 12345,
    prefix: '',
    suffix: '',
    decimalPlaces: 0,
    trendValue: 12.5,
    trendType: 'percentage',
    trendDirection: 'up',
    animated: true,
    animationDuration: 1000,
    showTrendIcon: true,
    backgroundColor: 'bg-surface-elevated',
    borderRadius: 8,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      value: { type: 'number', title: '数值' },
      prefix: { type: 'string', title: '前缀' },
      suffix: { type: 'string', title: '后缀单位' },
      decimalPlaces: { type: 'number', title: '小数位数', default: 0 },
      trendValue: { type: 'number', title: '趋势值' },
      trendType: { 
        type: 'string', 
        title: '趋势类型',
        enum: ['absolute', 'percentage'],
        default: 'percentage'
      },
      trendDirection: { 
        type: 'string', 
        title: '趋势方向',
        enum: ['up', 'down', 'flat'],
        default: 'up'
      },
      animated: { type: 'boolean', title: '启用动画', default: true },
      animationDuration: { type: 'number', title: '动画时长 (ms)', default: 1000 },
      showTrendIcon: { type: 'boolean', title: '显示趋势图标', default: true },
      backgroundColor: { type: 'string', title: '背景颜色类' },
      borderRadius: { type: 'number', title: '圆角大小', default: 8 },
    },
  },
  resizable: true,
}

export const targetNumberCardMeta: ComponentMeta = {
  type: 'data-target-number-card',
  name: '目标数字卡',
  category: 'data',
  icon: 'i-carbon-target',
  defaultSize: { w: 220, h: 160 },
  defaultProps: {
    title: '目标数据',
    value: 80,
    target: 100,
    prefix: '',
    suffix: '',
    decimalPlaces: 0,
    showTargetValue: true,
    targetLabel: '目标值',
    animated: true,
    animationDuration: 1000,
    backgroundColor: 'bg-surface-elevated',
    borderRadius: 8,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      value: { type: 'number', title: '当前值' },
      target: { type: 'number', title: '目标值' },
      prefix: { type: 'string', title: '前缀' },
      suffix: { type: 'string', title: '后缀单位' },
      decimalPlaces: { type: 'number', title: '小数位数', default: 0 },
      showTargetValue: { type: 'boolean', title: '显示目标值', default: true },
      targetLabel: { type: 'string', title: '目标值标签', default: '目标值' },
      animated: { type: 'boolean', title: '启用动画', default: true },
      animationDuration: { type: 'number', title: '动画时长 (ms)', default: 1000 },
      backgroundColor: { type: 'string', title: '背景颜色类' },
      borderRadius: { type: 'number', title: '圆角大小', default: 8 },
    },
  },
  resizable: true,
}

export const progressNumberCardMeta: ComponentMeta = {
  type: 'data-progress-number-card',
  name: '完成率数字卡',
  category: 'data',
  icon: 'i-carbon-progress-bar',
  defaultSize: { w: 220, h: 160 },
  defaultProps: {
    title: '完成率',
    value: 65,
    total: 100,
    prefix: '',
    suffix: '%',
    decimalPlaces: 1,
    showTotal: true,
    totalLabel: '总数',
    animated: true,
    animationDuration: 1000,
    showCircularProgress: false,
    circularSize: 120,
    strokeWidth: 8,
    backgroundColor: 'bg-surface-elevated',
    borderRadius: 8,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      value: { type: 'number', title: '已完成值' },
      total: { type: 'number', title: '总值' },
      prefix: { type: 'string', title: '前缀' },
      suffix: { type: 'string', title: '后缀单位', default: '%' },
      decimalPlaces: { type: 'number', title: '小数位数', default: 1 },
      showTotal: { type: 'boolean', title: '显示总数', default: true },
      totalLabel: { type: 'string', title: '总数标签', default: '总数' },
      animated: { type: 'boolean', title: '启用动画', default: true },
      animationDuration: { type: 'number', title: '动画时长 (ms)', default: 1000 },
      showCircularProgress: { type: 'boolean', title: '显示环形进度', default: false },
      circularSize: { type: 'number', title: '环形大小', default: 120 },
      strokeWidth: { type: 'number', title: '进度条宽度', default: 8 },
      backgroundColor: { type: 'string', title: '背景颜色类' },
      borderRadius: { type: 'number', title: '圆角大小', default: 8 },
    },
  },
  resizable: true,
}

export const multiDimensionNumberCardMeta: ComponentMeta = {
  type: 'data-multi-dimension-number-card',
  name: '多维度数字卡',
  category: 'data',
  icon: 'i-carbon-chart-multi-bar',
  defaultSize: { w: 300, h: 220 },
  defaultProps: {
    title: '多维度数据',
    mainValue: 1000,
    mainPrefix: '',
    mainSuffix: '个',
    decimalPlaces: 0,
    dimensions: [
      { label: '维度 A', value: 100, suffix: '个' },
      { label: '维度 B', value: 200, suffix: '个' },
      { label: '维度 C', value: 150, suffix: '个' },
    ],
    animated: true,
    animationDuration: 1000,
    showBarChart: true,
    backgroundColor: 'bg-surface-elevated',
    borderRadius: 8,
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      mainValue: { type: 'number', title: '主数值' },
      mainPrefix: { type: 'string', title: '主数值前缀' },
      mainSuffix: { type: 'string', title: '主数值后缀' },
      decimalPlaces: { type: 'number', title: '小数位数', default: 0 },
      dimensions: { 
        type: 'array', 
        title: '维度数据',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string', title: '维度标签' },
            value: { type: 'number', title: '维度值' },
            prefix: { type: 'string', title: '前缀' },
            suffix: { type: 'string', title: '后缀' },
          }
        }
      },
      animated: { type: 'boolean', title: '启用动画', default: true },
      animationDuration: { type: 'number', title: '动画时长 (ms)', default: 1000 },
      showBarChart: { type: 'boolean', title: '显示条形图', default: true },
      backgroundColor: { type: 'string', title: '背景颜色类' },
      borderRadius: { type: 'number', title: '圆角大小', default: 8 },
    },
  },
  resizable: true,
}

export const dataTableMeta: ComponentMeta = {
  type: 'data-table',
  name: '数据表格',
  category: 'data',
  icon: 'i-carbon-table',
  defaultSize: { w: 500, h: 300 },
  defaultProps: {
    showHeader: true,
    striped: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      showHeader: { type: 'boolean', title: '显示表头', default: true },
      striped: { type: 'boolean', title: '斑马纹', default: true },
    },
  },
  resizable: true,
}

export const progressMeta: ComponentMeta = {
  type: 'data-progress',
  name: '进度条',
  category: 'data',
  icon: 'i-carbon-progress-bar',
  defaultSize: { w: 300, h: 40 },
  defaultProps: {
    value: 65,
    max: 100,
    color: '#0073ff',
    showLabel: true,
  },
  propsSchema: {
    type: 'object',
    properties: {
      value: { type: 'number', title: '当前值', default: 65 },
      max: { type: 'number', title: '最大值', default: 100 },
      color: { type: 'string', title: '进度颜色', default: '#0073ff' },
      showLabel: { type: 'boolean', title: '显示标签', default: true },
    },
  },
  resizable: true,
}
