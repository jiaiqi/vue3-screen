# 设计器 UI 实施详细 Spec

## 1. 设计原则与视觉风格

### 1.1 核心设计理念
- **工业暗黑美学**：深色基底 + 霓虹点缀 + 金属质感
- **赛博朋克元素**：流光边框、粒子背景、科技线条
- **专业工具感**：紧凑布局、清晰层级、高效操作

### 1.2 色彩系统

#### 主色调
```css
--color-primary: #00d4ff;        /* 科技蓝 - 主按钮、选中态 */
--color-primary-glow: rgba(0, 212, 255, 0.6);
--color-secondary: #7b61ff;      /* 紫色 - 次要操作 */
--color-accent: #00ff9d;         /* 荧光绿 - 成功状态、运行指示 */
```

#### 功能色
```css
--color-success: #00e676;        /* 成功/运行中 */
--color-warning: #ffab00;        /* 警告/维护中 */
--color-error: #ff4081;          /* 错误/故障 */
--color-info: #40c9ff;           /* 信息提示 */
```

#### 背景层次
```css
--bg-base: #0a0e17;              /* 最深背景 */
--bg-surface: #111827;           /* 面板背景 */
--bg-elevated: #1f2937;          /* 浮层背景 */
--bg-hover: rgba(255, 255, 255, 0.05);
--bg-active: rgba(0, 212, 255, 0.15);
```

#### 边框与分割
```css
--border-subtle: rgba(255, 255, 255, 0.08);
--border-default: rgba(255, 255, 255, 0.15);
--border-strong: rgba(255, 255, 255, 0.25);
--border-glow: rgba(0, 212, 255, 0.4);
```

### 1.3 字体系统

#### 字体栈
```css
--font-sans: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
```

#### 字号层级
```css
--text-xs: 0.75rem;    /* 12px - 辅助文字 */
--text-sm: 0.875rem;   /* 14px - 正文/按钮 */
--text-base: 1rem;     /* 16px - 默认 */
--text-lg: 1.125rem;   /* 18px - 小标题 */
--text-xl: 1.25rem;    /* 20px - 面板标题 */
--text-2xl: 1.5rem;    /* 24px - 模块标题 */
```

### 1.4 间距系统

基于 4px 网格：
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
```

### 1.5 圆角与阴影

#### 圆角
```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

#### 阴影（发光效果）
```css
--shadow-glow-sm: 0 0 10px var(--color-primary-glow);
--shadow-glow-md: 0 0 20px var(--color-primary-glow);
--shadow-glow-lg: 0 0 30px var(--color-primary-glow);
```

---

## 2. 整体布局架构

### 2.1 三栏布局结构

```
┌─────────────────────────────────────────────────────────────┐
│                      顶部工具栏 (48px)                       │
│  Logo | 保存 | 撤销/重做 | 预览 | 发布 | 画布模式 | 缩放控制    │
├──────────┬────────────────────────────────────┬──────────────┤
│          │                                    │              │
│  物料    │                                    │   属性面板   │
│  面板    │           画布区域                  │   (320px)   │
│ (280px)  │        (自适应)                     │              │
│          │                                    │              │
│          │                                    ├──────────────┤
│          │                                    │              │
│          │                                    │   图层面板   │
│          │                                    │   (240px)   │
│          │                                    │              │
└──────────┴────────────────────────────────────┴──────────────┘
```

### 2.2 响应式断点

```typescript
const breakpoints = {
  sm: 640,    // 小型面板
  md: 1024,   // 平板
  lg: 1280,   // 标准桌面
  xl: 1920,   // 大屏
}
```

---

## 3. 顶部工具栏 (Top Bar)

### 3.1 结构

```vue
<header class="top-bar">
  <div class="left-section">
    <Logo />
    <ScreenTitle editable />
  </div>
  
  <div class="center-section">
    <ToolbarGroup>
      <SaveButton @click="save" />
      <UndoRedoGroup />
      <PreviewButton />
      <PublishButton />
    </ToolbarGroup>
  </div>
  
  <div class="right-section">
    <CanvasModeToggle />
    <ZoomControl />
    <ThemeToggle />
    <HelpMenu />
  </div>
</header>
```

### 3.2 样式规范

```css
.top-bar {
  height: 48px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  backdrop-filter: blur(8px);
}

.toolbar-btn {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-base);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-strong);
}

.toolbar-btn.primary {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}

.toolbar-btn.primary:hover {
  box-shadow: var(--shadow-glow-sm);
}
```

---

## 4. 物料面板 (Materials Panel)

### 4.1 结构

```vue
<aside class="materials-panel">
  <PanelHeader>
    <Tabs v-model="activeCategory">
      <Tab name="chart">图表</Tab>
      <Tab name="map">地图</Tab>
      <Tab name="data">数据</Tab>
      <Tab name="decoration">装饰</Tab>
      <Tab name="container">容器</Tab>
      <Tab name="media">媒体</Tab>
    </Tabs>
  </PanelHeader>
  
  <SearchBox v-model="searchQuery" placeholder="搜索组件..." />
  
  <ComponentGrid>
    <ComponentCard
      v-for="item in filteredComponents"
      :key="item.type"
      :meta="item.meta"
      draggable
      @dragstart="handleDragStart"
    />
  </ComponentGrid>
</aside>
```

### 4.2 组件卡片样式

```css
.materials-panel {
  width: 280px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.component-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  cursor: grab;
  transition: all 0.2s;
}

.component-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-sm);
}

.component-card:active {
  cursor: grabbing;
}

.component-thumbnail {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--bg-base);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.component-icon {
  font-size: 2rem;
  color: var(--color-primary);
}

.component-name {
  font-size: var(--text-sm);
  color: var(--text-base);
  text-align: center;
}
```

---

## 5. 画布区域 (Canvas Area)

### 5.1 画布容器

```vue
<main class="canvas-container">
  <!-- 标尺层 -->
  <Ruler orientation="horizontal" :offset="offsetX" :scale="scale" />
  <Ruler orientation="vertical" :offset="offsetY" :scale="scale" />
  
  <!-- 画布变换层 -->
  <div 
    class="canvas-content"
    :style="{ transform: canvasTransform }"
    @wheel="handleWheel"
    @mousedown="handleCanvasMouseDown"
  >
    <!-- 背景层 -->
    <CanvasBackground />
    
    <!-- 网格层 -->
    <CanvasGrid v-if="showGrid" />
    
    <!-- 节点层 (DOM) -->
    <NodeLayer>
      <ComponentNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :selected="selectedIds.includes(node.id)"
      />
    </NodeLayer>
    
    <!-- 连线层 (SVG) -->
    <EdgeLayer>
      <Edge
        v-for="edge in edges"
        :key="edge.id"
        :edge="edge"
      />
    </EdgeLayer>
    
    <!-- 辅助线层 -->
    <GuidesLayer :guides="activeGuides" />
    
    <!-- 交互层 -->
    <InteractionLayer>
      <SelectionBox v-if="isSelecting" />
      <ResizeHandle v-if="hasSelection" />
    </InteractionLayer>
  </div>
  
  <!-- 鸟瞰图 -->
  <MiniMap />
</main>
```

### 5.2 画布样式

```css
.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--bg-base);
}

.canvas-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: top left;
  will-change: transform;
}

/* 网格背景 */
.canvas-grid {
  background-image: 
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
}

/* 标尺 */
.ruler {
  position: absolute;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  z-index: 100;
}

.ruler.horizontal {
  top: 0;
  left: 40px;
  right: 0;
  height: 24px;
}

.ruler.vertical {
  top: 24px;
  left: 0;
  bottom: 0;
  width: 40px;
}

/* 辅助线 */
.guide-line {
  position: absolute;
  background: var(--color-primary);
  z-index: 1000;
  pointer-events: none;
}

.guide-line.horizontal {
  left: 0;
  right: 0;
  height: 1px;
}

.guide-line.vertical {
  top: 0;
  bottom: 0;
  width: 1px;
}
```

### 5.3 画布变换计算

```typescript
const canvasTransform = computed(() => {
  return `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`
})

// 坐标转换：屏幕坐标 → 画布逻辑坐标
function screenToCanvas(screenX: number, screenY: number) {
  return {
    x: (screenX - offsetX.value) / scale.value,
    y: (screenY - offsetY.value) / scale.value,
  }
}
```

---

## 6. 属性面板 (Properties Panel)

### 6.1 结构

```vue
<aside class="properties-panel">
  <PanelHeader>
    <Tabs v-model="activeTab">
      <Tab name="props">属性</Tab>
      <Tab name="style">样式</Tab>
      <Tab name="data">数据</Tab>
    </Tabs>
  </PanelHeader>
  
  <PanelContent v-if="selectedNode">
    <!-- 属性配置 -->
    <PropertiesTab v-if="activeTab === 'props'">
      <JsonSchemaForm
        :schema="selectedNode.propsSchema"
        :model="selectedNode.props"
        @update="handlePropsUpdate"
      />
    </PropertiesTab>
    
    <!-- 样式配置 -->
    <StyleTab v-if="activeTab === 'style'">
      <SizeControl v-model="selectedNode.style" />
      <ColorPicker label="背景色" v-model="selectedNode.style.backgroundColor" />
      <BorderControl v-model="selectedNode.style.border" />
      <ShadowControl v-model="selectedNode.style.boxShadow" />
      <AnimationControl v-model="selectedNode.style.animation" />
    </StyleTab>
    
    <!-- 数据绑定 -->
    <DataTab v-if="activeTab === 'data'">
      <DataSourceSelector v-model="selectedNode.dataSourceId" />
      <JsonPathExtractor v-model="selectedNode.dataPath" />
      <JSFilterEditor v-model="selectedNode.filter" />
      <FieldMapper v-model="selectedNode.fieldMap" />
      <RefreshRateControl v-model="selectedNode.refreshInterval" />
    </DataTab>
  </PanelContent>
  
  <EmptyState v-else>
    <p>请选择一个组件</p>
  </EmptyState>
</aside>
```

### 6.2 表单控件样式

```css
.properties-panel {
  width: 320px;
  background: var(--bg-surface);
  border-left: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-base);
  margin-bottom: var(--space-2);
  font-weight: 500;
}

.form-input {
  width: 100%;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  color: var(--text-base);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow-sm);
}

/* 颜色选择器 */
.color-picker {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-default);
  cursor: pointer;
}

/* 代码编辑器 */
.code-editor {
  min-height: 200px;
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-xs);
}
```

---

## 7. 图层面板 (Layer Panel)

### 7.1 结构

```vue
<aside class="layer-panel">
  <PanelHeader>
    <span>图层</span>
    <div class="actions">
      <SearchIcon @click="toggleSearch" />
      <GroupIcon @click="groupSelected" />
    </div>
  </PanelHeader>
  
  <SearchBox v-if="showSearch" v-model="searchQuery" />
  
  <LayerTree
    v-model="layers"
    draggable
    @update="handleLayerReorder"
    @select="handleLayerSelect"
  >
    <template #node="{ node }">
      <LayerItem
        :node="node"
        :selected="selectedIds.includes(node.id)"
      >
        <NodeIcon :type="node.type" />
        <EditableText v-model="node.name" />
        <LayerActions
          :locked="node.locked"
          :visible="node.visible"
          @lock="toggleLock"
          @toggle-visible="toggleVisible"
        />
      </LayerItem>
    </template>
  </LayerTree>
</aside>
```

### 7.2 图层项样式

```css
.layer-panel {
  height: 240px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layer-item {
  display: flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  transition: all 0.15s;
  border-bottom: 1px solid var(--border-subtle);
}

.layer-item:hover {
  background: var(--bg-hover);
}

.layer-item.selected {
  background: var(--bg-active);
  border-left: 3px solid var(--color-primary);
}

.layer-icon {
  width: 20px;
  height: 20px;
  margin-right: var(--space-2);
  color: var(--color-primary);
}

.layer-name {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-base);
}

.layer-actions {
  display: flex;
  gap: var(--space-1);
  opacity: 0;
  transition: opacity 0.2s;
}

.layer-item:hover .layer-actions {
  opacity: 1;
}

.action-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-base);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.action-btn:hover {
  background: var(--bg-elevated);
  color: var(--color-primary);
}
```

---

## 8. 交互细节

### 8.1 拖拽 Ghost 预览

```typescript
function handleDragStart(event: DragEvent, componentMeta: ComponentMeta) {
  event.dataTransfer?.setData('application/json', JSON.stringify({
    type: 'component',
    meta: componentMeta,
  }))
  
  // 自定义 Ghost 预览
  const ghost = document.createElement('div')
  ghost.className = 'drag-ghost'
  ghost.innerHTML = `
    <div class="ghost-icon">${componentMeta.icon}</div>
    <div class="ghost-name">${componentMeta.name}</div>
  `
  document.body.appendChild(ghost)
  event.dataTransfer?.setDragImage(ghost, 0, 0)
  
  setTimeout(() => ghost.remove(), 0)
}
```

```css
.drag-ghost {
  position: fixed;
  background: var(--bg-elevated);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-glow-md);
  pointer-events: none;
  z-index: 9999;
  animation: ghost-fade 0.2s ease-out;
}

@keyframes ghost-fade {
  to { opacity: 0.5; }
}
```

### 8.2 选中效果

```css
.node-wrapper {
  position: absolute;
}

.node-wrapper.selected {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.node-wrapper.selected::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid var(--color-primary);
  border-radius: inherit;
  pointer-events: none;
  animation: selected-glow 2s ease-in-out infinite;
}

@keyframes selected-glow {
  0%, 100% { box-shadow: 0 0 10px var(--color-primary-glow); }
  50% { box-shadow: 0 0 20px var(--color-primary-glow); }
}
```

### 8.3 Resize 手柄

```vue
<div v-if="selected" class="resize-handles">
  <div class="handle nw" data-dir="nw" />
  <div class="handle n" data-dir="n" />
  <div class="handle ne" data-dir="ne" />
  <div class="handle e" data-dir="e" />
  <div class="handle se" data-dir="se" />
  <div class="handle s" data-dir="s" />
  <div class="handle sw" data-dir="sw" />
  <div class="handle w" data-dir="w" />
</div>
```

```css
.resize-handles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border: 2px solid var(--bg-surface);
  border-radius: var(--radius-full);
  pointer-events: auto;
  cursor: pointer;
  z-index: 100;
}

.handle:hover {
  transform: scale(1.2);
  background: #fff;
}

.handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
.handle.n { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
.handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
.handle.e { top: 50%; right: -5px; transform: translateY(-50%); cursor: e-resize; }
.handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
.handle.s { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
.handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.handle.w { top: 50%; left: -5px; transform: translateY(-50%); cursor: w-resize; }
```

---

## 9. 动画效果

### 9.1 面板展开动画

```css
.panel-content {
  overflow: hidden;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-header {
  cursor: pointer;
  transition: background 0.2s;
}

.panel-header:hover {
  background: var(--bg-hover);
}
```

### 9.2 按钮悬停动画

```css
.toolbar-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.toolbar-btn:hover {
  transform: translateY(-1px);
}

.toolbar-btn:active {
  transform: translateY(0);
}
```

### 9.3 加载骨架屏

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-base) 0%,
    var(--bg-elevated) 50%,
    var(--bg-base) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 10. 暗色主题实现

### 10.1 CSS 变量定义

```css
:root {
  /* 基础色 */
  --bg-base: #0a0e17;
  --bg-surface: #111827;
  --bg-elevated: #1f2937;
  
  /* 主色 */
  --color-primary: #00d4ff;
  --color-secondary: #7b61ff;
  --color-accent: #00ff9d;
  
  /* 边框 */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-default: rgba(255, 255, 255, 0.15);
  --border-strong: rgba(255, 255, 255, 0.25);
  
  /* 文字 */
  --text-base: #e5e7eb;
  --text-muted: #9ca3af;
}

/* 浅色主题 */
[data-theme='light'] {
  --bg-base: #f3f4f6;
  --bg-surface: #ffffff;
  --bg-elevated: #f9fafb;
  
  --color-primary: #0284c7;
  --color-secondary: #6366f1;
  --color-accent: #10b981;
  
  --border-subtle: rgba(0, 0, 0, 0.05);
  --border-default: rgba(0, 0, 0, 0.1);
  --border-strong: rgba(0, 0, 0, 0.2);
  
  --text-base: #1f2937;
  --text-muted: #6b7280;
}
```

### 10.2 主题切换

```typescript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme')
  const next = current === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
}
```

---

## 11. 性能优化

### 11.1 虚拟化渲染

```typescript
// 只渲染可视区域内的节点
const visibleNodes = computed(() => {
  const viewport = {
    left: -offsetX.value / scale.value,
    top: -offsetY.value / scale.value,
    right: (canvasWidth.value - offsetX.value) / scale.value,
    bottom: (canvasHeight.value - offsetY.value) / scale.value,
  }
  
  return nodes.value.filter(node => {
    return node.x < viewport.right &&
           node.x + node.w > viewport.left &&
           node.y < viewport.bottom &&
           node.y + node.h > viewport.top
  })
})
```

### 11.2 拖拽节流

```typescript
import { throttle } from 'lodash-es'

const handleDragMove = throttle((event: MouseEvent) => {
  // 拖拽逻辑
}, 16) // 约 60fps
```

### 11.3 防抖保存

```typescript
const saveSchema = debounce(async () => {
  await api.save(designerStore.schema)
}, 1000)
```

---

## 12. 快捷键系统

```typescript
const shortcuts = {
  'Ctrl+Z': () => history.undo(),
  'Ctrl+Y': () => history.redo(),
  'Ctrl+S': () => save(),
  'Ctrl+Shift+S': () => saveAs(),
  'Delete': () => deleteSelected(),
  'Ctrl+C': () => copy(),
  'Ctrl+V': () => paste(),
  'Ctrl+D': () => duplicate(),
  'Ctrl+A': () => selectAll(),
  'Escape': () => deselect(),
  'Ctrl+G': () => group(),
  'Ctrl+Shift+G': () => ungroup(),
  'Ctrl+P': () => preview(),
  'Ctrl+0': () => zoomFit(),
  'Ctrl+1': () => zoom100(),
  'Space': () => enablePanMode(),
}

useMagicKeys(shortcuts)
```

---

## 13. 错误边界

```vue
<template>
  <ErrorBoundary v-slot="{ error }">
    <template v-if="error">
      <div class="error-boundary">
        <h3>组件渲染失败</h3>
        <p>{{ error.message }}</p>
        <button @click="retry">重试</button>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </ErrorBoundary>
</template>
```

```css
.error-boundary {
  background: rgba(255, 64, 129, 0.1);
  border: 2px solid var(--color-error);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  text-align: center;
}
```

---

## 14. 响应式适配

```css
/* 小屏幕隐藏物料面板 */
@media (max-width: 1024px) {
  .materials-panel {
    position: absolute;
    left: 0;
    top: 48px;
    bottom: 0;
    transform: translateX(-100%);
    transition: transform 0.3s;
    z-index: 100;
  }
  
  .materials-panel.open {
    transform: translateX(0);
  }
}

/* 移动端优化 */
@media (max-width: 640px) {
  .top-bar {
    padding: 0 var(--space-2);
  }
  
  .toolbar-btn span {
    display: none;
  }
  
  .properties-panel {
    position: absolute;
    right: 0;
    top: 48px;
    bottom: 0;
    transform: translateX(100%);
  }
  
  .properties-panel.open {
    transform: translateX(0);
  }
}
```

---

## 15. 交付清单

### 15.1 必须实现的功能

- [x] 三栏布局框架
- [ ] 顶部工具栏（保存/撤销/预览/发布）
- [ ] 物料面板（6 大分类 + 搜索）
- [ ] 画布引擎（缩放/平移/网格/标尺）
- [ ] 拖拽系统（物料拖入 + 画布移动）
- [ ] 属性面板（3 个 Tab）
- [ ] 图层面板（树形结构 + 拖拽排序）
- [ ] 快捷键系统
- [ ] 主题切换

### 15.2 性能指标

- 首屏加载 < 3s
- 拖拽帧率 > 60fps
- 面板切换 < 200ms
- 支持 200+ 节点流畅渲染

### 15.3 质量标准

- TypeScript 严格模式
- 组件 100% 类型覆盖
- ESLint + Prettier 零警告
- 响应式支持移动端
