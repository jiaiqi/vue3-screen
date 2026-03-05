# Tasks

## Task 1: 更新 PanelState 类型定义
- [x] SubTask 1.1: 修改 `designer.ts` 中的 `PanelState` 接口，将 `layer` 从 `height` 改为 `width`
- [x] SubTask 1.2: 添加 `activeTab` 字段用于 Tab 切换状态
- [x] SubTask 1.3: 添加 `setActiveTab` 方法

## Task 2: 创建 RightPanel 组件
- [x] SubTask 2.1: 创建 `apps/designer/src/components/panels/RightPanel.vue`
- [x] SubTask 2.2: 实现 Tab 切换 UI（使用 Element Plus ElTabs）
- [x] SubTask 2.3: 集成 PropsPanel 作为属性 Tab
- [x] SubTask 2.4: 集成 LayerPanel 作为图层 Tab
- [x] SubTask 2.5: 创建 EventPanel 占位组件

## Task 3: 重构 Designer.vue 主布局
- [x] SubTask 3.1: 移除底部图层面板代码
- [x] SubTask 3.2: 引入 RightPanel 组件替代原 PropsPanel
- [x] SubTask 3.3: 调整画布区域布局（移除 layer-panel-container）
- [x] SubTask 3.4: 更新面板折叠逻辑

## Task 4: 实现快捷键支持
- [x] SubTask 4.1: 在 `useKeyboard.ts` 中添加 Ctrl+1/2/3 快捷键绑定
- [x] SubTask 4.2: 实现快捷键切换 Tab 功能

## Task 5: 实现面板状态持久化
- [x] SubTask 5.1: 使用 localStorage 保存 activeTab 状态
- [x] SubTask 5.2: 页面加载时恢复上次选中的 Tab

## Task 6: 图层选择联动优化
- [x] SubTask 6.1: 在 LayerPanel 中选择节点时自动切换到属性 Tab
- [x] SubTask 6.2: 双击图层名称时保持当前 Tab（重命名功能）

## Task 7: 样式优化
- [x] SubTask 7.1: 添加 Tab 切换动画效果（200ms 过渡）
- [x] SubTask 7.2: 优化折叠状态下的图标垂直排列
- [x] SubTask 7.3: 确保响应式布局在小屏幕下正常工作

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 2]
- [Task 7] depends on [Task 3]
