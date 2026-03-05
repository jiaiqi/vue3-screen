# 设计器核心功能完善 Spec

## Why

当前设计器页面仅显示空的三栏布局，缺少实际功能实现。用户无法进行任何设计操作，与设计文档描述的工业级低代码大屏设计器差距巨大。需要严格遵循设计文档实现完整的设计器核心功能。

## What Changes

### 核心功能模块

- **画布引擎**：实现完整的坐标系管理、缩放平移、标尺辅助线、网格吸附、鸟瞰图导航
- **拖拽系统**：实现物料拖入画布、画布内节点移动、多选批量操作、节点 resize
- **属性面板**：实现 JSON Schema 表单生成、样式配置、数据绑定配置
- **图层面板**：实现树形结构展示、图层排序、锁定/隐藏、搜索过滤
- **物料面板**：实现组件分类展示、搜索、预览、拖拽源
- **历史记录**：实现完整的撤销/重做功能
- **快捷键系统**：实现设计文档定义的所有快捷键

### UI/UX 改进

- **工业科技风格**：深色主题、科技边框、流光效果
- **专业图标系统**：使用 Carbon Icons，禁止 emoji
- **响应式布局**：支持面板折叠、拖拽调整宽度
- **无障碍访问**：ARIA labels、键盘导航

## Impact

- Affected specs: `init-vue3-screen-designer`
- Affected code: 
  - `apps/designer/src/views/Designer.vue` — 主布局重构
  - `apps/designer/src/components/` — 所有组件完善
  - `apps/designer/src/composables/` — 所有 composables 完善
  - `apps/designer/src/stores/` — 所有 stores 完善

## ADDED Requirements

### Requirement: 设计器主布局

系统 SHALL 提供完整的设计器主布局，包含顶部工具栏、左侧物料面板、中间画布区域、右侧属性面板、底部图层面板。

#### Scenario: 设计器初始化
- **WHEN** 用户打开设计器
- **THEN** 显示完整的设计器界面，包含：
  - 顶部工具栏：文件操作、编辑操作、视图控制、对齐工具
  - 左侧物料面板：组件分类、搜索框、组件列表
  - 中间画布区域：标尺、网格、画布内容、鸟瞰图
  - 右侧属性面板：属性 Tab、样式 Tab、数据 Tab
  - 底部图层面板：图层树、搜索、操作按钮

### Requirement: 画布引擎完整实现

系统 SHALL 提供完整的画布引擎功能。

#### Scenario: 画布缩放
- **WHEN** 用户使用 Ctrl+滚轮或缩放按钮
- **THEN** 画布按比例缩放，支持 10%~400% 范围

#### Scenario: 画布平移
- **WHEN** 用户按住 Space 拖动或使用中键拖动
- **THEN** 画布内容跟随移动

#### Scenario: 标尺显示
- **WHEN** 画布显示时
- **THEN** 左侧和顶部显示标尺，单位为像素

#### Scenario: 辅助线
- **WHEN** 用户从标尺拖出
- **THEN** 创建水平或垂直辅助线，支持删除

#### Scenario: 网格吸附
- **WHEN** 启用网格吸附且用户拖动组件
- **THEN** 组件位置吸附到最近的网格点

### Requirement: 物料面板完整实现

系统 SHALL 提供完整的物料面板功能。

#### Scenario: 组件分类展示
- **WHEN** 物料面板加载
- **THEN** 显示组件分类：图表类、地图类、数据类、装饰类、容器类、媒体类

#### Scenario: 组件搜索
- **WHEN** 用户输入搜索关键词
- **THEN** 过滤显示匹配的组件

#### Scenario: 组件拖拽
- **WHEN** 用户拖拽组件到画布
- **THEN** 组件正确放置在画布上，显示 Ghost 预览

### Requirement: 属性面板完整实现

系统 SHALL 提供完整的属性配置面板。

#### Scenario: 属性配置
- **WHEN** 用户选中组件
- **THEN** 属性面板显示该组件的可配置属性

#### Scenario: 样式配置
- **WHEN** 用户切换到样式 Tab
- **THEN** 显示尺寸、位置、背景、边框、阴影等配置项

#### Scenario: 数据绑定
- **WHEN** 用户切换到数据 Tab
- **THEN** 显示数据源选择、字段映射、刷新频率配置

### Requirement: 图层面板完整实现

系统 SHALL 提供完整的图层面板功能。

#### Scenario: 图层树展示
- **WHEN** 画布上有组件
- **THEN** 图层面板显示所有组件的树形结构

#### Scenario: 图层操作
- **WHEN** 用户点击图层操作按钮
- **THEN** 支持锁定、隐藏、重命名、删除操作

#### Scenario: 图层排序
- **WHEN** 用户拖拽图层项
- **THEN** 组件层级顺序改变

### Requirement: 历史记录系统

系统 SHALL 提供完整的撤销/重做功能。

#### Scenario: 撤销操作
- **WHEN** 用户执行 Ctrl+Z
- **THEN** 撤销上一步操作

#### Scenario: 重做操作
- **WHEN** 用户执行 Ctrl+Y
- **THEN** 重做已撤销的操作

### Requirement: 快捷键系统

系统 SHALL 实现设计文档定义的所有快捷键。

#### Scenario: 常用快捷键
- **WHEN** 用户按下快捷键
- **THEN** 执行对应操作：
  - Ctrl+Z/Y：撤销/重做
  - Ctrl+C/V/D：复制/粘贴/原地复制
  - Delete/Backspace：删除选中
  - Ctrl+A：全选
  - Escape：取消选中
  - 方向键：微移 1px/10px

### Requirement: 顶部工具栏

系统 SHALL 提供完整的顶部工具栏。

#### Scenario: 工具栏功能
- **WHEN** 设计器加载
- **THEN** 显示工具栏按钮：
  - 文件：新建、打开、保存、另存为
  - 编辑：撤销、重做
  - 视图：缩放比例、适应屏幕、100%
  - 对齐：左对齐、居中、右对齐等（多选时显示）

### Requirement: 工业科技风格 UI

系统 SHALL 采用工业科技风格的 UI 设计。

#### Scenario: 深色主题
- **WHEN** 设计器显示
- **THEN** 使用深色背景、科技蓝高亮、流光边框效果

#### Scenario: 专业图标
- **WHEN** 显示图标
- **THEN** 使用 Carbon Icons，禁止 emoji

## MODIFIED Requirements

### Requirement: Designer.vue 主视图重构

原有的简单三栏布局 SHALL 重构为完整的设计器布局。

#### Scenario: 布局重构
- **WHEN** Designer.vue 加载
- **THEN** 整合所有已创建的组件和 composables，实现完整功能
