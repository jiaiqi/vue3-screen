# Tasks

## 模块 1：标题框组件（8 个）

- [x] Task 1.1: 创建 BaseTitleBox 基础标题框组件
- [x] Task 1.2: 创建 TechTitleBox 科技风格标题框组件
- [x] Task 1.3: 创建 GradientTitleBox 渐变背景标题框组件
- [x] Task 1.4: 创建 TitleBox3D 3D 立体效果标题框组件
- [x] Task 1.5: 创建 HoverTitleBox 悬浮交互标题框组件
- [x] Task 1.6: 创建 ComboTitleBox 组合布局标题框组件
- [x] Task 1.7: 创建 DecoTitleBox 装饰元素标题框组件
- [x] Task 1.8: 创建 CustomTitleBox 高度自定义标题框组件
- [x] Task 1.9: 创建标题框组件导出和注册

## 模块 2：数据源引擎

- [x] Task 2.1: 定义 DataSource 接口类型
- [x] Task 2.2: 实现 DataSourceFactory 工厂类
- [x] Task 2.3: 实现 DataSourceRegistry 注册中心
- [x] Task 2.4: 实现 REST API 适配器（轮询、重试、超时）
- [x] Task 2.5: 实现 WebSocket 适配器（重连、心跳）
- [x] Task 2.6: 创建数据源 Pinia Store

## 模块 3：图引擎集成

- [x] Task 3.1: 创建 VueFlowWrapper 组件封装（TopologyCanvas.vue 已实现）
- [x] Task 3.2: 实现坐标转换系统（useTopology.ts + TopologyCanvas.vue）
- [x] Task 3.3: 创建 Port 连接点组件（Port.vue 已实现）
- [x] Task 3.4: 创建 Edge 连线组件（Edge.vue 已实现）
- [x] Task 3.5: 实现连线拖拽功能（GraphNode.vue + Port.vue 已实现）
- [x] Task 3.6: 实现节点同步（Schema↔Flow）（TopologyCanvas.vue computed 已实现）

# Task Dependencies

- 模块 1、2、3 可并行执行，无依赖关系
- Task 1.9 依赖 Task 1.1-1.8
- Task 2.2、2.3 依赖 Task 2.1
- Task 2.4、2.5 依赖 Task 2.2
- Task 2.6 依赖 Task 2.1-2.5
- Task 3.2-3.6 依赖 Task 3.1
