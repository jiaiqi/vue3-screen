import { useCanvasStore } from '@/stores/canvas'
import type { NodeLayout } from '@screen/core'

export interface SnapResult {
  x: number
  y: number
  snappedX: boolean
  snappedY: boolean
  guides: { type: 'vertical' | 'horizontal'; position: number }[]
}

export function useSnap() {
  const store = useCanvasStore()

  const snapThreshold = 5

  function snapToGrid(value: number): number {
    if (!store.config.grid?.snap) return value
    const gridSize = store.config.grid.size
    return Math.round(value / gridSize) * gridSize
  }

  function snapToPoint(
    x: number,
    y: number,
    nodes: { layout: NodeLayout; id: string }[],
    excludeIds: string[] = []
  ): SnapResult {
    const result: SnapResult = {
      x,
      y,
      snappedX: false,
      snappedY: false,
      guides: [],
    }

    if (store.config.grid?.snap) {
      result.x = snapToGrid(x)
      result.y = snapToGrid(y)
      result.snappedX = true
      result.snappedY = true
    }

    const filteredNodes = nodes.filter(n => !excludeIds.includes(n.id))

    for (const node of filteredNodes) {
      const nodeCenterX = node.layout.x + node.layout.w / 2
      const nodeCenterY = node.layout.y + node.layout.h / 2
      const nodeRight = node.layout.x + node.layout.w
      const nodeBottom = node.layout.y + node.layout.h

      if (Math.abs(x - node.layout.x) < snapThreshold && !result.snappedX) {
        result.x = node.layout.x
        result.snappedX = true
        result.guides.push({ type: 'vertical', position: node.layout.x })
      }
      if (Math.abs(x - nodeCenterX) < snapThreshold && !result.snappedX) {
        result.x = nodeCenterX
        result.snappedX = true
        result.guides.push({ type: 'vertical', position: nodeCenterX })
      }
      if (Math.abs(x - nodeRight) < snapThreshold && !result.snappedX) {
        result.x = nodeRight
        result.snappedX = true
        result.guides.push({ type: 'vertical', position: nodeRight })
      }

      if (Math.abs(y - node.layout.y) < snapThreshold && !result.snappedY) {
        result.y = node.layout.y
        result.snappedY = true
        result.guides.push({ type: 'horizontal', position: node.layout.y })
      }
      if (Math.abs(y - nodeCenterY) < snapThreshold && !result.snappedY) {
        result.y = nodeCenterY
        result.snappedY = true
        result.guides.push({ type: 'horizontal', position: nodeCenterY })
      }
      if (Math.abs(y - nodeBottom) < snapThreshold && !result.snappedY) {
        result.y = nodeBottom
        result.snappedY = true
        result.guides.push({ type: 'horizontal', position: nodeBottom })
      }
    }

    return result
  }

  return {
    snapToGrid,
    snapToPoint,
    snapThreshold,
  }
}
