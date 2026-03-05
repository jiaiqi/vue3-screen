# Tasks

## Phase 1: 混合画布架构与图引擎集成

- [x] Task 1: 集成 @vue-flow/core
  - [x] SubTask 1.1: 安装 @vue-flow/core 及相关依赖
  - [x] SubTask 1.2: 创建 HybridCanvas 组件，整合 DOM 层和 SVG 层
  - [x] SubTask 1.3: 实现坐标转换函数（画布坐标 ↔ Vue Flow 坐标）
  - [x] SubTask 1.4: 实现四层渲染容器（背景层、节点层、连线层、交互层）

- [x] Task 2: 扩展 Schema v2.1
  - [x] SubTask 2.1: 添加 GraphNodeSchema 类型定义
  - [x] SubTask 2.2: 添加 EdgeSchema 类型定义
  - [x] SubTask 2.3: 添加 PortSchema 类型定义
  - [x] SubTask 2.4: 添加 nodeKind 字段区分 Widget/Graph

- [x] Task 3: 实现 Port 连接点系统
  - [x] SubTask 3.1: 创建 Port 组件（支持动态位置）
  - [x] SubTask 3.2: 实现连线拖拽（从 Port 拖出）
  - [x] SubTask 3.3: 实现连接验证（源/目标检查）
  - [x] SubTask 3.4: 实现连线自动路径计算（正交/直线/曲线）

## Phase 2: 工业图元库 (500+)

- [ ] Task 4: 实现工业设备图元 (100+)
  - [ ] SubTask 4.1: 泵类图元（离心泵、齿轮泵、柱塞泵等 20+）
  - [ ] SubTask 4.2: 风机图元（离心风机、轴流风机等 15+）
  - [ ] SubTask 4.3: 压缩机图元（往复式、离心式等 15+）
  - [ ] SubTask 4.4: 反应器图元（釜式、塔式等 20+）
  - [ ] SubTask 4.5: 储罐图元（立式、卧式、球罐等 30+）

- [ ] Task 5: 实现电气设配图元 (80+)
  - [ ] SubTask 5.1: 开关图元（断路器、隔离开关等 25+）
  - [ ] SubTask 5.2: 变压器图元（双绕组、三绕组等 15+）
  - [ ] SubTask 5.3: 电动机图元（交流、直流等 20+）
  - [ ] SubTask 5.4: 配电柜图元（MCC、PLC 柜等 20+）

- [ ] Task 6: 实现仪器仪表图元 (100+)
  - [ ] SubTask 6.1: 压力表图元（20+）
  - [ ] SubTask 6.2: 温度计图元（15+）
  - [ ] SubTask 6.3: 流量计图元（电磁、涡街等 25+）
  - [ ] SubTask 6.4: 液位计图元（20+）
  - [ ] SubTask 6.5: 分析仪图元（pH、电导率等 20+）

- [ ] Task 7: 实现管道阀门图元 (120+)
  - [ ] SubTask 7.1: 阀门图元（球阀、蝶阀、闸阀等 50+）
  - [ ] SubTask 7.2: 管道图元（直管、弯头、三通等 40+）
  - [ ] SubTask 7.3: 管件图元（法兰、垫片等 30+）

- [ ] SubTask 8: 实现建筑设施图元 (100+)
  - [ ] SubTask 8.1: 建筑图元（厂房、仓库等 20+）
  - [ ] SubTask 8.2: 道路图元（15+）
  - [ ] SubTask 8.3: 绿化图元（20+）
  - [ ] SubTask 8.4: 公共设施图元（45+）

## Phase 3: Edge 连线动画引擎

- [ ] Task 9: 实现基础 Edge 系统
  - [ ] SubTask 9.1: 创建 BaseEdge 组件
  - [ ] SubTask 9.2: 实现直线路径
  - [ ] SubTask 9.3: 实现正交路径（A*算法）
  - [ ] SubTask 9.4: 实现曲线路径（贝塞尔）

- [ ] Task 10: 实现 8+ 种连线动画
  - [ ] SubTask 10.1: 水流动画（蓝色流体，速度可配）
  - [ ] SubTask 10.2: 电流动画（闪烁效果）
  - [ ] SubTask 10.3: 箭头动画（动态箭头）
  - [ ] SubTask 10.4: 粒子动画（粒子流动）
  - [ ] SubTask 10.5: 脉冲动画（扩散波纹）
  - [ ] SubTask 10.6: 流光动画（渐变流动）
  - [ ] SubTask 10.7: 气体动画（虚线流动）
  - [ ] SubTask 10.8: 数据流动画（二进制流动）

- [ ] Task 11: 实现 Edge 数据绑定
  - [ ] SubTask 11.1: Edge 动画速度绑定数据
  - [ ] SubTask 11.2: Edge 颜色绑定状态
  - [ ] SubTask 11.3: Edge 显示标签（实时数据）

## Phase 4: 完整拖拽系统

- [ ] Task 12: 实现物料→画布拖入（原生 HTML5 DnD）
  - [ ] SubTask 12.1: 实现 draggable 属性
  - [ ] SubTask 12.2: 实现 dragstart 携带 meta
  - [ ] SubTask 12.3: 实现 dragover Ghost 预览
  - [ ] SubTask 12.4: 实现 drop 坐标转换

- [ ] Task 13: 实现画布内自由移动（VueUse useDraggable）
  - [ ] SubTask 13.1: 封装 useDraggable composable
  - [ ] SubTask 13.2: 实现 Pointer Events 处理
  - [ ] SubTask 13.3: 实现吸附算法注入
  - [ ] SubTask 13.4: 实现 requestAnimationFrame 节流

- [ ] Task 14: 实现多选批量移动
  - [ ] SubTask 14.1: 实现框选功能
  - [ ] SubTask 14.2: 实现 Ctrl+ 点击追加选择
  - [ ] SubTask 14.3: 实现相对位置保持
  - [ ] SubTask 14.4: 实现批量 MoveCommand 提交

- [ ] Task 15: 实现图层排序（vue-draggable-plus）
  - [ ] SubTask 15.1: 安装 vue-draggable-plus
  - [ ] SubTask 15.2: 实现树形拖拽排序
  - [ ] SubTask 15.3: 实现嵌套折叠展开

- [ ] Task 16: 实现节点 resize（Interactjs）
  - [ ] SubTask 16.1: 安装 interactjs
  - [ ] SubTask 16.2: 实现 8 方向 resize
  - [ ] SubTask 16.3: 实现 Shift 锁定宽高比
  - [ ] SubTask 16.4: 实现 ResizeCommand

## Phase 5: 对齐分布工具栏与图层打组

- [ ] Task 17: 实现 12 种对齐/分布操作
  - [ ] SubTask 17.1: 实现左/中/右对齐
  - [ ] SubTask 17.2: 实现顶/中/底对齐
  - [ ] SubTask 17.3: 实现水平等间距分布
  - [ ] SubTask 17.4: 实现垂直等间距分布
  - [ ] SubTask 17.5: 实现等宽分布
  - [ ] SubTask 17.6: 实现等高分布

- [ ] Task 18: 实现图层打组功能
  - [ ] SubTask 18.1: 实现 Ctrl+G 打组
  - [ ] SubTask 18.2: 实现组内相对坐标转换
  - [ ] SubTask 18.3: 实现组嵌套
  - [ ] SubTask 18.4: 实现 Ctrl+Shift+G 解散组

## Phase 6: 完整快捷键系统

- [ ] Task 19: 实现所有快捷键
  - [ ] SubTask 19.1: 撤销/重做 (Ctrl+Z/Y)
  - [ ] SubTask 19.2: 复制粘贴 (Ctrl+C/V/D)
  - [ ] SubTask 19.3: 删除 (Delete/Backspace)
  - [ ] SubTask 19.4: 全选/取消 (Ctrl+A/Escape)
  - [ ] SubTask 19.5: 微移 (方向键/Shift+ 方向键)
  - [ ] SubTask 19.6: 缩放视图 (Ctrl+ 滚轮/Ctrl+0/Ctrl+1)
  - [ ] SubTask 19.7: 分组 (Ctrl+G/Ctrl+Shift+G)
  - [ ] SubTask 19.8: 层级 (Ctrl+]/[/Shift+/Shift+[)
  - [ ] SubTask 19.9: 锁定 (Ctrl+L)
  - [ ] SubTask 19.10: 保存/预览 (Ctrl+S/Shift+S/Ctrl+P)
  - [ ] SubTask 19.11: 查找 (Ctrl+F)
  - [ ] SubTask 19.12: 框选/平移 (拖动空白/Space+ 拖动)

## Phase 7: JSON Schema 表单生成

- [ ] Task 20: 实现 JSON Schema 解析器
  - [ ] SubTask 20.1: 定义 JSON Schema 规范
  - [ ] SubTask 20.2: 实现 Schema → 表单控件映射
  - [ ] SubTask 20.3: 实现控件验证规则生成

- [ ] Task 21: 实现 40+ 种表单控件
  - [ ] SubTask 21.1: 基础控件（输入框、数字、开关、下拉）
  - [ ] SubTask 21.2: 颜色选择器（纯色、渐变）
  - [ ] SubTask 21.3: 字体选择器
  - [ ] SubTask 21.4: 图片上传
  - [ ] SubTask 21.5: 代码编辑器（Monaco）
  - [ ] SubTask 21.6: JSONPath 选择器
  - [ ] SubTask 21.7: 数据映射器
  - [ ] SubTask 21.8: 动画配置器
  - [ ] SubTask 21.9: 条件表达式编辑器

## Phase 8: 数据源引擎

- [ ] Task 22: 实现数据源适配器
  - [ ] SubTask 22.1: REST API 适配器（GET/POST、轮询、重试）
  - [ ] SubTask 22.2: WebSocket 适配器（断线重连、Topic 订阅）
  - [ ] SubTask 22.3: 数据库适配器（MySQL/PG/ClickHouse/InfluxDB）
  - [ ] SubTask 22.4: MQTT 适配器（IoT 设备数据）
  - [ ] SubTask 22.5: Kafka 适配器
  - [ ] SubTask 22.6: SSE 适配器
  - [ ] SubTask 22.7: 静态 JSON/CSV适配器
  - [ ] SubTask 22.8: Mock 数据服务
  - [ ] SubTask 22.9: Excel 导入适配器
  - [ ] SubTask 22.10: 数据集市适配器

- [ ] Task 23: 实现数据处理管道
  - [ ] SubTask 23.1: 实现 JSONPath 提取
  - [ ] SubTask 23.2: 实现 JS 过滤器沙箱
  - [ ] SubTask 23.3: 实现字段映射
  - [ ] SubTask 23.4: 实现数据缓存策略

- [ ] Task 24: 实现全局变量面板
  - [ ] SubTask 24.1: 变量管理（增删改查）
  - [ ] SubTask 24.2: 变量在 URL/参数/过滤器中引用
  - [ ] SubTask 24.3: 运行时变量面板（发布端可选显示）

## Phase 9: 事件交互系统

- [ ] Task 25: 实现事件绑定系统
  - [ ] SubTask 25.1: 定义 EventBinding Schema
  - [ ] SubTask 25.2: 实现事件发射器
  - [ ] SubTask 25.3: 实现动作执行器

- [ ] Task 26: 实现可用动作
  - [ ] SubTask 26.1: 更新组件数据
  - [ ] SubTask 26.2: 联动过滤（注入请求参数）
  - [ ] SubTask 26.3: 控制显隐
  - [ ] SubTask 26.4: 打开弹窗
  - [ ] SubTask 26.5: 跳转页面/外部链接
  - [ ] SubTask 26.6: 触发动画
  - [ ] SubTask 26.7: 修改全局变量

## Phase 10: UI/UX 完善

- [ ] Task 27: 实现专业图标系统
  - [ ] SubTask 27.1: 安装 UnoCSS Icon Preset
  - [ ] SubTask 27.2: 配置 @iconify-json/carbon + @iconify-json/mdi
  - [ ] SubTask 27.3: 替换所有 emoji 为 Iconify 图标
  - [ ] SubTask 27.4: 实现图标按需 tree-shake

- [ ] Task 28: 实现工业科技风格
  - [ ] SubTask 28.1: 完善深色主题 CSS 变量
  - [ ] SubTask 28.2: 实现科技边框样式
  - [ ] SubTask 28.3: 实现流光动画效果
  - [ ] SubTask 28.4: 实现粒子背景效果
  - [ ] SubTask 28.5: 实现悬停高亮效果

- [ ] Task 29: 实现鸟瞰图导航
  - [ ] SubTask 29.1: 创建 Minimap 组件
  - [ ] SubTask 29.2: 实现缩略图渲染
  - [ ] SubTask 29.3: 实现视口框显示
  - [ ] SubTask 29.4: 实现点击快速定位

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
- [Task 4-8] depends on [Task 1, Task 2]
- [Task 9] depends on [Task 1, Task 3]
- [Task 10] depends on [Task 9]
- [Task 11] depends on [Task 10]
- [Task 12] depends on [Task 1]
- [Task 13] depends on [Task 12]
- [Task 14] depends on [Task 13]
- [Task 15] depends on [Task 1]
- [Task 16] depends on [Task 13]
- [Task 17] depends on [Task 14]
- [Task 18] depends on [Task 14]
- [Task 19] depends on [Task 13, Task 14]
- [Task 20] depends on [Task 1]
- [Task 21] depends on [Task 20]
- [Task 22] depends on [Task 20]
- [Task 23] depends on [Task 22]
- [Task 24] depends on [Task 23]
- [Task 25] depends on [Task 20]
- [Task 26] depends on [Task 25]
- [Task 27] depends on [Task 1]
- [Task 28] depends on [Task 27]
- [Task 29] depends on [Task 1]
