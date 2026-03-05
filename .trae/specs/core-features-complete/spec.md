# 核心功能完善 Spec

## Why

当前设计器已具备基础框架，但缺少核心功能：
1. **组件库不完整** - 只有基础组件，缺少 20+ 核心图表、装饰组件、数据组件
2. **数据源系统缺失** - 无法连接真实数据，缺少 REST/WebSocket 适配器和数据处理能力
3. **图引擎未集成** - 缺少 @vue-flow/core 集成，无法实现连线功能和工业图元

本 Spec 旨在完成这三大核心模块，使设计器达到可用状态。

## What Changes

### 新增功能

- **20+ 核心图表组件**：柱状图、折线图、饼图、仪表盘、雷达图、热力图等
- **装饰组件库**：科技边框、标题框、分隔线、背景装饰等
- **数据组件库**：数字卡片、数据表格、进度条、排行榜等
- **数据源引擎**：REST API、WebSocket、JSONPath、JS 过滤器
- **图引擎集成**：@vue-flow/core、连线系统、Port 连接点
- **边动画系统**：水流动画、电流动画、箭头动画等 8+ 种

### 修改内容

- **Canvas 组件** - 集成 @vue-flow/core 实现混合画布
- **Schema v2.1** - 扩展 GraphNode 和 Edge 类型
- **属性面板** - 新增数据绑定 Tab 和事件绑定 Tab
- **物料面板** - 新增工业图元和边动画分类

## Impact

- **Affected specs**: 
  - implement-hybrid-canvas (扩展图引擎)
  - implement-designer-core (完善组件库)
  - 新增 data-source-engine spec
- **Affected code**:
  - `packages/components/` - 新增大量组件
  - `packages/core/src/schema/` - 扩展类型定义
  - `apps/designer/src/components/canvas/` - 混合画布
  - `apps/designer/src/panels/PropsPanel.vue` - 新增数据绑定 Tab
  - 新增 `packages/data-center/` - 数据源引擎

## ADDED Requirements

### Requirement: 20+ 核心图表组件

系统 SHALL 提供以下图表组件：

#### 场景：基础图表
- **WHEN** 用户需要展示趋势数据
- **THEN** 可使用折线图、面积图、柱状图、条形图
- **支持** 多系列、堆叠、百分比模式

#### 场景：占比分析
- **WHEN** 用户需要展示占比关系
- **THEN** 可使用饼图、环形图、漏斗图、仪表盘
- **支持** 多数据源、动态更新

#### 场景：高级分析
- **WHEN** 用户需要多维度分析
- **THEN** 可使用雷达图、热力图、散点图、气泡图、K 线图
- **支持** 自定义坐标轴、数据缩放

### Requirement: 装饰组件库

系统 SHALL 提供以下装饰组件：

#### 科技边框
- 至少 10 种科技风格边框
- 支持流光动画、脉冲效果
- 可配置颜色、速度、方向

#### 标题框
- 至少 8 种标题框样式
- 支持图标、副标题、装饰元素
- 可配置字体、颜色、对齐方式

#### 背景装饰
- 渐变背景、粒子背景、网格背景
- 支持透明度、动画速度配置

### Requirement: 数据组件库

系统 SHALL 提供以下数据组件：

#### 数字卡片
- 支持前缀、后缀、单位
- 支持趋势箭头（上升/下降）
- 支持目标值、完成率计算

#### 数据表格
- 支持固定表头、滚动
- 支持条件格式（颜色、图标）
- 支持排序、分页

#### 进度条
- 支持环形、条形进度条
- 支持多段进度、渐变色
- 支持动画效果

### Requirement: 数据源引擎

系统 SHALL 提供完整的数据源管理系统：

#### REST API 适配器
- **WHEN** 用户需要连接 REST API
- **THEN** 可配置 URL、Method、Headers、Body
- **支持** 轮询（5s-5min）、重试机制（3 次）

#### WebSocket 适配器
- **WHEN** 用户需要实时数据
- **THEN** 可配置 WS 地址、Topic 订阅
- **支持** 断线重连、心跳检测

#### JSONPath 提取
- **WHEN** 用户需要提取嵌套数据
- **THEN** 可使用 JSONPath 表达式
- **支持** $、.、[]、* 等语法

#### JS 过滤器沙箱
- **WHEN** 用户需要数据转换
- **THEN** 可编写 JavaScript 代码
- **支持** 安全沙箱、超时保护（100ms）

### Requirement: 图引擎集成

系统 SHALL 集成 @vue-flow/core：

#### 混合画布架构
- **WHEN** 用户需要连线功能
- **THEN** 可在组件上添加 Port
- **支持** 从 Port 拖出连线、自动路径计算

#### 连线类型
- 支持直线、曲线、正交线（A*算法）
- 支持箭头、标签、自定义样式

### Requirement: 边动画系统

系统 SHALL 提供 8+ 种连线动画：

#### 水流动画
- 蓝色流体效果
- 速度可配置（0.1-10）
- 支持双向流动

#### 电流动画
- 闪烁前进效果
- 支持颜色、频率配置

#### 粒子动画
- 粒子沿路径运动
- 支持数量、大小、速度配置

## MODIFIED Requirements

### Requirement: 属性面板数据 Tab

**原需求**：简单的数据源选择

**修改后**：完整的数据绑定系统
- 数据源选择（REST/WebSocket/静态）
- JSONPath 提取器（带预览）
- JS 过滤器编辑器（Monaco）
- 字段映射配置
- 刷新频率设置
- 数据预览面板

### Requirement: 物料面板分类

**原需求**：基础分类（图表、装饰、数据）

**修改后**：详细分类
- 基础图表（10+）
- 高级图表（10+）
- 数据组件（10+）
- 装饰组件（20+）
- 工业图元（100+）
- 电气配图（80+）
- 仪器仪表（100+）
- 边动画（8+）

## REMOVED Requirements

无

## Technical Decisions

### 图表组件实现方案

**决策**：基于 ECharts 5 封装

**理由**：
- ECharts 功能强大、文档完善
- 支持 Vue 3 封装（vue-echarts）
- 性能优秀，支持大数据量
- 主题定制方便

### 数据源引擎架构

**决策**：适配器模式 + 工厂模式

**架构**：
```
DataSourceFactory
├── createRESTAdapter()
├── createWebSocketAdapter()
├── createMockAdapter()
└── createDatabaseAdapter()

DataPipeline
├── JSONPathExtractor
├── JSFilterSandbox
├── FieldMapper
└── CacheManager
```

### 图引擎选择

**决策**：@vue-flow/core

**对比**：
- **@vue-flow/core**：✅ Vue 3 原生、文档好、易扩展
- **vue-flow**：❌ 已废弃，迁移到@vue-flow
- **react-flow**：❌ React 版本
- **自定义**：❌ 工作量大、维护成本高

### 边动画实现方案

**决策**：SVG + CSS 动画

**理由**：
- SVG 路径精确控制
- CSS 动画性能好
- 可组合复杂效果
- 支持动态配置

## Acceptance Criteria

### 组件库验收标准

- [ ] 20+ 核心图表组件全部可用
- [ ] 10+ 装饰组件样式精美
- [ ] 10+ 数据组件功能完整
- [ ] 所有组件支持拖拽添加
- [ ] 所有组件支持属性配置
- [ ] 所有组件支持数据绑定

### 数据源引擎验收标准

- [ ] REST API 可正常请求和轮询
- [ ] WebSocket 可正常连接和重连
- [ ] JSONPath 提取准确
- [ ] JS 过滤器安全执行
- [ ] 数据实时更新（<100ms 延迟）

### 图引擎验收标准

- [ ] 可从 Port 拖出连线
- [ ] 连线自动计算路径
- [ ] 支持 8+ 种边动画
- [ ] 动画流畅（60fps）
- [ ] 支持数据绑定动画速度

### 性能验收标准

- [ ] 首屏加载 < 3s
- [ ] 拖拽帧率 > 60fps
- [ ] 支持 200+ 组件流畅渲染
- [ ] 数据更新延迟 < 100ms
