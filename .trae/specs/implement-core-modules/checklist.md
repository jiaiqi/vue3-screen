# Checklist

## 标题框组件验收
- [x] BaseTitleBox 组件实现并可用
- [x] TechTitleBox 组件实现并可用
- [x] GradientTitleBox 组件实现并可用
- [x] TitleBox3D 组件实现并可用
- [x] HoverTitleBox 组件实现并可用
- [x] ComboTitleBox 组件实现并可用
- [x] DecoTitleBox 组件实现并可用
- [x] CustomTitleBox 组件实现并可用
- [x] 所有标题框组件导出正确（index.ts）

## 数据源引擎验收
- [x] DataSource 接口定义完整（types.ts）
- [x] DataSourceFactory 正常工作（factory.ts）
- [x] DataSourceRegistry 正常工作（registry.ts）
- [x] REST API 适配器支持轮询(5s-5min)和重试(3次)
- [x] WebSocket 适配器支持重连和心跳
- [x] 数据源 Store 状态管理正常

## 图引擎集成验收
- [x] TopologyCanvas 组件正常渲染（VueFlow 封装）
- [x] 坐标转换正确（useTopology + computed）
- [x] Port 连接点可显示和交互
- [x] Edge 连线可创建（多种路径类型）
- [x] 连线拖拽功能正常（Handle + Port）
- [x] 节点同步正常（Schema ↔ Flow computed）

## 代码质量验收
- [x] 文件结构清晰
- [x] 组件导出正确
- [x] TypeScript 类型定义完整
- [x] 代码风格一致
