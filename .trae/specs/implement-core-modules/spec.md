# 并行实现核心模块 Spec

## Why

当前项目需要并行推进三个核心功能模块的开发，以加速产品交付：
1. **标题框组件** - 大屏标题展示的核心装饰组件
2. **数据源引擎** - 为所有组件提供动态数据支持
3. **图引擎集成** - 实现组件间的数据流可视化连接

## What Changes

### 1️⃣ 标题框组件（8 个）

- BaseTitleBox - 基础标题框（简洁风格）
- TechTitleBox - 科技风格标题框（带图标和装饰）
- GradientTitleBox - 渐变背景标题框
- TitleBox3D - 3D 立体效果标题框
- HoverTitleBox - 悬浮交互标题框（阴影效果）
- ComboTitleBox - 组合布局标题框（多行标题）
- DecoTitleBox - 装饰元素标题框
- CustomTitleBox - 高度自定义标题框

### 2️⃣ 数据源引擎

- DataSource 接口定义（统一数据源抽象）
- DataSourceFactory 工厂模式
- DataSourceRegistry 注册中心
- REST API 适配器（轮询、重试、超时）
- WebSocket 适配器（重连、心跳、消息队列）
- 数据源状态管理（Pinia Store）

### 3️⃣ 图引擎集成

- @vue-flow/core 集成
- VueFlowWrapper 组件封装
- 坐标转换系统（画布↔VueFlow）
- Port 连接点系统（输入/输出/双向）
- 连线拖拽功能
- 节点同步（Schema↔Flow）

## Impact

- **Affected specs**: core-features-complete（任务 5、11-20）
- **Affected code**:
  - `packages/components/src/titles/` - 新建标题框组件
  - `packages/core/src/datasource/` - 新建数据源引擎
  - `apps/designer/src/components/topology/` - 图引擎组件
  - `apps/designer/src/stores/` - 数据源状态管理

## ADDED Requirements

### Requirement: 标题框组件系统

系统 SHALL 提供 8 种标题框组件，支持多种视觉风格：

#### 场景：基础标题框
- **WHEN** 用户使用 BaseTitleBox
- **THEN** 显示简洁的标题框，支持主标题和副标题

#### 场景：科技风格标题框
- **WHEN** 用户使用 TechTitleBox
- **THEN** 显示带图标和装饰线条的科技风格标题框

#### 场景：渐变背景标题框
- **WHEN** 用户使用 GradientTitleBox
- **THEN** 显示渐变背景的标题框，支持自定义渐变方向和颜色

#### 场景：3D 立体效果标题框
- **WHEN** 用户使用 TitleBox3D
- **THEN** 显示带 3D 阴影和透视效果的标题框

### Requirement: 数据源引擎

系统 SHALL 提供统一的数据源抽象和多种适配器：

#### 场景：REST API 数据源
- **WHEN** 用户配置 REST API 数据源
- **THEN** 系统支持 GET/POST 请求、轮询、重试、超时控制

#### 场景：WebSocket 数据源
- **WHEN** 用户配置 WebSocket 数据源
- **THEN** 系统支持 Topic 订阅、断线重连、心跳检测

#### 场景：数据源状态管理
- **WHEN** 数据源连接状态变化
- **THEN** 系统更新状态指示器并通知相关组件

### Requirement: 图引擎集成

系统 SHALL 集成 @vue-flow/core 实现数据流可视化：

#### 场景：Port 连接点
- **WHEN** 用户将鼠标悬停在组件边缘
- **THEN** 显示可用的 Port 连接点

#### 场景：连线拖拽
- **WHEN** 用户从 Port 拖拽连线
- **THEN** 系统创建 Edge 连接两个组件

#### 场景：坐标转换
- **WHEN** 用户在画布上操作图节点
- **THEN** 系统正确转换画布坐标和 VueFlow 坐标

## MODIFIED Requirements

无

## REMOVED Requirements

无

## Technical Decisions

### 标题框组件实现方案

**决策**：使用 Vue 3 Composition API + SVG + CSS 动画

**架构**：
```
packages/components/src/titles/
├── BaseTitleBox.vue      # 基础标题框
├── TechTitleBox.vue      # 科技风格
├── GradientTitleBox.vue  # 渐变背景
├── TitleBox3D.vue        # 3D 立体
├── HoverTitleBox.vue     # 悬浮交互
├── ComboTitleBox.vue     # 组合布局
├── DecoTitleBox.vue      # 装饰元素
├── CustomTitleBox.vue    # 高度自定义
└── index.ts              # 导出
```

### 数据源引擎实现方案

**决策**：工厂模式 + 适配器模式 + Pinia 状态管理

**架构**：
```
packages/core/src/datasource/
├── types.ts              # 接口定义
├── factory.ts            # 数据源工厂
├── registry.ts           # 注册中心
├── adapters/
│   ├── rest.ts           # REST API 适配器
│   └── websocket.ts      # WebSocket 适配器
└── index.ts              # 导出

apps/designer/src/stores/
└── datasource.ts         # 数据源状态管理
```

### 图引擎实现方案

**决策**：@vue-flow/core 封装 + 自定义 Port 系统

**架构**：
```
apps/designer/src/components/topology/
├── VueFlowWrapper.vue    # VueFlow 封装
├── GraphNode.vue         # 图节点组件
├── WidgetNode.vue        # 组件节点
├── Port.vue              # 连接点组件
├── Edge.vue              # 连线组件
└── TopologyCanvas.vue    # 拓扑画布
```

## Acceptance Criteria

### 标题框组件验收标准

- [ ] 8 个标题框组件全部实现
- [ ] 所有组件支持主标题和副标题
- [ ] 所有组件支持自定义颜色和尺寸
- [ ] 所有组件在物料面板中可拖拽使用

### 数据源引擎验收标准

- [ ] DataSource 接口定义完整
- [ ] REST API 适配器支持轮询和重试
- [ ] WebSocket 适配器支持重连和心跳
- [ ] 数据源状态管理正常工作

### 图引擎集成验收标准

- [ ] VueFlow 正确集成
- [ ] Port 连接点可拖拽连线
- [ ] 坐标转换正确
- [ ] 节点同步正常
