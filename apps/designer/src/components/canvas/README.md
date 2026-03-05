# Port 连接点系统使用指南

## 概述

Port 连接点系统为 Vue3 低代码大屏设计器提供了完整的节点连接功能，支持拖拽连线、连接验证、自动路径计算等特性。

## 核心组件

### 1. Port.vue

显示在图元节点边缘的连接点组件。

**Props:**
- `portId`: 端口唯一标识
- `nodeId`: 所属节点 ID
- `position`: 位置 ('top' | 'right' | 'bottom' | 'left')
- `portType`: 类型 ('input' | 'output' | 'both')
- `offset`: 偏移量 `{ x: number, y: number }` (百分比)
- `dataType`: 数据类型 (用于类型检查)
- `disabled`: 是否禁用

**Events:**
- `dragStart`: 开始拖拽连线
- `dragEnd`: 结束拖拽

**示例:**
```vue
<Port
  port-id="node1-port-output-1"
  node-id="node1"
  position="right"
  port-type="output"
  :offset="{ x: 50, y: 50 }"
  data-type="number"
  @drag-start="handlePortDragStart"
  @drag-end="handlePortDragEnd"
/>
```

### 2. EdgePreview.vue

拖拽连线时的预览组件。

**Props:**
- `path`: SVG 路径数据
- `isValid`: 连接是否有效
- `sourceX`, `sourceY`: 起点坐标
- `targetX`, `targetY`: 终点坐标

**样式特性:**
- 有效连接：绿色虚线
- 无效连接：红色虚线
- 动态虚线动画
- 箭头标识

### 3. Edge.vue

已建立连接的渲染组件。

**Props:**
- `id`: 连接 ID
- `sourceX`, `sourceY`: 起点坐标
- `targetX`, `targetY`: 终点坐标
- `sourcePosition`: 起点方向
- `targetPosition`: 终点方向
- `selected`: 是否选中
- `animated`: 是否动画
- `type`: 路径类型 ('straight' | 'bezier' | 'orthogonal')

**Events:**
- `click`: 点击连接
- `contextmenu`: 右键菜单

### 4. PortsEdgeLayer.vue

连接层容器组件，负责渲染所有连接和拖拽预览。

## Composables

### useEdgeDrag

处理连线拖拽逻辑。

**使用示例:**
```typescript
import { useEdgeDrag } from '@/composables/useEdgeDrag'

const {
  isDraggingEdge,
  dragSourcePort,
  edgePreview,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  cancelDrag,
} = useEdgeDrag({
  canvasStore,
  containerRef,
  onEdgeCreate: (sourcePortId, targetPortId) => {
    console.log('创建连接', sourcePortId, targetPortId)
  },
  onEdgeDrag: (edgeData) => {
    console.log('拖拽中', edgeData)
  },
  onEdgeEnd: () => {
    console.log('拖拽结束')
  },
})
```

## Utils

### edgeValidation.ts

连接验证工具。

**主要函数:**
- `validateConnection(sourcePort, targetPort, existingEdges)`: 验证连接是否合法
- `isDataTypeCompatible(sourceType, targetType)`: 检查数据类型兼容性
- `wouldCreateCycle(sourceNodeId, targetNodeId, edges)`: 检查是否形成循环
- `getConnectedPorts(nodeId, edges)`: 获取节点的连接端口
- `canAddMoreConnections(portId, portType, edges, maxConnections)`: 检查是否可以添加更多连接

**验证规则:**
1. 不能连接到自身节点
2. 输出端口只能连接到输入端口
3. 不能存在重复连接
4. 数据类型必须兼容
5. 不能形成循环依赖
6. 输出端口连接数限制

**数据类型层次:**
```typescript
{
  'any': ['number', 'string', 'boolean', 'object', 'array'],
  'number': [],
  'string': [],
  'boolean': [],
  'object': ['array'],
  'array': [],
}
```

### edgePathfinding.ts

连线路径计算工具。

**主要函数:**
- `calculateStraightPath(p1, p2)`: 直线路径
- `calculateBezierPath(p1, p2, sourcePosition, targetPosition)`: 贝塞尔曲线路径
- `calculateOrthogonalPath(p1, p2, sourcePosition, targetPosition, obstacles)`: 正交路径（带避障）
- `avoidObstacles(path, obstacles, margin)`: 避开障碍物

**路径类型:**
1. **Straight**: 两点之间的直线
2. **Bezier**: 平滑曲线，适合大多数场景
3. **Orthogonal**: 水平和垂直线段，使用 A* 算法避障

### idGenerator.ts

ID 生成工具。

**主要函数:**
- `generateId(prefix)`: 生成唯一 ID
- `generatePortId(nodeId, position, index)`: 生成端口 ID
- `generateEdgeId(sourcePortId, targetPortId)`: 生成连接 ID
- `parsePortId(portId)`: 解析端口 ID

## Store 扩展

canvas.ts 添加了以下状态和方法：

**State:**
- `edgeDragging: boolean`: 是否正在拖拽连线
- `edgePreview: EdgePreviewData | null`: 拖拽预览数据
- `edges: Edge[]`: 所有连接列表

**Methods:**
- `startEdgeDrag(port)`: 开始拖拽连线
- `updateEdgeDrag(x, y, isValid, path)`: 更新拖拽位置
- `endEdgeDrag(targetPortId)`: 结束拖拽
- `addEdge(edge)`: 添加连接
- `removeEdge(edgeId)`: 删除连接
- `getEdgesForNode(nodeId)`: 获取节点的连接
- `clearEdges()`: 清空所有连接
- `cancelEdgeDrag()`: 取消拖拽

## 完整使用示例

### 1. 在节点中添加 Port

```vue
<script setup lang="ts">
import { computed } from 'vue'
import Port from '@/components/canvas/Port.vue'
import { useCanvasStore } from '@/stores/canvas'

const canvasStore = useCanvasStore()

const ports = computed(() => [
  {
    id: 'output-1',
    position: 'right',
    portType: 'output',
    offset: { x: 50, y: 30 },
    dataType: 'number',
  },
  {
    id: 'input-1',
    position: 'left',
    portType: 'input',
    offset: { x: 50, y: 70 },
    dataType: 'any',
  },
])

function handlePortDragStart(portId: string, event: MouseEvent) {
  const port = ports.value.find(p => p.id === portId)
  if (!port) return
  
  canvasStore.startEdgeDrag({
    id: portId,
    nodeId: 'node1',
    position: port.position,
    portType: port.portType,
    offset: port.offset,
    dataType: port.dataType,
  })
}

function handlePortDragEnd(portId: string, event: MouseEvent) {
  const targetElement = document.elementFromPoint(event.clientX, event.clientY)
  const targetPortElement = targetElement?.closest('[data-port-id]') as HTMLElement
  
  if (targetPortElement) {
    const targetPortId = targetPortElement.dataset.portId
    const targetNodeId = targetPortElement.dataset.nodeId
    
    if (targetPortId && targetNodeId && targetNodeId !== 'node1') {
      canvasStore.endEdgeDrag(targetPortId)
      
      canvasStore.addEdge({
        id: `edge-${portId}-${targetPortId}`,
        sourcePortId: portId,
        sourceNodeId: 'node1',
        targetPortId,
        targetNodeId,
      })
    } else {
      canvasStore.cancelEdgeDrag()
    }
  } else {
    canvasStore.cancelEdgeDrag()
  }
}
</script>

<template>
  <div class="node">
    <Port
      v-for="port in ports"
      :key="port.id"
      :port-id="port.id"
      :node-id="'node1'"
      :position="port.position"
      :port-type="port.portType"
      :offset="port.offset"
      :data-type="port.dataType"
      @drag-start="handlePortDragStart"
      @drag-end="handlePortDragEnd"
    />
  </div>
</template>
```

### 2. 在 Canvas 中添加 EdgeLayer

```vue
<template>
  <div class="canvas-container">
    <div class="canvas">
      <PortsEdgeLayer />
      
      <div class="nodes">
        <GraphNode v-for="node in nodes" :key="node.id" v-bind="node" />
      </div>
    </div>
  </div>
</template>
```

### 3. 验证连接

```typescript
import { validateConnection } from '@/utils/edgeValidation'

const sourcePort = {
  id: 'node1-output-1',
  nodeId: 'node1',
  portType: 'output',
  dataType: 'number',
}

const targetPort = {
  id: 'node2-input-1',
  nodeId: 'node2',
  portType: 'input',
  dataType: 'number',
}

const result = validateConnection(sourcePort, targetPort, canvasStore.edges)

if (result.isValid) {
  console.log('连接有效')
} else {
  console.error('连接无效:', result.message)
  console.error('错误代码:', result.errorCode)
}
```

### 4. 计算连线路径

```typescript
import { calculateBezierPath, calculateOrthogonalPath } from '@/utils/edgePathfinding'

const p1 = { x: 100, y: 200 }
const p2 = { x: 400, y: 300 }

const bezierPath = calculateBezierPath(p1, p2, 'right', 'left')
console.log('贝塞尔路径:', bezierPath.path)

const orthogonalPath = calculateOrthogonalPath(p1, p2, 'right', 'left', [])
console.log('正交路径:', orthogonalPath.path)
```

## UI 样式

### Port 样式
- **输出端口**: 科技蓝 (#00d4ff)
- **输入端口**: 生态绿 (#10b981)
- **双向端口**: 紫色 (#8b5cf6)
- **禁用端口**: 灰色 (#6b7280)
- **悬停效果**: 放大 1.3 倍 + 发光阴影

### Edge 样式
- **拖拽预览**: 虚线动画
- **有效连接**: 绿色 (#10b981)
- **无效连接**: 红色 (#ef4444)
- **已选中**: 加粗 + 发光效果
- **默认**: 灰色 (#6b7280)

## 注意事项

1. **性能优化**: 大量连接时建议使用 `calculateStraightPath` 而非 `calculateOrthogonalPath`
2. **类型安全**: 始终指定 `dataType` 以启用类型检查
3. **唯一 ID**: 使用 `idGenerator` 工具生成唯一 ID
4. **事件冒泡**: Port 事件会阻止冒泡，避免触发节点拖拽
5. **缩放适配**: 所有坐标计算都考虑了 canvas 的缩放比例

## 未来扩展

- [ ] 支持连接点分组
- [ ] 支持连接动画
- [ ] 支持连接标签
- [ ] 支持批量删除连接
- [ ] 支持连接撤销/重做
- [ ] 支持连接导入/导出
