import type { ComponentMeta } from '../types'

export const techBorderMeta: ComponentMeta = {
  type: 'decoration-tech-border',
  name: '科技边框',
  category: 'decoration',
  icon: 'i-carbon-checkbox',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    borderColor: '#0073ff',
    cornerSize: 20,
  },
  propsSchema: {
    type: 'object',
    properties: {
      borderColor: { type: 'string', title: '边框颜色', default: '#0073ff' },
      cornerSize: { type: 'number', title: '角标大小', default: 20 },
    },
  },
  resizable: true,
}

export const titleBoxMeta: ComponentMeta = {
  type: 'decoration-title',
  name: '标题框',
  category: 'decoration',
  icon: 'i-carbon-text-font',
  defaultSize: { w: 400, h: 60 },
  defaultProps: {
    text: '大屏标题',
    fontSize: 28,
    color: '#f0f6fc',
  },
  propsSchema: {
    type: 'object',
    properties: {
      text: { type: 'string', title: '标题文本' },
      fontSize: { type: 'number', title: '字体大小', default: 28 },
      color: { type: 'string', title: '文字颜色', default: '#f0f6fc' },
    },
  },
  resizable: true,
}

export const dividerMeta: ComponentMeta = {
  type: 'decoration-divider',
  name: '分割线',
  category: 'decoration',
  icon: 'i-carbon-horizontal-rule',
  defaultSize: { w: 400, h: 2 },
  defaultProps: {
    color: '#0073ff',
    style: 'solid',
  },
  propsSchema: {
    type: 'object',
    properties: {
      color: { type: 'string', title: '线条颜色', default: '#0073ff' },
      style: { type: 'string', title: '线条样式', enum: ['solid', 'dashed', 'dotted'], default: 'solid' },
    },
  },
  resizable: true,
}
