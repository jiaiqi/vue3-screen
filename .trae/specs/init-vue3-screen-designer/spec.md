# Vue3 工业级低代码大屏设计器 Spec

## Why

面向企业级用户的 SaaS / 私有化部署可视化大屏设计平台，支持非技术人员通过拖拽配置完成数据大屏及工业拓扑图的设计、数据绑定与发布全流程，替代传统定制开发模式，降低 80% 开发成本。

## What Changes

### 核心能力
- **低代码设计**：所见即所得可视化编辑器，组件拖拽、属性配置、样式调整
- **混合画布**：大屏 Widget 与拓扑图元在同一画布共存，图元间可连线并附加工业动画效果
- **多源数据融合**：REST/WebSocket/数据库/MQTT 统一适配，JS 过滤器沙箱处理
- **企业级扩展**：插件机制、自定义组件/图元注册、主题系统、RBAC 权限

### 技术栈
- Vue 3.5+ / Vite 6.x / TypeScript 5.x
- Pinia 状态管理 / Vue Router 4.x
- Element Plus UI 框架
- ECharts 5 图表库
- @vue-flow/core 拓扑引擎
- Konva.js Canvas 引擎
- UnoCSS 原子化 CSS
- pnpm + Turborepo Monorepo

### 架构层次
1. **Presentation Layer** — 设计器 | 预览器 | 发布端 | 管理后台 | 嵌入 SDK
2. **Designer Core** — 画布引擎 | 拖拽系统 | 属性面板 | 图层管理 | Undo/Redo
3. **Hybrid Canvas Layer** — Vue Flow 图引擎 | SVG 连线动画层 | 图元节点系统
4. **Component System** — 基础图表 | 地图 | 媒体/装饰 | 工业图元库 | 自定义组件
5. **Data Layer** — 数据源管理 | 数据适配器 | JS 过滤器 | 实时推送引擎
6. **Infrastructure** — Schema v2.1 | 插件系统 | 主题引擎 | 事件总线

## Impact

- Affected specs: 全新项目，无现有规范
- Affected code: Monorepo 结构，包含 apps/ 和 packages/ 目录

## ADDED Requirements

### Requirement: Monorepo 项目初始化

系统 SHALL 提供 pnpm + Turborepo 的 Monorepo 项目结构。

#### Scenario: 项目结构创建
- **WHEN** 初始化项目
- **THEN** 创建以下目录结构：
  - apps/designer — 设计器主应用
  - apps/renderer — 发布端渲染器
  - packages/core — 核心引擎
  - packages/components — 组件库
  - packages/graph-nodes — 拓扑图元库
  - packages/edge-animations — 连线动画包
  - packages/data-center — 数据源引擎

### Requirement: 设计器主应用

系统 SHALL 提供完整的设计器应用，包含画布引擎、拖拽系统、属性面板、图层管理。

#### Scenario: 设计器初始化
- **WHEN** 用户启动设计器
- **THEN** 显示主界面，包含物料面板、画布区域、属性面板、图层面板

### Requirement: 画布引擎

系统 SHALL 提供基于 CSS Transform 的坐标系管理，支持自适应缩放、标尺辅助线、多分辨率预设。

#### Scenario: 画布操作
- **WHEN** 用户操作画布
- **THEN** 支持缩放、平移、网格吸附、辅助线对齐

### Requirement: 拖拽系统

系统 SHALL 提供完整的拖拽功能，支持物料拖入画布、画布内节点移动、多选批量操作。

#### Scenario: 组件拖入
- **WHEN** 用户从物料面板拖拽组件到画布
- **THEN** 组件正确放置在画布上，支持网格吸附

### Requirement: 属性面板

系统 SHALL 提供基于 JSON Schema 自动生成的属性配置面板，支持 40+ 种控件类型。

#### Scenario: 属性配置
- **WHEN** 用户选中组件
- **THEN** 属性面板显示该组件的可配置属性，支持实时预览

### Requirement: 历史记录系统

系统 SHALL 提供基于 Command Pattern 的撤销/重做功能。

#### Scenario: 操作撤销
- **WHEN** 用户执行 Ctrl+Z
- **THEN** 撤销上一步操作，恢复到之前状态

### Requirement: 组件库

系统 SHALL 提供 80+ 内置组件，包含图表类、地图类、数据类、装饰类、容器类、媒体类。

#### Scenario: 组件渲染
- **WHEN** 组件放置在画布上
- **THEN** 正确渲染组件，支持数据绑定和样式配置

### Requirement: 数据源引擎

系统 SHALL 支持 REST API、WebSocket、数据库直连、MQTT 等多种数据源类型。

#### Scenario: 数据绑定
- **WHEN** 用户配置数据源并绑定到组件
- **THEN** 组件实时显示数据，支持自动刷新

### Requirement: 混合画布

系统 SHALL 支持大屏 Widget 与拓扑图元在同一画布共存，支持连线动画。

#### Scenario: 拓扑连线
- **WHEN** 用户在拓扑模式下连接两个图元
- **THEN** 创建带动画效果的连线，支持数据驱动

### Requirement: Schema 规范

系统 SHALL 使用 Schema v2.1 作为唯一交换格式，支持版本迁移。

#### Scenario: Schema 保存
- **WHEN** 用户保存大屏
- **THEN** 生成符合 v2.1 规范的 JSON Schema

### Requirement: UI/UX 设计

系统 SHALL 使用 ui-ux-pro-max skill 生成设计系统，确保专业的视觉效果。

#### Scenario: 设计系统生成
- **WHEN** 开发页面
- **THEN** 遵循 ui-ux-pro-max 生成的设计系统规范
