import type { ComponentMeta } from '../types'

export const groupContainerMeta: ComponentMeta = {
  type: 'container-group',
  name: '分组容器',
  category: 'container',
  icon: 'i-carbon-folder',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    title: '分组',
    showTitle: true,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: '标题' },
      showTitle: { type: 'boolean', title: '显示标题', default: true },
      backgroundColor: { type: 'string', title: '背景颜色', default: 'rgba(0, 0, 0, 0.3)' },
    },
  },
  resizable: true,
}

export const tabsContainerMeta: ComponentMeta = {
  type: 'container-tabs',
  name: 'Tab容器',
  category: 'container',
  icon: 'i-carbon-tabs',
  defaultSize: { w: 500, h: 400 },
  defaultProps: {
    tabs: [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ],
    activeTab: 'tab1',
    tabPosition: 'top',
  },
  propsSchema: {
    type: 'object',
    properties: {
      tabPosition: { type: 'string', title: 'Tab位置', enum: ['top', 'bottom', 'left', 'right'], default: 'top' },
    },
  },
  resizable: true,
}
