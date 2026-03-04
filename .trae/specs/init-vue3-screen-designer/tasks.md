# Tasks

## Phase 1: 项目初始化与基础架构

- [x] Task 1: 初始化 Monorepo 项目结构
  - [x] SubTask 1.1: 创建 pnpm-workspace.yaml 配置
  - [x] SubTask 1.2: 创建 turbo.json 配置
  - [x] SubTask 1.3: 创建根目录 package.json 和 TypeScript 配置
  - [x] SubTask 1.4: 配置 UnoCSS 和主题系统

- [x] Task 2: 初始化设计器主应用 (apps/designer)
  - [x] SubTask 2.1: 使用 npm create vue@latest 创建 Vue 3 项目
  - [x] SubTask 2.2: 配置 Vite 和 Vue Router
  - [x] SubTask 2.3: 集成 Element Plus UI 框架
  - [x] SubTask 2.4: 配置 Pinia 状态管理

- [x] Task 3: 初始化核心引擎包 (packages/core)
  - [x] SubTask 3.1: 创建 Schema v2.1 类型定义
  - [x] SubTask 3.2: 实现画布引擎核心逻辑
  - [x] SubTask 3.3: 实现历史记录系统 (Command Pattern)
  - [x] SubTask 3.4: 实现事件总线

- [x] Task 4: 使用 ui-ux-pro-max 生成设计系统
  - [x] SubTask 4.1: 运行 design-system 命令生成设计规范
  - [x] SubTask 4.2: 创建主题 CSS 变量
  - [x] SubTask 4.3: 配置深色/浅色主题切换

## Phase 2: 设计器核心模块

- [x] Task 5: 实现画布引擎
  - [x] SubTask 5.1: 实现坐标系管理 (scale, offset, transform)
  - [x] SubTask 5.2: 实现标尺和辅助线
  - [x] SubTask 5.3: 实现网格吸附
  - [x] SubTask 5.4: 实现鸟瞰图导航

- [x] Task 6: 实现拖拽系统
  - [x] SubTask 6.1: 实现物料面板拖入画布 (HTML5 DnD)
  - [x] SubTask 6.2: 实现画布内节点移动 (useDraggable)
  - [x] SubTask 6.3: 实现多选批量操作
  - [x] SubTask 6.4: 实现节点 resize 手柄

- [x] Task 7: 实现属性面板
  - [x] SubTask 7.1: 实现 JSON Schema 表单生成器
  - [x] SubTask 7.2: 实现 40+ 种控件类型
  - [x] SubTask 7.3: 实现样式配置面板
  - [x] SubTask 7.4: 实现数据绑定面板

- [x] Task 8: 实现图层面板
  - [x] SubTask 8.1: 实现树形结构展示
  - [x] SubTask 8.2: 实现图层排序 (vue-draggable-plus)
  - [x] SubTask 8.3: 实现图层锁定/隐藏
  - [x] SubTask 8.4: 实现搜索过滤

## Phase 3: 组件系统

- [x] Task 9: 初始化组件库 (packages/components)
  - [x] SubTask 9.1: 创建组件元数据规范
  - [x] SubTask 9.2: 实现组件注册机制
  - [x] SubTask 9.3: 创建基础图表组件 (ECharts 封装)
  - [x] SubTask 9.4: 创建装饰类组件

- [x] Task 10: 实现物料面板
  - [x] SubTask 10.1: 实现组件分类展示
  - [x] SubTask 10.2: 实现组件搜索
  - [x] SubTask 10.3: 实现组件预览

## Phase 4: 数据源引擎

- [x] Task 11: 初始化数据源引擎 (packages/data-center)
  - [x] SubTask 11.1: 实现 REST API 适配器
  - [x] SubTask 11.2: 实现 WebSocket 适配器
  - [x] SubTask 11.3: 实现 JS 过滤器沙箱
  - [x] SubTask 11.4: 实现数据缓存策略

## Phase 5: 混合画布与拓扑

- [x] Task 12: 集成 @vue-flow/core
  - [x] SubTask 12.1: 配置 Vue Flow 基础
  - [x] SubTask 12.2: 实现自定义节点类型
  - [x] SubTask 12.3: 实现连接点 (Port) 管理

- [x] Task 13: 实现连线动画 (packages/edge-animations)
  - [x] SubTask 13.1: 实现 WaterFlowEdge 水流动画
  - [x] SubTask 13.2: 实现 ElectricEdge 电流动画
  - [x] SubTask 13.3: 实现 ArrowFlowEdge 箭头流动
  - [x] SubTask 13.4: 实现数据驱动动画

- [x] Task 14: 实现工业图元库 (packages/graph-nodes)
  - [x] SubTask 14.1: 创建工艺设备图元
  - [x] SubTask 14.2: 创建仪表仪器图元
  - [x] SubTask 14.3: 创建电气设备图元
  - [x] SubTask 14.4: 实现图元状态映射

## Phase 6: 发布与部署

- [x] Task 15: 初始化渲染器 (apps/renderer)
  - [x] SubTask 15.1: 实现轻量化渲染器
  - [x] SubTask 15.2: 实现自适应缩放
  - [x] SubTask 15.3: 实现移动端适配

- [x] Task 16: 实现发布功能
  - [x] SubTask 16.1: 实现 Schema 导出
  - [x] SubTask 16.2: 实现版本管理
  - [x] SubTask 16.3: 实现嵌入 SDK

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2, Task 3]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 3]
- [Task 8] depends on [Task 5]
- [Task 9] depends on [Task 3]
- [Task 10] depends on [Task 9]
- [Task 11] depends on [Task 3]
- [Task 12] depends on [Task 5]
- [Task 13] depends on [Task 12]
- [Task 14] depends on [Task 12]
- [Task 15] depends on [Task 3, Task 9]
- [Task 16] depends on [Task 15]
