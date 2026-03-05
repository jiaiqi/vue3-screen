import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    // 布局快捷方式
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'absolute-center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'absolute-fill': 'absolute top-0 left-0 right-0 bottom-0',
    
    // 设计器布局
    'app-layout': 'flex flex-col h-screen overflow-hidden',
    'top-bar': 'h-12 flex items-center justify-between px-4 border-b border-default bg-surface/80 backdrop-blur-md',
    'main-content': 'flex flex-1 overflow-hidden',
    'left-panel': 'w-70 flex flex-col border-r border-default bg-surface',
    'center-canvas': 'flex-1 relative overflow-hidden bg-canvas-bg',
    'right-panel': 'w-80 flex flex-col border-l border-default bg-surface',
    
    // 面板组件
    'panel-header': 'h-10 flex items-center justify-between px-3 border-b border-default bg-surface-elevated',
    'panel-content': 'flex-1 overflow-y-auto p-3',
    'panel-footer': 'h-10 flex items-center justify-between px-3 border-t border-default bg-surface-elevated',
    
    // 工具栏
    'toolbar-group': 'flex items-center gap-2',
    'toolbar-btn': 'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border border-default hover:border-primary hover:bg-primary/10 hover:shadow-glow',
    'toolbar-btn-primary': 'bg-primary text-black border-primary hover:shadow-glow-md',
    'toolbar-btn-icon': 'p-2 rounded-md',
    
    // 物料卡片
    'material-card': 'p-3 rounded-lg border border-default bg-elevated hover:border-primary hover:shadow-glow-sm transition-all duration-200 cursor-grab active:cursor-grabbing',
    'material-thumbnail': 'w-full aspect-video rounded bg-canvas-bg flex items-center justify-center mb-2',
    'material-name': 'text-sm text-center text-primary truncate',
    
    // 画布节点
    'canvas-node': 'absolute border border-default hover:border-primary transition-colors',
    'canvas-node-selected': 'border-primary shadow-glow',
    'canvas-node-resizing': 'border-primary border-2',
    
    // 调整手柄
    'resize-handle': 'absolute w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface z-30 hover:scale-125 transition-transform',
    'handle-nw': 'top--1.25 left--1.25 cursor-nw-resize',
    'handle-n': 'top--1.25 left-1/2 -translate-x-1/2 cursor-n-resize',
    'handle-ne': 'top--1.25 right--1.25 cursor-ne-resize',
    'handle-e': 'top-1/2 right--1.25 -translate-y-1/2 cursor-e-resize',
    'handle-se': 'bottom--1.25 right--1.25 cursor-se-resize',
    'handle-s': 'bottom--1.25 left-1/2 -translate-x-1/2 cursor-s-resize',
    'handle-sw': 'bottom--1.25 left--1.25 cursor-sw-resize',
    'handle-w': 'top-1/2 left--1.25 -translate-y-1/2 cursor-w-resize',
    
    // 图层项
    'layer-item': 'flex items-center gap-2 px-3 py-2 border-b border-default hover:bg-hover cursor-pointer transition-all',
    'layer-item-selected': 'bg-primary/15 border-l-2 border-l-primary',
    'layer-icon': 'w-5 h-5 text-primary flex-shrink-0',
    'layer-name': 'flex-1 text-sm truncate',
    'layer-actions': 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
    
    // 表单控件
    'form-group': 'mb-4',
    'form-label': 'block text-sm font-medium mb-2 text-primary',
    'form-input': 'w-full px-3 py-2 rounded-md bg-elevated border border-default text-sm focus:border-primary focus:shadow-glow-sm outline-none transition-all',
    'form-textarea': 'w-full px-3 py-2 rounded-md bg-elevated border border-default text-sm font-mono focus:border-primary focus:shadow-glow-sm outline-none transition-all resize-none',
    
    // 颜色选择器
    'color-picker': 'flex items-center gap-2',
    'color-preview': 'w-8 h-8 rounded border border-default cursor-pointer hover:scale-110 transition-transform',
    
    // 标签页
    'tabs-header': 'flex border-b border-default',
    'tab-btn': 'px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary/50 transition-colors',
    'tab-btn-active': 'text-primary border-primary',
    
    // 搜索框
    'search-box': 'relative',
    'search-input': 'w-full pl-9 pr-3 py-2 rounded-md bg-elevated border border-default text-sm focus:border-primary focus:shadow-glow-sm outline-none transition-all',
    'search-icon': 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted',
    
    // 空状态
    'empty-state': 'flex flex-col items-center justify-center py-12 text-muted',
    'empty-icon': 'w-16 h-16 mb-4 opacity-50',
    'empty-text': 'text-sm',
    
    // 加载状态
    'skeleton': 'animate-pulse bg-elevated rounded',
    'skeleton-text': 'h-4 w-full',
    'skeleton-circle': 'rounded-full',
    
    // 滚动条样式
    'custom-scrollbar': 'overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-default hover:scrollbar-thumb-primary',
    
    // 科技效果
    'tech-border': 'relative border border-transparent bg-clip-padding [background:linear-gradient(var(--color-bg-surface),var(--color-bg-surface))_padding-box,linear-gradient(135deg,#00d4ff_0%,#ff6b35_100%)_border-box]',
    'glow-effect': 'animate-glow-flow',
    'hover-highlight': 'hover:border-primary hover:shadow-glow transition-all duration-200',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'JetBrains Mono:400,500,600,700',
      },
    }),
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--color-primary)',
        50: 'var(--color-primary-50)',
        100: 'var(--color-primary-100)',
        200: 'var(--color-primary-200)',
        300: 'var(--color-primary-300)',
        400: 'var(--color-primary-400)',
        500: 'var(--color-primary-500)',
        600: 'var(--color-primary-600)',
        700: 'var(--color-primary-700)',
        800: 'var(--color-primary-800)',
        900: 'var(--color-primary-900)',
      },
      canvas: {
        bg: 'var(--color-canvas-bg)',
        grid: 'var(--color-canvas-grid)',
        guide: 'var(--color-canvas-guide)',
      },
      surface: {
        DEFAULT: 'var(--color-surface)',
        elevated: 'var(--color-surface-elevated)',
        overlay: 'var(--color-surface-overlay)',
      },
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
      },
      border: {
        DEFAULT: 'var(--color-border)',
        light: 'var(--color-border-light)',
        active: 'var(--color-border-active)',
      },
      bg: {
        base: 'var(--color-bg-base)',
        elevated: 'var(--color-bg-elevated)',
        surface: 'var(--color-bg-surface)',
        overlay: 'var(--color-bg-overlay)',
        hover: 'var(--bg-hover)',
        active: 'var(--bg-active)',
      },
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)',
      info: 'var(--color-info)',
      accent: 'var(--color-accent)',
    },
    boxShadow: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      glow: 'var(--shadow-glow)',
      'glow-md': '0 0 30px rgba(0, 212, 255, 0.4)',
      'glow-lg': '0 0 40px rgba(0, 212, 255, 0.5)',
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      full: 'var(--radius-full)',
    },
    spacing: {
      xs: 'var(--spacing-xs)',
      sm: 'var(--spacing-sm)',
      md: 'var(--spacing-md)',
      lg: 'var(--spacing-lg)',
      xl: 'var(--spacing-xl)',
    },
    transitionDuration: {
      fast: 'var(--transition-fast)',
      normal: 'var(--transition-normal)',
      slow: 'var(--transition-slow)',
    },
    zIndex: {
      canvas: 'var(--z-canvas)',
      node: 'var(--z-node)',
      edge: 'var(--z-edge)',
      selection: 'var(--z-selection)',
      handle: 'var(--z-handle)',
      panel: 'var(--z-panel)',
      modal: 'var(--z-modal)',
      tooltip: 'var(--z-tooltip)',
      toast: 'var(--z-toast)',
    },
    animation: {
      'glow-flow': 'glow-flow 2s ease-in-out infinite',
      'scan-line': 'scan-line 3s linear infinite',
      'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      'border-glow': 'border-glow 2s ease-in-out infinite',
    },
    keyframes: {
      'glow-flow': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
      'scan-line': {
        '0%': { transform: 'translateY(-100%)' },
        '100%': { transform: 'translateY(100%)' },
      },
      'pulse-glow': {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.5' },
      },
      'border-glow': {
        '0%, 100%': {
          borderColor: 'var(--color-border)',
          boxShadow: 'none',
        },
        '50%': {
          borderColor: 'var(--color-primary)',
          boxShadow: 'var(--shadow-glow)',
        },
      },
    },
  },
})
