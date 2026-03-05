# Tasks

## Phase 1: 设计器主布局重构

- [x] Task 1: 重构 Designer.vue 主布局
  - [x] SubTask 1.1: 创建顶部工具栏组件 (TopToolbar.vue)
  - [x] SubTask 1.2: 实现左侧物料面板折叠功能
  - [x] SubTask 1.3: 实现右侧属性面板折叠功能
  - [x] SubTask 1.4: 实现底部图层面板展开/收起
  - [x] SubTask 1.5: 整合所有面板组件到主布局

## Phase 2: 画布引擎完善

- [x] Task 2: 实现画布缩放平移
  - [x] SubTask 2.1: 实现 Ctrl+滚轮缩放 (10%~400%)
  - [x] SubTask 2.2: 实现 Space+拖动平移
  - [x] SubTask 2.3: 实现中键拖动平移
  - [x] SubTask 2.4: 实现缩放控制按钮 (放大/缩小/适应/100%)

- [x] Task 3: 实现标尺和辅助线
  - [x] SubTask 3.1: 实现水平标尺组件
  - [x] SubTask 3.2: 实现垂直标尺组件
  - [x] SubTask 3.3: 实现从标尺拖出辅助线
  - [x] SubTask 3.4: 实现辅助线删除功能

- [x] Task 4: 实现网格吸附
  - [x] SubTask 4.1: 实现网格显示切换
  - [x] SubTask 4.2: 实现网格吸附开关
  - [x] SubTask 4.3: 实现吸附到网格点逻辑

- [x] Task 5: 实现鸟瞰图导航
  - [x] SubTask 5.1: 创建鸟瞰图缩略图组件
  - [x] SubTask 5.2: 实现点击快速定位
  - [x] SubTask 5.3: 实现视口框显示

## Phase 3: 物料面板完善

- [x] Task 6: 实现组件分类展示
  - [x] SubTask 6.1: 实现图表类组件列表 (折线/柱/饼/仪表盘等)
  - [x] SubTask 6.2: 实现数据类组件列表 (指标卡/表格/进度条等)
  - [x] SubTask 6.3: 实现装饰类组件列表 (边框/标题/背景等)
  - [x] SubTask 6.4: 实现容器类组件列表 (分组/Tab等)

- [x] Task 7: 实现物料搜索和拖拽
  - [x] SubTask 7.1: 实现组件搜索过滤
  - [x] SubTask 7.2: 实现组件缩略图预览
  - [x] SubTask 7.3: 实现 HTML5 拖拽源 (draggable)
  - [x] SubTask 7.4: 实现拖拽 Ghost 预览

## Phase 4: 画布拖拽系统

- [x] Task 8: 实现物料拖入画布
  - [x] SubTask 8.1: 实现画布 drop 接收
  - [x] SubTask 8.2: 实现坐标转换 (屏幕→画布)
  - [x] SubTask 8.3: 实现组件创建和放置
  - [x] SubTask 8.4: 实现 AddNodeCommand 写入历史

- [x] Task 9: 实现画布内节点操作
  - [x] SubTask 9.1: 实现节点选中高亮
  - [x] SubTask 9.2: 实现节点拖动移动
  - [x] SubTask 9.3: 实现节点 resize 手柄
  - [x] SubTask 9.4: 实现多选框选功能

## Phase 5: 属性面板完善

- [x] Task 10: 实现属性 Tab
  - [x] SubTask 10.1: 实现数值输入控件
  - [x] SubTask 10.2: 实现颜色选择器
  - [x] SubTask 10.3: 实现下拉选择控件
  - [x] SubTask 10.4: 实现开关控件

- [x] Task 11: 实现样式 Tab
  - [x] SubTask 11.1: 实现尺寸位置配置
  - [x] SubTask 11.2: 实现背景配置 (颜色/图片/渐变)
  - [x] SubTask 11.3: 实现边框配置
  - [x] SubTask 11.4: 实现阴影配置

- [x] Task 12: 实现数据绑定 Tab
  - [x] SubTask 12.1: 实现数据源选择
  - [x] SubTask 12.2: 实现字段映射
  - [x] SubTask 12.3: 实现刷新频率配置
  - [x] SubTask 12.4: 实现数据预览

## Phase 6: 图层面板完善

- [x] Task 13: 实现图层树
  - [x] SubTask 13.1: 实现树形结构展示
  - [x] SubTask 13.2: 实现图层选中联动
  - [x] SubTask 13.3: 实现图层双击重命名
  - [x] SubTask 13.4: 实现图层搜索过滤

- [x] Task 14: 实现图层操作
  - [x] SubTask 14.1: 实现图层锁定/解锁
  - [x] SubTask 14.2: 实现图层显示/隐藏
  - [x] SubTask 14.3: 实现图层拖拽排序
  - [x] SubTask 14.4: 实现图层删除

## Phase 7: 历史记录和快捷键

- [x] Task 15: 完善历史记录系统
  - [x] SubTask 15.1: 实现 MoveCommand
  - [x] SubTask 15.2: 实现 ResizeCommand
  - [x] SubTask 15.3: 实现 DeleteCommand
  - [x] SubTask 15.4: 实现 BatchCommand

- [x] Task 16: 实现快捷键系统
  - [x] SubTask 16.1: 实现 Ctrl+Z/Y 撤销重做
  - [x] SubTask 16.2: 实现 Ctrl+C/V/D 复制粘贴
  - [x] SubTask 16.3: 实现 Delete 删除
  - [x] SubTask 16.4: 实现方向键微移

## Phase 8: 顶部工具栏

- [x] Task 17: 实现文件操作
  - [x] SubTask 17.1: 实现新建大屏
  - [x] SubTask 17.2: 实现打开大屏
  - [x] SubTask 17.3: 实现保存大屏
  - [x] SubTask 17.4: 实现另存为

- [x] Task 18: 实现编辑操作
  - [x] SubTask 18.1: 实现撤销按钮
  - [x] SubTask 18.2: 实现重做按钮
  - [x] SubTask 18.3: 实现删除按钮
  - [x] SubTask 18.4: 实现复制粘贴按钮

- [x] Task 19: 实现对齐工具栏
  - [x] SubTask 19.1: 实现左/中/右对齐
  - [x] SubTask 19.2: 实现顶/中/底对齐
  - [x] SubTask 19.3: 实现水平/垂直等间距
  - [x] SubTask 19.4: 实现等宽/等高

## Phase 9: UI/UX 完善

- [x] Task 20: 实现工业科技风格
  - [x] SubTask 20.1: 完善深色主题 CSS 变量
  - [x] SubTask 20.2: 实现科技边框样式
  - [x] SubTask 20.3: 实现流光动画效果
  - [x] SubTask 20.4: 实现悬停高亮效果

- [x] Task 21: 实现专业图标系统
  - [x] SubTask 21.1: 安装 @carbon/icons-vue
  - [x] SubTask 21.2: 替换所有 emoji 为 Carbon Icons
  - [x] SubTask 21.3: 统一图标大小和颜色
  - [x] SubTask 21.4: 实现图标悬停效果

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 1]
- [Task 7] depends on [Task 6]
- [Task 8] depends on [Task 7]
- [Task 9] depends on [Task 8]
- [Task 10] depends on [Task 1]
- [Task 11] depends on [Task 10]
- [Task 12] depends on [Task 10]
- [Task 13] depends on [Task 1]
- [Task 14] depends on [Task 13]
- [Task 15] depends on [Task 9]
- [Task 16] depends on [Task 15]
- [Task 17] depends on [Task 1]
- [Task 18] depends on [Task 15]
- [Task 19] depends on [Task 9]
- [Task 20] depends on [Task 1]
- [Task 21] depends on [Task 20]
