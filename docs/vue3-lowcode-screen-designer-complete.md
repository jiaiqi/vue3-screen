# Vue3 工业级低代码大屏设计器 · 完整技术方案

> **v2.1 · Vue 3 · 含混合画布** | COMPLETE SPECIFICATION · PRODUCTION READY

**核心指标：** 80+ 内置组件 · 500+ 工业图元 · 8+ 连线动画类型 · 10+ 数据源类型 · 60fps 渲染目标

---

## 01 项目概述与核心目标

### 产品定位

面向企业级用户的 SaaS / 私有化部署可视化大屏设计平台，支持非技术人员通过拖拽配置完成数据大屏及工业拓扑图的设计、数据绑定与发布全流程，替代传统定制开发模式，**降低 80% 开发成本**。

### 核心目标场景

| 行业领域 | 典型场景 |
|---|---|
| 工业制造 | P&ID 工艺流程图、生产线实时监控、设备状态可视化 |
| 智慧城市 | 交通、能耗、安防、管网综合监控 |
| 数据中台 | 业务 KPI 看板、运营报表、指标趋势 |
| 金融科技 | 风控大屏、实时交易监控 |
| 能源管理 | 电力单线图、水务管网、气象数据可视化 |
| IT 运维 | 服务器拓扑、网络链路、微服务架构图 |

### 四大核心能力

- **低代码设计**：所见即所得可视化编辑器，组件拖拽、属性配置、样式调整，零代码完成大屏制作
- **混合画布**：大屏 Widget 与拓扑图元在同一画布共存，图元间可连线并附加工业动画效果
- **多源数据融合**：REST/WebSocket/数据库/MQTT 统一适配，JS 过滤器沙箱处理，实时数据驱动动画
- **企业级扩展**：插件机制、自定义组件/图元注册、主题系统、RBAC 权限、嵌入 SDK

---

## 02 技术选型与依赖栈

### 核心技术栈

| 技术层 | 选型 | 版本 | 选型理由 |
|---|---|---|---|
| 前端框架 | Vue 3 | **3.5+** | Composition API 逻辑复用；TypeScript 原生支持；v3.5 细粒度订阅优化 |
| 构建工具 | Vite | **6.x** | 极速 HMR；原生 ESM；Module Federation；Environment API 多环境构建 |
| 状态管理 | Pinia | 2.x | TypeScript 原生；DevTools 集成；无 mutations 样板；Store 间依赖 |
| 路由 | Vue Router | 4.x | 官方路由，完整 TypeScript，路由级权限守卫 |
| UI 框架 | Element Plus | 2.x | 企业级组件；按需引入；CSS 变量主题定制 |
| 图表库 | ECharts 5 | 5.x | 工业场景最成熟；GL 3D 扩展；setOption 增量更新 |
| 图/拓扑引擎 | @vue-flow/core | 1.x | Vue3 原生图引擎；节点为 Vue 组件；Edge slot 自定义动画 |
| Canvas 引擎 | Konva.js | 9.x | SVG 图元编辑器；Vue 绑定完善 |
| 类型系统 | TypeScript | 5.x | 严格模式，工业级代码质量 |
| CSS 方案 | UnoCSS + CSS Vars | — | 原子化 CSS；主题运行时切换 |
| 网络请求 | Axios + Alova | — | Alova 提供请求策略、缓存、自动重试 |
| WebSocket | Socket.io-client | — | 断线重连；命名空间隔离；MQTT 桥接 |
| 测试框架 | Vitest + Playwright | — | 单元测试共享 Vite 配置；E2E 多浏览器 |
| Monorepo | pnpm + Turborepo | — | 高效 workspace；增量构建缓存；依赖去重 |
| CI/CD | GitHub Actions / Jenkins | — | 自动化测试、构建、Docker 镜像流水线 |
| 国际化 | vue-i18n | 9.x | 官方 i18n；懒加载语言包；Composition API |

### 🔍 拖拽系统分场景选型分析

设计器存在 **5 类完全不同的拖拽场景**，分场景选用最合适的方案，架构层统一封装为 `useDrag composable`：

| 拖拽场景 | 选用方案 | 核心 API | 选型理由 |
|---|---|---|---|
| 物料面板 → 画布拖入 | 原生 HTML5 DnD | `draggable + dragover + drop` | 跨容器，无需额外库；dataTransfer 携带元数据 |
| 画布内节点自由移动 | VueUse `useDraggable` | `useDraggable(el, {onMove})` | Pointer Events；精确坐标；响应式集成 |
| 多选批量移动 | 自研 MultiDrag | 基于 useDraggable 扩展 | 记录选中节点相对偏移，批量提交 Command |
| 图层面板树排序 | vue-draggable-plus | `v-draggable` 指令 | 树形嵌套排序强项；与 Pinia 数组直接绑定 |
| 图元 Port 连线拖出 | @vue-flow/core Handle | `<Handle type="source">` | 与图引擎深度集成；连接验证内置 |
| 节点 resize 手柄 | Interactjs | `interact(el).resizable()` | 专业手势；保持宽高比；方向约束 |

> ❌ **vue-draggable-plus 不适合作主力**：基于 Sortable.js，本质是列表排序库，不支持画布内绝对定位自由移动，与 Vue Flow drag 事件系统冲突。
>
> ✅ 所有拖拽操作统一封装在 `packages/core/composables/useDrag.ts`，拖拽过程使用 `requestAnimationFrame` 节流，结束时统一触发 Command 到 HistoryManager。

---

## 03 整体架构设计

```
┌─────────────────────────────────────────────────────────────┐
│ Presentation Layer — 用户界面层                              │
│  设计器 | 预览器 | 发布端 | 管理后台 | 嵌入 SDK             │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Designer Core — 设计器核心层                                  │
│  画布引擎 | 拖拽系统 | 属性面板 | 图层管理 | Undo/Redo       │
│  辅助线/对齐 | 快捷键系统                                     │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Hybrid Canvas Layer — 混合画布层 ★                           │
│  Vue Flow 图引擎 | SVG 连线动画层 | 图元节点系统              │
│  Port/连接点管理 | 路径计算（A*正交）| 图元状态映射           │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Component System — 组件系统层                                 │
│  基础图表(30+) | 地图(10+) | 媒体/装饰(25+)                 │
│  工业图元库(500+) | 自定义组件注册 | 远程 UMD 组件            │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Data Layer — 数据层                                          │
│  数据源管理 | 数据适配器 | JS 过滤器(沙箱) | 实时推送引擎     │
│  全局变量/过滤器 | 数据缓存策略 | Mock 数据服务               │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Infrastructure — 基础设施层                                   │
│  Schema v2.1 | 插件系统 | 主题引擎 | 事件总线                 │
│  RBAC 权限 | i18n 国际化 | 错误边界/沙箱 | 监控/审计          │
└─────────────────────────────────────────────────────────────┘
```

**三大架构原则：**
- **关注点分离**：设计态与运行态完全隔离，Schema 为唯一交换格式。Widget 节点和 Graph 节点通过 `nodeKind` 字段区分，渲染器按类型分发。
- **双层渲染**：DOM 层负责所有节点渲染，SVG 层专注连线和动画，两层共享同一逻辑坐标系，零破坏性。
- **插件优先**：核心最小化，组件库、图元库、数据源类型、动画类型均通过插件注入，企业定制化 100% 通过插件满足。

---

## 04 设计器核心模块

### 4.1 画布引擎 (Canvas Engine)

基于 CSS Transform 的坐标系管理，混合画布模式下 DOM 节点层与 SVG 连线层共享同一变换矩阵。

```typescript
interface CanvasConfig {
  width: number        // 设计宽度 e.g. 1920
  height: number       // 设计高度 e.g. 1080
  scale: number        // 当前缩放比例
  offsetX: number      // 水平平移偏移
  offsetY: number      // 垂直平移偏移
  bgColor: string      // 背景色
  bgImage?: string     // 背景图 URL
  bgImageOpacity: number
  grid: GridConfig     // 网格吸附
  rulers: boolean      // 标尺显示
  canvasMode: 'screen' | 'hybrid' | 'topology'
}

// 画布变换矩阵（两层共享）
const transform = computed(() =>
  `translate(${offsetX}px,${offsetY}px) scale(${scale})`
)
```

**功能特性：**
- 自适应缩放：fit-screen / 1:1 / 自定义
- 标尺与辅助线：水平/垂直标尺，拖出辅助线，吸附对齐
- 多分辨率预设：1920×1080、2560×1440、3840×2160
- 背景图蒙版：透明度可调
- 鸟瞰图导航：右下角缩略图，点击快速定位

### 4.2 拖拽系统 (DnD System)

物料拖入画布完整流程：
```
dragstart → dataTransfer 携带 {type, meta}
    ↓
dragover → 实时显示 Ghost 预览，计算落点
    ↓
drop → 坐标转换（屏幕坐标→画布逻辑坐标）
    ↓
吸附计算（网格/辅助线/边缘对齐）
    ↓
AddNodeCommand 写入 Schema → 历史栈
```

### 4.3 属性面板 (Props Panel)

基于 JSON Schema 自动生成表单，支持 **40+ 种控件类型**：

| 面板 Tab | 支持配置项 |
|---|---|
| 属性配置 | 数值输入、颜色选择器（渐变）、字体、下拉、开关、Monaco 代码编辑器、图片上传 |
| 样式配置 | 尺寸/位置、背景（颜色/图片/渐变）、边框、阴影、透明度、混合模式、CSS 滤镜、动画 |
| 数据绑定 | 选数据源→JSONPath→过滤器→字段映射→刷新频率；连线额外有动画数据绑定 |

### 4.4 历史记录系统 (History)

基于 **Command Pattern** 实现，每个操作封装为可逆命令：

```typescript
abstract class BaseCommand {
  abstract execute(): void
  abstract undo(): void
  description: string
}
// Widget 操作
class AddWidgetCommand extends BaseCommand {}
class MoveCommand extends BaseCommand {}
class ResizeCommand extends BaseCommand {}
// 拓扑操作（新增）
class AddGraphNodeCommand extends BaseCommand {}
class AddEdgeCommand extends BaseCommand {}
class UpdateEdgeAnimationCommand extends BaseCommand {}
// 批量操作（多操作一步撤销）
class BatchCommand extends BaseCommand {
  commands: BaseCommand[]
}
```

### 4.5 图层面板 (Layer Panel)

树形结构展示所有节点，Widget 节点和 Graph 节点通过图标区分：

- 双击图层名内联编辑名称；图层锁定/隐藏；搜索过滤
- Ctrl+G 打组；图层颜色标注；连线在图层树中有对应条目
- vue-draggable-plus 实现图层排序（改变 zIndex）

### 4.6 对齐与分布工具栏

多选节点时顶部出现 12 种对齐/分布操作：左/水平居中/右对齐、顶/垂直居中/底对齐、水平等间距/等宽分布、垂直等间距/等高分布。

---

## 05 快捷键系统

| 分类 | 快捷键 | 操作说明 |
|---|---|---|
| 撤销/重做 | `Ctrl+Z` `Ctrl+Y` | 撤销 / 重做 |
| 复制粘贴 | `Ctrl+C` `Ctrl+V` `Ctrl+D` | 复制 / 粘贴 / 原地复制 |
| 删除 | `Delete / Backspace` | 删除选中节点（含关联连线） |
| 全选/取消 | `Ctrl+A` `Escape` | 全选 / 取消选中 |
| 微移 | `↑↓←→` / `Shift+↑↓←→` | 1px / 10px 步进移动 |
| 缩放视图 | `Ctrl+滚轮` `Ctrl+0` `Ctrl+1` | 缩放 / 适合屏幕 / 100% |
| 分组 | `Ctrl+G` `Ctrl+Shift+G` | 打组 / 解散组 |
| 层级 | `Ctrl+]` `Ctrl+[` `Ctrl+Shift+]` `Ctrl+Shift+[` | 上移/下移/置顶/置底 |
| 保存 | `Ctrl+S` `Ctrl+Shift+S` | 保存草稿 / 另存为 |
| 预览 | `Ctrl+P` | 在新标签页打开预览 |
| 平移视图 | `Space+拖动` / `中键拖动` | 平移画布视图 |
| 连线删除 | `选中连线+Delete` | 删除选中连线 |

---

## 06 组件体系设计

### 组件元数据规范

```typescript
interface ComponentMeta {
  type: string           // 唯一标识 'chart-bar'
  name: string
  category: string
  icon: string           // SVG 图标
  thumbnail: string
  defaultProps: Record
  defaultSize: Size      // { w, h }
  propsSchema: JSONSchema // 属性表单自动生成
  styleSchema: JSONSchema
  dataSchema: JSONSchema  // 期望数据结构
  events: EventDef[]      // 可发射事件
  actions: ActionDef[]    // 可接收动作
  resizable: boolean
  aspectRatio?: number    // 锁定宽高比
}
```

### 内置组件库（80+）

| 分类 | 数量 | 典型组件 |
|---|---|---|
| 📊 图表类 | 30+ | 折线/柱/饼/散点/雷达/漏斗/仪表盘/词云/热力/K线/桑基/瀑布图 |
| 🗺️ 地图类 | 10+ | 行政区/热力地图/飞线/轨迹/3D地球/GIS图层 |
| 📋 数据类 | 15+ | 轮播表格/进度条/指标卡/数字翻牌器/倒计时/排行榜 |
| 🎨 装饰类 | 20+ | 科技边框/背景/分割线/标题框/流光/粒子背景/SVG图形 |
| 📦 容器类 | 5+ | 分组/Tab切换/弹窗/滚动容器 |
| 🎬 媒体类 | 5+ | 视频播放/图片轮播/GIF/实时监控流(RTSP/HLS) |

### 自定义组件注册方式

```typescript
// 1. 本地 Vue 组件注册
designer.registerComponent({ meta: myMeta, component: MyVueComp })

// 2. 远程 UMD 组件（Module Federation / CDN）
designer.registerRemoteComponent({
  meta: remoteMeta,
  url: 'https://cdn.example.com/my-widget.umd.js',
  integrity: 'sha384-xxx'  // SRI 校验安全
})

// 3. 低代码自定义（在线代码编辑器，运行时编译）
designer.registerCodeComponent({
  meta: codeMeta,
  source: jsxSource,  // Babel 转译后执行
  sandbox: true       // 沙箱隔离，崩溃不影响主画布
})
```

---

## 07 数据源引擎

### 支持的数据源类型

| 数据源 | 说明 | 特性标签 |
|---|---|---|
| REST API | GET/POST/PUT/DELETE，动态 URL 模板，轮询间隔，请求缓存，失败重试 | 轮询 · 鉴权头 · 缓存 |
| WebSocket | 长连接实时推送，断线重连，Topic 订阅/取消，Socket.io 兼容 | 实时推送 · 断线重连 |
| 数据库直连 | MySQL/PG/ClickHouse/InfluxDB 后端代理，Monaco SQL 编辑器，参数化防注入 | SQL 编辑器 · 时序数据库 |
| 消息队列 | Kafka、MQTT(IoT)，服务端 SSE 转发到前端，Topic 订阅管理 | Kafka · MQTT · SSE |
| 静态数据+Mock | JSON/CSV/Excel，基于 Schema 自动生成 Mock，支持延迟/错误模拟 | Mock 服务 · Excel 导入 |
| 数据集市 | 接入企业数据中台，字段级权限，数据血缘追踪，版本快照 | 数据目录 · 版本管理 |

### 数据处理管道

```
数据源请求 → 响应解析 → JSONPath 提取 → JS 过滤器（沙箱） → 字段映射 → 组件 Props / 动画参数
```

**JS 过滤器沙箱（白名单 API：dayjs、Math、Array、Object，禁止 window/document）：**

```javascript
function filter(data, params, { $dayjs, $_ }) {
  return data.list
    .filter(item => item.status === 'active')
    .map(item => ({
      name: item.label,
      value: item.count,
      time: $dayjs(item.ts).format('HH:mm')
    }))
}
```

### 数据更新策略

| 策略 | 适用场景 | 配置项 |
|---|---|---|
| 轮询 | REST API | interval(s)，jitter 防雪崩 |
| 实时推送 | WebSocket/MQTT | 节流间隔，帧率上限 |
| 事件触发 | 用户交互联动 | 触发事件名 |
| 页面加载 | 静态/低频数据 | 一次性加载，可手动刷新 |
| 混合 | 初始值+增量推送 | 首次 REST 全量，后续 WS 增量 |

---

## 08 渲染引擎

### 自适应缩放方案

| 策略 | 原理 | 适用场景 |
|---|---|---|
| scale-fit | CSS transform scale | 固定比例大屏，简单高效 |
| vw-vh | px→vw/vh 单位转换 | 组件少，移动端兼容 |
| rem | 根字体动态计算 | 文字较多，可读性优先 |

```typescript
useResizeObserver(containerRef, ([entry]) => {
  const { width, height } = entry.contentRect
  const scale = Math.min(width/canvasW, height/canvasH)
  canvasStyle.value = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left'
  }
})
```

### 发布端渲染架构（轻量化）

```
Schema 加载（远程 / 离线 IndexedDB 缓存 / 增量热更新）
    ↓
组件/图元 动态注册（按需懒加载 / 预加载策略 / Module Federation）
    ↓
双层渲染输出：DOM 节点层 + SVG 连线动画层
```

**移动端适配：** scale-fit 自动适配屏幕旋转；双指缩放/平移（纯展示模式）。

---

## 09 事件交互系统

### 事件 Schema 定义

```typescript
interface EventBinding {
  sourceId: string       // 源组件/图元 ID
  eventName: string      // 'onClick' | 'onStateChange'
  actions: Action[]      // 触发的动作（可多个）
}
interface Action {
  type: string
  targetId?: string
  params?: Record        // 支持表达式 {{event.value}}
  condition?: string     // JS 条件表达式
  delay?: number         // 延迟执行 ms
}
```

**事件源：** 组件内部点击 / 图元节点状态变化 / 页面加载 / 定时器 / 用户控件交互

**可用动作：** 更新组件数据 / 联动过滤（注入请求参数）/ 控制显隐 / 跳转页面或链接 / 触发动画 / 修改全局变量

---

## 10 混合画布架构决策

### 方案对比

| 方案 | 描述 | 评价 |
|---|---|---|
| ❌ 方案A：单一图引擎 | 所有组件迁入 Vue Flow / AntV G6 | 破坏性重构·ECharts 集成复杂·性能风险 |
| ✅ 方案B：双层混合渲染（**采用**） | DOM 层负责节点，SVG 层专注连线，共享坐标系 | 零破坏性·性能最优·渐进增强 |
| ⚠️ 方案C：iframe 隔离 | 拓扑子画布用 iframe + postMessage | 坐标不统一·交互割裂 |

### 四层渲染架构

```
Layer 4 — 交互层（最顶，pointer-events: all）
  选择框 · ResizeHandle · Port 连接点 · 辅助线 · 右键菜单 · 鸟瞰导航
      ↓
Layer 3 — 节点层（DOM，绝对定位）
  Widget Node（大屏组件） · Graph Node（工业图元） · Container Node
      ↓
Layer 2 — 连线层（SVG，pointer-events: stroke）★ 新增
  Edge 基础路径 · 动画流体层 · 连线标签 · 临时连线（拖拽中）
      ↓
Layer 1 — 背景层（Canvas/CSS）
  背景色/图片蒙版 · 网格 Grid · 标尺 Ruler
```

> **坐标系统一原则：** 四层渲染共享同一逻辑坐标系（scale + translate 矩阵），SVG 的 viewBox 与画布实际像素同步，连线端点始终精确对准 Port 位置。

---

## 11 拓扑图引擎选型

| 方案 | 渲染器 | Vue3 | 自定义节点 | 连线动画 | 大规模性能 | 推荐 |
|---|---|---|---|---|---|---|
| @vue-flow/core | SVG | 原生 Vue3 | Vue 组件即节点 | Edge slot 完全自定义 | 虚拟化支持 | ★★★★★ 首选 |
| AntV X6 | SVG+Canvas | 需适配 | HTML 节点 | 官方动画 API | 优秀 | ★★★★ 备选 |
| LogicFlow | SVG | 需适配 | React/原生 | 有限 | 良好 | ★★★ |
| 自研 SVG 层 | SVG | 完全控制 | 完全自由 | 完全自由 | 取决实现 | 配合 Vue Flow |

**最终选型：** `@vue-flow/core`（图结构管理）+ 自研 SVG 动画层

使用 Vue Flow 管理节点/边增删改查、连接验证、视口变换，但**不使用其默认边渲染**，通过 edge 插槽注入自研动画 SVG 组件，享受完整图管理能力同时获得工业级动画控制权。

```typescript
import { VueFlow } from '@vue-flow/core'
import { WaterFlowEdge, ElectricEdge, ArrowEdge, ParticleEdge } from '@screen/edge-animations'
import { GraphNode, WidgetNode } from '@screen/nodes'

const nodeTypes = {
  widget: WidgetNode,   // 大屏组件包装节点
  graph: GraphNode,     // 拓扑图元节点
}
const edgeTypes = {
  waterFlow: WaterFlowEdge,
  electric: ElectricEdge,
  arrowFlow: ArrowEdge,
  particle: ParticleEdge,
  pulse: PulseEdge,
  dashed: DashedEdge,
  custom: CustomEdge,   // 用户自定义 SVG 动画
}
```

---

## 12 图元节点系统设计

### 内置图元分类（500+）

| 分类 | 典型图元 |
|---|---|
| ⚙️ 工艺设备 | 泵、阀门、风机、电机、热交换器、储罐、过滤器、压缩机、反应釜 |
| 📡 仪表仪器 | 压力表、流量计、温度传感器、液位计、电度表、分析仪 |
| 🔌 电气设备 | 断路器、变压器、开关、母线、电容、电阻、接地、保险丝 |
| 🖥️ IT 拓扑 | 服务器、路由器、交换机、防火墙、数据库、云服务、负载均衡 |
| 🔷 流程图形 | 矩形、菱形（判断）、圆角矩形、平行四边形、泳道 |
| 🏗️ 自定义图元 | 上传 SVG 自动解析，可视化定义连接点 |

### 图元节点 Schema

```typescript
interface GraphNodeSchema {
  id: string
  nodeKind: 'graph'     // 区分 Widget 节点
  graphType: string     // 'pump'|'valve'|...
  svgSource?: string    // 内联 SVG 或 URL
  label: string
  layout: NodeLayout    // x, y, w, h

  ports: Port[] = [{
    id: 'out-right',
    position: 'right',   // top|right|bottom|left
    offset?: {x:50,y:0}, // 百分比偏移
    type: 'source',      // source|target|both
    allowedEdges: ['waterFlow']
  }]

  // 数据驱动视觉状态
  stateMapping?: {
    dataSourceId: string
    field: string
    rules: StateRule[]  // 值→样式/动画
  }

  // Tooltip 数据配置
  tooltip?: {
    fields: {label:string,binding:DataBinding}[]
    showMiniChart: boolean
  }
}
```

### 图元视觉状态

| 状态 | 视觉效果 |
|---|---|
| 运行中 | 绿色发光边框，内部叶轮旋转动画 |
| 故障/告警 | 红色边框闪烁，显示故障标牌 |
| 停机 | 灰色半透明，关联连线暂停 |
| 维护中 | 黄色边框，显示维护图标 |

---

## 13 连线（Edge）系统设计

### Edge Schema 定义

```typescript
interface EdgeSchema {
  id: string
  source: string        // 源节点 ID
  sourcePort: string    // 源 Port ID
  target: string
  targetPort: string

  pathType: 'bezier'|'straight'|'step'|'smoothstep'|'orthogonal'

  style: {
    stroke: string
    strokeWidth: number
    opacity: number
  }

  animation: EdgeAnimation

  label?: {
    text: string
    dataBinding?: DataBinding
    position: number     // 0~1 沿路径位置
    align: 'center'|'source'|'target'
  }
}
```

### 路径类型说明

| 路径类型 | 显示效果 | 适用场景 |
|---|---|---|
| `bezier` | 贝塞尔曲线 | 默认，通用 |
| `straight` | 直线 | 简单关联 |
| `step` | 阶梯折线 | 流程图 |
| `orthogonal ★` | 正交避障 | **工业 P&ID 首选** |
| `smoothstep` | 平滑阶梯 | 美观流程图 |

> **正交路径 A\* 避障：** 采用 A* 算法在逻辑网格上计算最短正交路径，自动绕过其他节点，弯折点用 SVG 二次贝塞尔曲线圆角处理。A* 计算在 **Web Worker** 中执行不阻塞主线程。

---

## 14 连线动画引擎（核心亮点）

所有动画基于**纯 CSS animation**（不占 JS 主线程，GPU 加速），沿路径运动的粒子使用 SVG SMIL `animateMotion`。

### 动画类型

| 动画类型 | 视觉效果 | 典型场景 |
|---|---|---|
| `waterFlow` | 蓝色虚线流动，管道外壳包裹 | 水管、冷却液、流体管道 |
| 热流/蒸汽 | 橙色高速流动 | 蒸汽管、热流 |
| `electric` | 黄色闪烁虚线 | 电力线、信号线 |
| `arrowFlow` | 动态箭头连续移动 | 物料流、数据流 |
| `particle` | 多粒子沿路径运动，发光效果 | 信息流、粒子管道 |
| `pulse` | 心跳脉冲波形，发光晕圈 | 告警状态、关键管路 |
| 静态关联线 | 灰色虚线，无动画 | 数据关联、依赖关系 |

### EdgeAnimation 完整 Schema

```typescript
interface EdgeAnimation {
  type: 'none'|'waterFlow'|'electric'|'arrowFlow'|'particle'|'pulse'|'custom'
  speed: number           // 0.1~5.0
  direction: 'forward'|'reverse'|'auto'
  color: string
  opacity: number

  // 管道专用
  pipeWidth?: number      // 管道外径
  fluidWidth?: number     // 流体宽度
  pipeColor?: string
  showPipe?: boolean

  // 粒子专用
  particleCount?: number
  particleSize?: number
  particleGlow?: boolean

  // ★ 数据驱动动画（工业核心）
  dataBinding?: {
    speedField?: string   // 控制速度的字段
    dirField?: string     // 控制方向的字段（正负）
    colorField?: string   // 控制颜色的字段（温度映射）
    activeField?: string  // 控制开关的字段（阀门状态）
    colorMap?: {value:number, color:string}[]
  }
}
```

### 数据驱动动画典型映射

| 映射类型 | 说明 |
|---|---|
| 流速控制 | 流量值 0~100 → 动画速度 0.2~5.0 线性映射，流量为 0 时动画自动暂停 |
| 方向控制 | 流量方向字段 > 0 → forward；< 0 → reverse，实现双向流体 |
| 温度映射 | 温度字段通过 colorMap 插值，低温→蓝色，高温→红色，渐变过渡 |
| 阀门联动 | 阀门关闭 true → animation.type='none'，管道变灰 |
| 故障告警 | 设备故障 → 连线动画强制变红色闪烁，忽略原色彩配置 |
| 电压状态 | 正常→绿色正常频率；欠压→黄色；断电→无动画灰色 |


---

## 15 图元数据绑定设计

### 状态映射规则

```typescript
interface StateRule {
  condition: string       // JS 表达式，如 'v === "running"'
  style?: {
    borderColor: string
    glowColor: string
    svgFill: string
    opacity: number
  }
  nodeAnimation?: 'rotate'|'blink'|'pulse'|'none'
  badge?: {text:string, color:string}
  affectEdges?: boolean   // 状态变化联动影响关联连线
}

// 示例：水泵状态配置
rules: [
  { condition: 'v === "running"',
    style: { borderColor: '#00e676', glowColor: '#00e676' },
    nodeAnimation: 'rotate', affectEdges: true },
  { condition: 'v === "fault"',
    style: { borderColor: '#ff4081' },
    nodeAnimation: 'blink',
    badge: { text: '故障', color: '#ff4081' } },
  { condition: 'v === "stop"',
    style: { opacity: 0.4 }, affectEdges: true }
]
```

### 图元 Tooltip 面板

鼠标悬停显示数据浮层：字段列表（标签 + 实时值 + 单位 + 趋势箭头）、迷你趋势图、点击跳转详情页、超阈值字段红色高亮。

### 图元分组与子图

- 多个图元可 Ctrl+G 打组，折叠后显示单一图元图标
- 子图支持独立坐标空间和内部连线，双击进入子图编辑模式

---

## 16 拓扑交互设计

### 连线操作流程

```
1. 悬停图元 → 出现蓝色连接点（Port Handle）
2. 悬停连接点 → 光标变十字，Port 放大高亮
3. 按下拖动 → 临时连线（蓝色虚线跟随鼠标）
4. 拖到目标 → 有效 Port 绿色高亮 / 无效红色
5. 释放 → 创建 Edge，弹出动画类型选择面板
```

### 画布模式切换

| 模式 | 行为 |
|---|---|
| 大屏模式 | 连接点隐藏，拖拽行为同原版，空白区域框选 |
| 拓扑模式 | 悬停节点显示 Port，可拖线，Space+拖动平移 |
| 混合模式 ★ | 两种行为共存，智能识别意图（默认推荐） |

**物料面板扩充：** 顶部 Tab 新增图元分类，支持搜索和收藏，自动布局（dagre/elk），导入 Visio `.vsdx` / Draw.io `.drawio` 格式。

---

## 17 大屏 Schema 规范 v2.1

```typescript
interface ScreenSchema {
  version: '2.1.0'
  id: string
  name: string
  canvas: {
    width: number; height: number
    background: Background
    fitMode: 'scale'|'vw'|'rem'
    canvasMode: 'screen'|'hybrid'|'topology'
  }
  dataSources: DataSource[]
  variables: Variable[]
  globalFilters: Filter[]
  theme: ThemeConfig
  pages: Page[]
  events: EventBinding[]
}

interface Page {
  id: string; name: string
  nodes: ComponentNode[]           // Widget 节点（原有）
  graphNodes?: GraphNodeSchema[]   // ★ 新增：拓扑图元
  edges?: EdgeSchema[]             // ★ 新增：连线
  graphLayout?: {
    algorithm: 'dagre'|'elk'|'force'|'manual'
    options: Record<string, any>
  }
}
```

### Schema 版本迁移（2.0 → 2.1）

```typescript
const migrations: Migration[] = [
  { from: '2.0.0', to: '2.1.0', migrate(schema) {
    schema.pages.forEach(p => {
      p.graphNodes ??= []
      p.edges ??= []
      p.nodes.forEach(n => { n.nodeKind ??= 'widget' })
    })
    schema.canvas.canvasMode ??= 'screen'
    return schema
  }}
]
```

---

## 18 工程目录结构（Monorepo）

```
screen-designer/                  # Monorepo 根目录（pnpm workspace）
├── apps/
│   ├── designer/                 # 设计器主应用（npm create vue@latest）
│   ├── renderer/                 # 发布端渲染器
│   ├── admin/                    # 管理后台
│   └── preview/                  # 独立预览应用
├── packages/
│   ├── core/                     # 核心引擎（画布/历史/事件/Schema）
│   ├── components/               # 大屏 Widget 组件库
│   ├── graph-nodes/              # ★ 拓扑图元库
│   │   ├── industrial/           # 工艺设备
│   │   ├── electrical/           # 电气设备
│   │   ├── instruments/          # 仪器仪表
│   │   ├── it-topology/          # IT 拓扑
│   │   └── GraphNode.vue         # 图元容器组件
│   ├── edge-animations/          # ★ 连线动画包
│   │   ├── WaterFlowEdge.vue
│   │   ├── ElectricEdge.vue
│   │   ├── ArrowFlowEdge.vue
│   │   └── animation-engine.ts
│   ├── data-center/              # 数据源引擎
│   ├── plugin-system/            # 插件 SDK
│   ├── theme-engine/             # 主题系统（UnoCSS 主题）
│   └── embed-sdk/                # ★ 嵌入 SDK
├── services/
│   ├── api-gateway/
│   ├── data-proxy/               # 数据库/MQTT 代理
│   └── asset-service/            # 图元/组件资源服务
└── pnpm-workspace.yaml
```

---

## 19 状态管理设计

| Store | 职责 |
|---|---|
| `useDesignerStore` | 当前编辑 Schema（主状态）、选中节点/连线列表、多页面状态、自动保存 |
| `useCanvasStore` | 画布缩放/平移/尺寸、辅助线、网格配置、画布模式 |
| `useSelectionStore` | 选中节点 ID 列表（Widget+Graph+Edge）、框选范围、焦点元素 |
| `useDataStore` | 运行时数据：各数据源实例、请求状态、全局变量值、数据订阅管理 |
| `useHistoryStore` | 命令栈（BaseCommand[]）、当前指针，提供 undo/redo/batch API |
| `usePluginStore` | 注册组件/图元/边动画类型/数据源类型表、工具栏扩展点 |

> **核心原则：** Schema 作为 Single Source of Truth，所有操作通过 Command 对象修改 Schema，永远不直接修改 UI 状态。

---

## 20 插件系统设计

```typescript
interface DesignerPlugin {
  name: string
  version: string
  install(ctx: PluginContext): void
}
interface PluginContext {
  registerComponent(meta, comp): void
  registerGraphNode(meta, comp): void
  registerEdgeType(type, comp): void
  registerDataSource(type, adapter): void
  registerToolbarItem(item): void
  hooks: {
    onSchemaChange(fn): void
    onComponentAdd(fn): void
    onEdgeCreate(fn): void
    onPublish(fn): void
  }
}
```

**内置插件：** `plugin-echarts` · `plugin-amap` · `plugin-mapbox` · `plugin-mqtt` · `plugin-export` · `plugin-pid`

---

## 21 错误边界与组件沙箱隔离

每个组件节点包裹独立错误边界（Vue Error Handler + Suspense），单组件崩溃不影响整个画布。

**JS 沙箱（Proxy 白名单）：** 允许 `Math/Array/Object/JSON/dayjs/lodash/console`，禁止 `fetch/XMLHttpRequest/eval/Function/window`，2000ms 超时保护防死循环。

---

## 22 性能优化策略

### 综合性能目标

| 指标 | 目标值 |
|---|---|
| 设计器首屏 | < 3s |
| 渲染器加载 | < 1s |
| 拖拽/动画帧率 | 60fps |
| 同屏 Widget | 200+ |
| 图元节点 | 500+ |
| 动画连线 | 200+ |

| 优化维度 | 关键措施 |
|---|---|
| 设计态 | 虚拟化渲染（>200节点）· 拖拽 Ghost · 300ms 防抖 · Web Worker（吸附/A*/碰撞） |
| 运行态 | 按类型代码分割 · WebSocket 帧节流 · ECharts 增量更新 · IndexedDB 缓存 |
| 混合画布 | 纯 CSS 动画（GPU）· IntersectionObserver 暂停非可见 · 边路径 memoize · Canvas 降级 |

---

## 23 权限控制与安全设计

**RBAC：** 超管 / 管理员 / 设计师 / 访客，资源级细粒度（创建/编辑/发布/删除/查看）。

| 安全维度 | 措施 |
|---|---|
| 数据安全 | 凭证服务端加密；API 密钥代理转发；敏感字段脱敏 |
| 发布安全 | 密码保护 / IP 白名单 / Token 时效；Referer 白名单；SRI 完整性校验 |
| 代码安全 | JS 沙箱执行；自定义代码组件隔离 |

---

## 24 国际化与无障碍设计

**i18n：** vue-i18n v9，懒加载语言包，默认支持简体中文/繁体中文/英语/日语/阿拉伯语（RTL），遵循 ECMA-402 Intl 标准。

**a11y：** 键盘导航 · 全量 ARIA label · 颜色非唯一信息载体 · WCAG 2.1 AA 对比度 · 拖拽有键盘替代（坐标输入框）

---

## 25 部署与发布方案

| 部署方式 | 说明 |
|---|---|
| SaaS 云端 | Nginx/CDN → API Gateway → 微服务 → PostgreSQL+Redis+MinIO+ClickHouse |
| Docker Compose | 一键部署（开发/测试环境） |
| Kubernetes Helm | 生产环境高可用 |
| 离线 air-gap | 含所有依赖镜像的离线安装包 |
| 国产化 | 鲲鹏/龙芯架构，达梦/人大金仓数据库 |

**大屏发布流程：** 设计完成 → 预览检查 → 配置发布（权限/密码/时效）→ Schema 压缩+版本快照 → 生成 URL → 访问/iframe/SDK

**版本管理：** 每次发布创建 Schema 快照 · 可回滚 · 灰度发布 · 热更新（SSE + 增量 Patch，不刷新页面）

---

## 26 嵌入 SDK 设计

```typescript
// Web Component（框架无关）
import '@screen/embed-sdk'
// <screen-renderer screen-id="xxx" token="yyy" theme="dark"></screen-renderer>

// Vue 组件
import { ScreenRenderer } from '@screen/embed-sdk/vue'
// <ScreenRenderer :screenId="id" :token="token" :variables="vars" @event="onEvent"/>

// JS API
const renderer = new ScreenRenderer({
  container: '#app',
  screenId: 'screen_xxx',
  token: 'jwt_token',
  variables: { siteId: '001' },
  onEvent: (eventName, data) => {}
})
renderer.setVariables({ timeRange: '7d' })
renderer.destroy()
```

Token 由服务端签发（JWT），含屏幕 ID、有效期、Referer 白名单，支持自动续期。

---

## 27 监控与操作审计

| 维度 | 说明 |
|---|---|
| 前端性能监控 | Sentry 异常采集；Web Vitals（FCP/LCP/CLS）；发布端帧率监控 |
| 运营统计 | 大屏 PV/UV；数据源请求成功率；组件点击热力图 |
| 操作审计日志 | 谁/时间/资源/操作全记录；支持查询和导出；满足等保 2.0 合规 |

---

## 28 主题引擎与全局样式

工业级大屏需要极强的样式定制化能力，方案采用 **CSS 变量定义契约 + UnoCSS 原子化编排** 结合的双轨驱动模型：

- **CSS Theme Tokens**：抽取超过 200 个全局设计 Token（色彩、响应式断点、阴影深浅），映射为全局 CSS 变量。支持无缝切换黑暗工业、明亮科技等不同主题风貌。
- **UnoCSS 深度集成**：利用框架按需生成原子化样式的特性减少冗余大屏加载文件体积。借助 `@unocss/preset-icons` 进行图标集按需自动引用打包。
- **组件深层继承覆盖**：从底座图表引擎到 Element Plus 工具库均继承根级设计 Token。主题切换不再繁杂，对 Document 的样式映射毫秒内即可产生全局换肤效果。

---

## 29 多人协同架构设计 (预研)

针对企业级高频协作应用场景（同一工业组态图或数字孪生中台），方案设计并预引入基于 **Y.js (CRDT)** 的全套协作机制。

| 协同模块 | 技术方案 | 解决的核心痛点 |
|---|---|---|
| **状态同步** | Y.js + y-websocket | 基于 CRDT 无锁并发同步计算结构，替代落后的 OT（操作转换） 锁机制，网络时延下极其健壮。 |
| **冲突解决** | 增量操作队列映射 | 当两名设计师拖动图表或变更 Vue Flow 工业图元配置，依时间向量平滑合并视图，不会全量覆盖或断联崩溃。 |
| **协同觉察** | Awareness Protocol | 透传用户的键鼠指针坐标轨迹与圈层光标，标记组件高亮（如 "张工 正在编辑折线图"）。 |
| **离线接管** | IndexedDB 本地快照缓存 | 协同弱网/断网降维为本地编辑栈，切回在线环境将自动执行差异快照版本整合。 |

---

## 30 测试与质量保障体系

为了保障工业生产网和高价值控制大屏的不间断可用性构建全方位测试底座：

1. **核心逻辑单元级测试 (Vitest)**：重兵部署针对 Schema 生成、数据沙箱转换、历史撤回防溢出等关键抽象层逻辑验证单元，覆盖率强制 > 80%。
2. **端到端视图操作链路级 (Playwright)**：深度集成构建测试用例编排（涉及物料托盘拖放验证、画布吸附算法行为和弹窗层级捕获交互），作为持续重构护城河。
3. **视觉特征快照回归 (Visual Snapshot)**：聚焦流体连线动画、SVG 图形染色等高度可视觉化的模块进行像素级快照比对验证。

---

## 31 迭代路线图

| 阶段 | 时间 | 核心交付 |
|---|---|---|
| Phase 1 | Month 1~3 | 设计器 MVP：画布引擎、拖拽系统、10个图表组件、历史记录、Schema v2.0 |
| Phase 2 | Month 4~6 | 数据+混合画布 MVP：完整数据源、@vue-flow 接入、3种边动画、Schema v2.1 |
| Phase 3 | Month 7~9 | 工业图元+企业级：200+工业图元、全7种动画、A* 避障、RBAC、嵌入 SDK |
| Phase 4 | Month 10~12 | 高级特性：AI 辅助、多人协同（Y.js CRDT）、动画编辑器、插件市场、等保合规 |

**工程质量保障（贯穿全程）：**

- 测试覆盖率：核心引擎单元测试 ≥ 80%；Playwright E2E；性能回归基准
- 代码质量：TypeScript 严格模式；ESLint + Prettier；pre-commit hooks；Storybook 组件文档
- 迭代规范：Semantic Versioning；Conventional Commits；Changelog 自动生成；UAT 后发布

> **团队配置：** Phase 2 起建议扩充「图引擎」方向工程师 1-2 名（熟悉 SVG/Canvas 动画+图算法），混合画布新增工作量约 **40%**，建议在 Phase 2~3 预留充足缓冲期。

---

*文档版本：v2.1 · 技术栈：Vue 3.5+ / Vite 7.3.1 / UnoCSS / @vue-flow/core · create-vue (npm create vue@latest) · 更新日期：2026-03*
