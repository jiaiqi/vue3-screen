# 混合画布与工业图元系统 Spec

## Why

当前实现仅完成了基础的大屏设计器框架，但设计文档核心要求的**混合画布架构**、**工业图元系统**、**SVG 连线与动画引擎**等关键功能完全缺失。这些是工业级低代码大屏设计器区别于普通大屏制作工具的核心竞争力。

## What Changes

### 核心新增功能

- **混合画布架构**：实现 DOM 节点层 + SVG 连线层的双层渲染架构
- **拓扑图引擎**：集成 @vue-flow/core，支持图元节点和连线
- **工业图元库**：实现 500+ 工业图元（泵、阀门、电机、传感器等）
- **Edge 连线系统**：支持水流、电流、箭头、粒子等 8+ 种动画效果
- **完整拖拽系统**：5 类场景分别采用最优方案（原生 DnD、VueUse、vue-draggable-plus 等）
- **对齐分布工具栏**：12 种对齐/分布操作
- **图层打组**：Ctrl+G 打组、组嵌套、相对坐标
- **完整快捷键系统**：设计文档定义的所有快捷键
- **JSON Schema 表单生成**：属性面板根据 schema 自动生成 40+ 种控件
- **数据源引擎**：REST、WebSocket、数据库、MQTT 等 10+ 种数据源适配器
- **事件交互系统**：事件绑定、动作执行、联动过滤

### UI/UX 改进

- **专业图标系统**：使用 Iconify (Carbon Icons + MDI)，完全替换 emoji
- **工业科技风格**：完全匹配设计文档的深色主题、流光边框、粒子背景
- **鸟瞰图导航**：右下角缩略图快速定位

## Impact

- Affected specs: `implement-designer-core`
- Affected code: 
  - `apps/designer/src/views/Designer.vue` — 完全重构为混合画布布局
  - `apps/designer/src/components/canvas/` — 新增混合画布组件
  - `apps/designer/src/components/graph-nodes/` — 新增工业图元组件
  - `apps/designer/src/components/edges/` — 新增 Edge 动画组件
  - `apps/designer/src/composables/` — 新增 5 类拖拽 composable
  - `apps/designer/src/stores/` — 新增图元、连线、事件管理
  - `packages/core/src/schema/` — 扩展 Schema v2.1 支持图元和连线
  - `packages/core/src/data-center/` — 新增数据源适配器
  - `packages/graph-nodes/` — 新增 500+ 工业图元
  - `packages/edge-animations/` — 新增 8+ 连线动画类型

## ADDED Requirements

### Requirement: 混合画布架构

系统 SHALL 实现四层渲染架构：
- Layer 4: 交互层（选择框、ResizeHandle、Port、辅助线）
- Layer 3: 节点层（DOM，Widget Node + Graph Node）
- Layer 2: 连线层（SVG，Edge 路径 + 动画）
- Layer 1: 背景层（背景色/图、网格、标尺）

#### Scenario: 混合画布初始化
- **WHEN** 设计器加载
- **THEN** 创建四层渲染容器，共享同一坐标系

#### Scenario: 坐标系统一
- **WHEN** 画布缩放/平移
- **THEN** 所有层同步变换，连线端点始终对准 Port

### Requirement: 拓扑图引擎集成

系统 SHALL 集成 @vue-flow/core 作为图引擎。

#### Scenario: 图元节点创建
- **WHEN** 用户从物料面板拖入图元
- **THEN** 创建 Vue Flow Node，使用自定义 Vue 组件渲染

#### Scenario: 连线拖拽
- **WHEN** 用户从 Port 拖出连线
- **THEN** 实时显示连线路径，支持正交/直线/曲线

#### Scenario: 连线动画
- **WHEN** 连线创建后配置动画
- **THEN** 支持水流、电流、箭头、粒子等 8+ 种动画

### Requirement: 工业图元库 (500+)

系统 SHALL 提供 500+ 工业图元组件。

#### Scenario: 图元分类
- **WHEN** 物料面板加载
- **THEN** 显示分类：工业设备、电气设备、仪器仪表、管道阀门、建筑设施

#### Scenario: 图元渲染
- **WHEN** 图元放置在画布
- **THEN** 使用 SVG 渲染，支持 fill/stroke 动态绑定

### Requirement: Edge 连线动画引擎

系统 SHALL 提供 8+ 种连线动画效果。

#### Scenario: 水流动画
- **WHEN** 配置为水流动画
- **THEN** 显示蓝色流体动画，速度可配

#### Scenario: 电流动画
- **WHEN** 配置为电流动画
- **THEN** 显示闪烁的电流效果

#### Scenario: 箭头动画
- **WHEN** 配置为箭头动画
- **THEN** 显示动态箭头流动

### Requirement: 完整拖拽系统

系统 SHALL 实现 5 类拖拽场景的分场景处理。

#### Scenario: 物料→画布拖入
- **WHEN** 用户拖拽物料到画布
- **THEN** 使用原生 HTML5 DnD，显示 Ghost 预览

#### Scenario: 画布内自由移动
- **WHEN** 用户拖动节点
- **THEN** 使用 VueUse useDraggable，支持多选批量移动

#### Scenario: 图层排序
- **WHEN** 用户拖拽图层项
- **THEN** 使用 vue-draggable-plus，数组直接更新

#### Scenario: 图元连线拖出
- **WHEN** 用户从 Port 拖出连线
- **THEN** 使用 Vue Flow Handle 系统

#### Scenario: 节点 resize
- **WHEN** 用户拖拽 resize 手柄
- **THEN** 使用 Interactjs，支持锁定宽高比

### Requirement: 对齐分布工具栏

系统 SHALL 提供 12 种对齐/分布操作。

#### Scenario: 水平对齐
- **WHEN** 多选节点并点击左对齐
- **THEN** 所有节点左边缘对齐到最左节点

#### Scenario: 垂直分布
- **WHEN** 多选节点并点击垂直等间距
- **THEN** 节点垂直方向等间距分布

### Requirement: 图层打组

系统 SHALL 支持节点打组功能。

#### Scenario: 创建组
- **WHEN** 多选节点并按 Ctrl+G
- **THEN** 创建组节点，子节点坐标转为相对坐标

#### Scenario: 组嵌套
- **WHEN** 组内再打组
- **THEN** 支持无限层级嵌套

### Requirement: 完整快捷键系统

系统 SHALL 实现设计文档定义的所有快捷键。

### Requirement: JSON Schema 表单生成

系统 SHALL 根据 propsSchema/styleSchema/dataSchema 自动生成表单。

#### Scenario: 属性表单生成
- **WHEN** 选中组件
- **THEN** 根据其 propsSchema 生成 40+ 种控件

### Requirement: 数据源引擎

系统 SHALL 提供 10+ 种数据源适配器。

#### Scenario: REST 数据源
- **WHEN** 配置 REST 数据源
- **THEN** 支持 GET/POST、自定义头、轮询、重试

#### Scenario: WebSocket 数据源
- **WHEN** 配置 WebSocket 数据源
- **THEN** 支持断线重连、Topic 订阅

### Requirement: 事件交互系统

系统 SHALL 实现事件绑定和动作执行。

#### Scenario: 点击联动
- **WHEN** 配置点击事件
- **THEN** 点击组件 A，更新组件 B 的数据

## MODIFIED Requirements

### Requirement: Designer.vue 主布局重构

原有的简单三栏布局 SHALL 重构为混合画布布局。

### Requirement: Schema v2.1 扩展

原有的 Schema 仅支持 Widget 节点， SHALL 扩展支持 Graph 节点和 Edge 连线。

## REMOVED Requirements

无
