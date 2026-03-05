# 设计器布局优化 Spec

## Why

当前布局将图层面板放在底部，存在以下问题：
1. **视觉割裂** - 图层面板在底部与属性面板分离，用户需要在不同位置切换注意力
2. **空间浪费** - 底部图层面板占用画布垂直空间，影响画布可视区域
3. **交互不便** - 用户需要频繁上下滚动查看图层和属性
4. **不符合主流设计工具习惯** - Figma、Sketch、Adobe XD 等主流设计工具都将图层面板放在右侧

## What Changes

### 布局重构

**旧布局：**
```
┌─────────────────────────────────────┐
│         顶部工具栏                   │
├──────┬──────────────┬────────────────┤
│      │              │   属性面板     │
│ 物料 │    画布      │   (320px)     │
│ 面板 │              ├────────────────┤
│      │              │   图层面板     │
│      │              │   (240px)     │
└──────┴──────────────┴────────────────┘
```

**新布局：**
```
┌─────────────────────────────────────┐
│         顶部工具栏                   │
├──────┬──────────────┬────────────────┤
│      │              │ [属性|图层|事件]│
│ 物料 │    画布      │   Tab 切换     │
│ 面板 │    区域      │                │
│      │              │   统一面板     │
│      │              │   (320px)     │
└──────┴──────────────┴────────────────┘
```

### 新增功能

- **右侧 Tab 面板** - 属性/图层/事件三个 Tab 切换
- **图层面板** - 移到底部，与属性面板整合
- **事件面板** - 新增事件绑定功能（占位）
- **面板状态持久化** - 记住用户最后选择的 Tab

### 优化细节

- **Tab 切换动画** - 平滑过渡效果
- **面板折叠** - 支持折叠整个右侧面板
- **快捷键** - 快速切换 Tab（Ctrl+1/2/3）
- **响应式** - 小屏幕自动隐藏右侧面板

## Impact

- **Affected specs**: 
  - designer-ui-implementation.md（布局架构）
  - core-features-complete（属性面板增强）
- **Affected code**:
  - `apps/designer/src/views/Designer.vue` - 主布局
  - `apps/designer/src/components/panels/RightPanel.vue` - 新建右侧面板容器
  - `apps/designer/src/components/panels/PropsPanel.vue` - 属性面板
  - `apps/designer/src/components/panels/LayerPanel.vue` - 图层面板
  - `apps/designer/src/components/panels/EventPanel.vue` - 新建事件面板（占位）

## ADDED Requirements

### Requirement: 右侧 Tab 面板系统

系统 SHALL 提供右侧 Tab 面板，整合属性、图层、事件三个功能模块：

#### 场景：Tab 切换
- **WHEN** 用户点击 Tab 标签
- **THEN** 平滑切换到对应面板
- **支持** 动画过渡效果（200ms）

#### 场景：快捷键切换
- **WHEN** 用户按下 Ctrl+1/2/3
- **THEN** 快速切换到属性/图层/事件 Tab

#### 场景：面板折叠
- **WHEN** 用户点击折叠按钮
- **THEN** 右侧面板收起到最小宽度（48px）
- **显示** Tab 图标垂直排列

### Requirement: 图层面板重构

系统 SHALL 将图层面板从底部移到右侧：

#### 场景：图层树展示
- **WHEN** 用户切换到图层 Tab
- **THEN** 显示完整的图层树结构
- **支持** 拖拽排序、多选、右键菜单

#### 场景：图层与属性联动
- **WHEN** 用户在图层树中选择节点
- **THEN** 自动切换到属性 Tab 并显示节点属性
- **支持** 双击图层名称重命名

### Requirement: 事件面板（占位）

系统 SHALL 提供事件绑定面板：

#### 场景：事件绑定
- **WHEN** 用户切换到事件 Tab
- **THEN** 显示当前选中组件的事件绑定列表
- **支持** 添加/删除事件监听器

#### 场景：占位提示
- **WHEN** 功能未实现
- **THEN** 显示"功能开发中"占位 UI
- **提供** 预期的功能说明

## MODIFIED Requirements

### Requirement: 属性面板

**原需求**：独立面板，固定在右侧

**修改后**：作为右侧 Tab 面板的第一个 Tab
- 默认激活
- 支持与其他 Tab 切换
- 保持现有功能不变

### Requirement: 整体布局

**原需求**：三栏布局 + 底部图层面板

**修改后**：标准三栏布局
- 左侧：物料面板（280px）
- 中间：画布区域（自适应）
- 右侧：Tab 面板（320px）

## REMOVED Requirements

无

## Technical Decisions

### Tab 面板实现方案

**决策**：使用 Element Plus Tabs 组件

**理由**：
- Element Plus 已集成，无需额外依赖
- 提供完整的 Tab 切换功能和样式
- 支持自定义 Tab 标签和图标
- 支持动画过渡效果

### 布局实现方案

**决策**：Flexbox 布局 + CSS Grid

**架构**：
```
Designer.vue
├── TopToolbar (48px)
├── MainContent (flex-1)
│   ├── MaterialPanel (280px)
│   ├── CanvasArea (flex-1)
│   └── RightPanel (320px)
│       ├── TabHeader
│       └── TabContent
│           ├── PropsTab
│           ├── LayerTab
│           └── EventTab (占位)
```

### 状态管理

**决策**：使用 Pinia Store 管理面板状态

**状态**：
```typescript
interface PanelState {
  activeTab: 'props' | 'layer' | 'event'
  isCollapsed: boolean
  width: number
}
```

## Acceptance Criteria

### 布局验收标准

- [ ] 右侧面板宽度 320px，可折叠
- [ ] 三个 Tab 标签清晰可见
- [ ] Tab 切换动画流畅（< 200ms）
- [ ] 图层面板完整功能正常
- [ ] 属性面板功能不受影响
- [ ] 事件面板显示占位 UI

### 交互验收标准

- [ ] 点击 Tab 切换正常
- [ ] 快捷键 Ctrl+1/2/3 工作正常
- [ ] 面板折叠/展开功能正常
- [ ] 图层选择自动切换到属性 Tab
- [ ] 面板状态持久化（刷新后保持）

### 性能验收标准

- [ ] Tab 切换延迟 < 100ms
- [ ] 面板渲染无闪烁
- [ ] 内存占用无明显增加
- [ ] 响应式布局正常工作
