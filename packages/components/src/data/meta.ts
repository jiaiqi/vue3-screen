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
