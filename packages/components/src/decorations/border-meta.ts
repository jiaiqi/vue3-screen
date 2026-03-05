import type { ComponentMeta } from '../types'

export const glowingBorderMeta: ComponentMeta = {
  type: 'decoration-glowing-border',
  name: '流光边框',
  category: 'decoration',
  icon: 'i-carbon-border-full',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#00ffff',
    secondaryColor: '#ff00ff',
    speed: 2,
    direction: 'clockwise',
    glowIntensity: 0.8,
    borderWidth: 2,
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#00ffff' },
      secondaryColor: { type: 'string', title: '次要颜色', default: '#ff00ff' },
      speed: { type: 'number', title: '流动速度', default: 2, minimum: 0.1, maximum: 10 },
      direction: {
        type: 'string',
        title: '流动方向',
        enum: ['clockwise', 'counterclockwise'],
        default: 'clockwise',
      },
      glowIntensity: {
        type: 'number',
        title: '发光强度',
        default: 0.8,
        minimum: 0,
        maximum: 1,
      },
      borderWidth: { type: 'number', title: '边框宽度', default: 2, minimum: 1 },
    },
  },
  resizable: true,
}

export const pulseBorderMeta: ComponentMeta = {
  type: 'decoration-pulse-border',
  name: '脉冲边框',
  category: 'decoration',
  icon: 'i-carbon-radio-button',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#00ffff',
    secondaryColor: '#0088ff',
    speed: 1,
    pulseType: 'expand',
    borderWidth: 2,
    cornerRadius: 0,
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#00ffff' },
      secondaryColor: { type: 'string', title: '次要颜色', default: '#0088ff' },
      speed: { type: 'number', title: '脉冲速度', default: 1, minimum: 0.1, maximum: 10 },
      pulseType: {
        type: 'string',
        title: '脉冲类型',
        enum: ['expand', 'opacity', 'color'],
        default: 'expand',
      },
      borderWidth: { type: 'number', title: '边框宽度', default: 2, minimum: 1 },
      cornerRadius: { type: 'number', title: '圆角半径', default: 0, minimum: 0 },
    },
  },
  resizable: true,
}

export const particleBorderMeta: ComponentMeta = {
  type: 'decoration-particle-border',
  name: '粒子边框',
  category: 'decoration',
  icon: 'i-carbon-meteor',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#00ffff',
    particleCount: 8,
    speed: 1,
    particleSize: 3,
    direction: 'horizontal',
    borderWidth: 1,
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '粒子颜色', default: '#00ffff' },
      particleCount: { type: 'number', title: '粒子数量', default: 8, minimum: 1, maximum: 20 },
      speed: { type: 'number', title: '粒子速度', default: 1, minimum: 0.1, maximum: 10 },
      particleSize: { type: 'number', title: '粒子大小', default: 3, minimum: 1, maximum: 10 },
      direction: {
        type: 'string',
        title: '粒子方向',
        enum: ['horizontal', 'vertical', 'both'],
        default: 'horizontal',
      },
      borderWidth: { type: 'number', title: '边框宽度', default: 1, minimum: 1 },
    },
  },
  resizable: true,
}

export const circuitBorderMeta: ComponentMeta = {
  type: 'decoration-circuit-border',
  name: '电路边框',
  category: 'decoration',
  icon: 'i-carbon-microchip',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#00ffff',
    circuitColor: '#00ff88',
    speed: 1,
    complexity: 5,
    borderWidth: 2,
    cornerSize: 15,
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#00ffff' },
      circuitColor: { type: 'string', title: '电路颜色', default: '#00ff88' },
      speed: { type: 'number', title: '动画速度', default: 1, minimum: 0.1, maximum: 10 },
      complexity: {
        type: 'number',
        title: '电路复杂度',
        default: 5,
        minimum: 1,
        maximum: 10,
      },
      borderWidth: { type: 'number', title: '边框宽度', default: 2, minimum: 1 },
      cornerSize: { type: 'number', title: '角标大小', default: 15, minimum: 5 },
    },
  },
  resizable: true,
}

export const neonBorderMeta: ComponentMeta = {
  type: 'decoration-neon-border',
  name: '霓虹边框',
  category: 'decoration',
  icon: 'i-carbon-lightning',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#ff00ff',
    secondaryColor: '#00ffff',
    tertiaryColor: '#ffff00',
    speed: 1,
    flickerIntensity: 0.8,
    borderWidth: 3,
    cornerRadius: 8,
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#ff00ff' },
      secondaryColor: { type: 'string', title: '次要颜色', default: '#00ffff' },
      tertiaryColor: { type: 'string', title: '第三颜色', default: '#ffff00' },
      speed: { type: 'number', title: '闪烁速度', default: 1, minimum: 0.1, maximum: 10 },
      flickerIntensity: {
        type: 'number',
        title: '闪烁强度',
        default: 0.8,
        minimum: 0,
        maximum: 1,
      },
      borderWidth: { type: 'number', title: '边框宽度', default: 3, minimum: 1 },
      cornerRadius: { type: 'number', title: '圆角半径', default: 8, minimum: 0 },
    },
  },
  resizable: true,
}

export const metalBorderMeta: ComponentMeta = {
  type: 'decoration-metal-border',
  name: '金属边框',
  category: 'decoration',
  icon: 'i-carbon-metal',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#c0c0c0',
    secondaryColor: '#e8e8e8',
    metalType: 'steel',
    speed: 1,
    borderWidth: 4,
    cornerRadius: 4,
    shineIntensity: 0.7,
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#c0c0c0' },
      secondaryColor: { type: 'string', title: '次要颜色', default: '#e8e8e8' },
      metalType: {
        type: 'string',
        title: '金属类型',
        enum: ['steel', 'gold', 'bronze', 'chrome'],
        default: 'steel',
      },
      speed: { type: 'number', title: '光泽速度', default: 1, minimum: 0.1, maximum: 10 },
      borderWidth: { type: 'number', title: '边框宽度', default: 4, minimum: 1 },
      cornerRadius: { type: 'number', title: '圆角半径', default: 4, minimum: 0 },
      shineIntensity: {
        type: 'number',
        title: '光泽强度',
        default: 0.7,
        minimum: 0,
        maximum: 1,
      },
    },
  },
  resizable: true,
}

export const energyBorderMeta: ComponentMeta = {
  type: 'decoration-energy-border',
  name: '能量边框',
  category: 'decoration',
  icon: 'i-carbon-energy',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#ff6600',
    secondaryColor: '#ffff00',
    energyType: 'electric',
    speed: 2,
    intensity: 0.8,
    borderWidth: 3,
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#ff6600' },
      secondaryColor: { type: 'string', title: '次要颜色', default: '#ffff00' },
      energyType: {
        type: 'string',
        title: '能量类型',
        enum: ['electric', 'plasma', 'fire', 'ice'],
        default: 'electric',
      },
      speed: { type: 'number', title: '能量速度', default: 2, minimum: 0.1, maximum: 10 },
      intensity: {
        type: 'number',
        title: '能量强度',
        default: 0.8,
        minimum: 0,
        maximum: 1,
      },
      borderWidth: { type: 'number', title: '边框宽度', default: 3, minimum: 1 },
    },
  },
  resizable: true,
}

export const dataBorderMeta: ComponentMeta = {
  type: 'decoration-data-border',
  name: '数据边框',
  category: 'decoration',
  icon: 'i-carbon-data-2',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#00ff00',
    secondaryColor: '#008800',
    speed: 1,
    dataDensity: 20,
    borderWidth: 2,
    direction: 'matrix',
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#00ff00' },
      secondaryColor: { type: 'string', title: '次要颜色', default: '#008800' },
      speed: { type: 'number', title: '数据速度', default: 1, minimum: 0.1, maximum: 10 },
      dataDensity: {
        type: 'number',
        title: '数据密度',
        default: 20,
        minimum: 5,
        maximum: 50,
      },
      borderWidth: { type: 'number', title: '边框宽度', default: 2, minimum: 1 },
      direction: {
        type: 'string',
        title: '数据方向',
        enum: ['horizontal', 'vertical', 'matrix'],
        default: 'matrix',
      },
    },
  },
  resizable: true,
}

export const holoBorderMeta: ComponentMeta = {
  type: 'decoration-holo-border',
  name: '全息边框',
  category: 'decoration',
  icon: 'i-carbon-hologram',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#00ffff',
    secondaryColor: '#0088ff',
    tertiaryColor: '#00ff88',
    speed: 1,
    hologramType: 'scanline',
    intensity: 0.6,
    borderWidth: 2,
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#00ffff' },
      secondaryColor: { type: 'string', title: '次要颜色', default: '#0088ff' },
      tertiaryColor: { type: 'string', title: '第三颜色', default: '#00ff88' },
      speed: { type: 'number', title: '动画速度', default: 1, minimum: 0.1, maximum: 10 },
      hologramType: {
        type: 'string',
        title: '全息类型',
        enum: ['scanline', 'grid', 'projection'],
        default: 'scanline',
      },
      intensity: {
        type: 'number',
        title: '全息强度',
        default: 0.6,
        minimum: 0,
        maximum: 1,
      },
      borderWidth: { type: 'number', title: '边框宽度', default: 2, minimum: 1 },
    },
  },
  resizable: true,
}

export const customBorderMeta: ComponentMeta = {
  type: 'decoration-custom-border',
  name: '自定义边框',
  category: 'decoration',
  icon: 'i-carbon-settings',
  defaultSize: { w: 400, h: 300 },
  defaultProps: {
    primaryColor: '#00ffff',
    secondaryColor: '#ff00ff',
    borderWidth: 2,
    cornerRadius: 0,
    cornerSize: 20,
    dashed: false,
    dashArray: '10 5',
    glowIntensity: 0.5,
    animationType: 'flow',
    speed: 1,
    gradientDirection: 'horizontal',
  },
  propsSchema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string', title: '主颜色', default: '#00ffff' },
      secondaryColor: { type: 'string', title: '次要颜色', default: '#ff00ff' },
      borderWidth: { type: 'number', title: '边框宽度', default: 2, minimum: 1 },
      cornerRadius: { type: 'number', title: '圆角半径', default: 0, minimum: 0 },
      cornerSize: { type: 'number', title: '角标大小', default: 20, minimum: 5 },
      dashed: { type: 'boolean', title: '虚线', default: false },
      dashArray: { type: 'string', title: '虚线样式', default: '10 5' },
      glowIntensity: {
        type: 'number',
        title: '发光强度',
        default: 0.5,
        minimum: 0,
        maximum: 1,
      },
      animationType: {
        type: 'string',
        title: '动画类型',
        enum: ['none', 'flow', 'pulse', 'dash'],
        default: 'flow',
      },
      speed: { type: 'number', title: '动画速度', default: 1, minimum: 0.1, maximum: 10 },
      gradientDirection: {
        type: 'string',
        title: '渐变方向',
        enum: ['horizontal', 'vertical', 'diagonal'],
        default: 'horizontal',
      },
    },
  },
  resizable: true,
}
