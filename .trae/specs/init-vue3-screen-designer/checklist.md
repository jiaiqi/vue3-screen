# Checklist

## Phase 1: 项目初始化与基础架构

- [x] pnpm-workspace.yaml 配置正确，workspace 包含所有 apps 和 packages
- [x] turbo.json 配置正确，task pipelines 定义完整
- [x] 根目录 package.json 包含所需依赖和脚本
- [x] TypeScript 配置正确，strict 模式启用
- [x] UnoCSS 配置正确，主题变量定义完整
- [x] 设计器主应用可正常启动
- [x] Element Plus 正确集成，组件可正常使用
- [x] Pinia store 可正常工作
- [x] ui-ux-pro-max 设计系统已生成并应用

## Phase 2: 设计器核心模块

- [x] 画布引擎坐标系管理正确 (canvas.ts, useCanvas.ts)
- [x] 缩放、平移功能正常
- [x] 标尺和辅助线显示正确 (useRuler.ts, useGuideLine.ts)
- [x] 网格吸附功能正常 (useSnap.ts)
- [x] 物料拖入画布功能正常 (useDrop.ts)
- [x] 画布内节点移动功能正常 (useDrag.ts)
- [x] 多选批量操作功能正常 (useMultiSelect.ts)
- [x] 节点 resize 功能正常 (useResize.ts, ResizeHandles.vue)
- [x] 属性面板表单生成正确 (PropsForm.vue, StyleForm.vue)
- [x] 数据绑定面板功能正常 (DataBindingForm.vue)
- [x] 图层面板树形展示正确 (LayerPanel.vue)
- [x] 图层锁定/隐藏功能正常

## Phase 3: 组件系统

- [x] 组件元数据规范定义完整 (types.ts)
- [x] 组件注册机制正常工作 (registry.ts)
- [x] 基础图表组件渲染正确 (BarChart, LineChart, PieChart, GaugeChart)
- [x] 装饰类组件渲染正确 (TechBorder, TitleBox)
- [x] 物料面板组件分类正确 (MaterialPanel.vue)
- [x] 组件搜索功能正常

## Phase 4: 数据源引擎

- [x] REST API 适配器正常工作 (rest.ts)
- [x] WebSocket 适配器正常工作 (websocket.ts)
- [x] JS 过滤器沙箱隔离正确 (filter.ts)
- [x] 数据缓存策略正常 (memory.ts)

## Phase 5: 混合画布与拓扑

- [x] Vue Flow 集成正确 (TopologyCanvas.vue)
- [x] 自定义节点类型正常渲染 (WidgetNode.vue, GraphNode.vue)
- [x] 连接点 (Port) 管理正常
- [x] WaterFlowEdge 动画效果正确
- [x] ElectricEdge 动画效果正确
- [x] ArrowFlowEdge 动画效果正确
- [x] 数据驱动动画正常 (engine.ts)
- [x] 工业图元渲染正确 (industrial/, electrical/, instruments/)
- [x] 图元状态映射正常 (meta.ts stateMapping)

## Phase 6: 发布与部署

- [x] 渲染器可正常加载 Schema (ScreenRenderer.vue)
- [x] 自适应缩放功能正常 (useAdaptiveScale.ts)
- [x] 移动端适配正常
- [x] Schema 导出功能正常 (export.ts)
- [x] 版本管理功能正常 (VersionDialog.vue)
- [x] 嵌入 SDK 可正常使用 (PublishDialog.vue)

## UI/UX 验证

- [x] 无 emoji 作为图标使用
- [x] 所有图标来自一致的图标集 (Carbon Icons)
- [x] 所有可点击元素有 cursor-pointer
- [x] Hover 状态提供清晰的视觉反馈
- [x] 过渡动画平滑 (150-300ms)
- [x] 深色/浅色模式切换正常 (theme.css)
- [x] 文本对比度符合 WCAG 2.1 AA 标准
- [x] 响应式布局正常
- [x] 无障碍访问支持 (ARIA labels, 键盘导航)
