import { computed } from 'vue'
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

  const snapEnabled = computed(() => store.config.grid?.snap ?? false)

  const gridSize = computed(() => store.config.grid?.size ?? 10)

  function snapToGrid(value: number): number {
    if (!snapEnabled.value) return value
    const size = gridSize.value
    return Math.round(value / size) * size
  }

  function snapToGridPoint(x: number, y: number): { x: number; y: number } {
    if (!snapEnabled.value) return { x, y }
    return {
      x: snapToGrid(x),
      y: snapToGrid(y),
    }
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

    if (snapEnabled.value) {
      const gridSnappedX = snapToGrid(x)
      const gridSnappedY = snapToGrid(y)
      
      if (Math.abs(x - gridSnappedX) < snapThreshold) {
        result.x = gridSnappedX
        result.snappedX = true
      }
      if (Math.abs(y - gridSnappedY) < snapThreshold) {
        result.y = gridSnappedY
        result.snappedY = true
      }
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

  function snapRect(
    x: number,
    y: number,
    width: number,
    height: number,
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

    if (snapEnabled.value) {
      const gridSnappedX = snapToGrid(x)
      const gridSnappedY = snapToGrid(y)
      
      if (Math.abs(x - gridSnappedX) < snapThreshold) {
        result.x = gridSnappedX
        result.snappedX = true
      }
      if (Math.abs(y - gridSnappedY) < snapThreshold) {
        result.y = gridSnappedY
        result.snappedY = true
      }
    }

    const filteredNodes = nodes.filter(n => !excludeIds.includes(n.id))

    const edges = {
      left: x,
      centerX: x + width / 2,
      right: x + width,
      top: y,
      centerY: y + height / 2,
      bottom: y + height,
    }

    for (const node of filteredNodes) {
      const nodeEdges = {
        left: node.layout.x,
        centerX: node.layout.x + node.layout.w / 2,
        right: node.layout.x + node.layout.w,
        top: node.layout.y,
        centerY: node.layout.y + node.layout.h / 2,
        bottom: node.layout.y + node.layout.h,
      }

      if (!result.snappedX) {
        if (Math.abs(edges.left - nodeEdges.left) < snapThreshold) {
          result.x = nodeEdges.left
          result.snappedX = true
          result.guides.push({ type: 'vertical', position: nodeEdges.left })
        } else if (Math.abs(edges.centerX - nodeEdges.centerX) < snapThreshold) {
          result.x = nodeEdges.centerX - width / 2
          result.snappedX = true
          result.guides.push({ type: 'vertical', position: nodeEdges.centerX })
        } else if (Math.abs(edges.right - nodeEdges.right) < snapThreshold) {
          result.x = nodeEdges.right - width
          result.snappedX = true
          result.guides.push({ type: 'vertical', position: nodeEdges.right })
        } else if (Math.abs(edges.left - nodeEdges.right) < snapThreshold) {
          result.x = nodeEdges.right
          result.snappedX = true
          result.guides.push({ type: 'vertical', position: nodeEdges.right })
        } else if (Math.abs(edges.right - nodeEdges.left) < snapThreshold) {
          result.x = nodeEdges.left - width
          result.snappedX = true
          result.guides.push({ type: 'vertical', position: nodeEdges.left })
        }
      }

      if (!result.snappedY) {
        if (Math.abs(edges.top - nodeEdges.top) < snapThreshold) {
          result.y = nodeEdges.top
          result.snappedY = true
          result.guides.push({ type: 'horizontal', position: nodeEdges.top })
        } else if (Math.abs(edges.centerY - nodeEdges.centerY) < snapThreshold) {
          result.y = nodeEdges.centerY - height / 2
          result.snappedY = true
          result.guides.push({ type: 'horizontal', position: nodeEdges.centerY })
        } else if (Math.abs(edges.bottom - nodeEdges.bottom) < snapThreshold) {
          result.y = nodeEdges.bottom - height
          result.snappedY = true
          result.guides.push({ type: 'horizontal', position: nodeEdges.bottom })
        } else if (Math.abs(edges.top - nodeEdges.bottom) < snapThreshold) {
          result.y = nodeEdges.bottom
          result.snappedY = true
          result.guides.push({ type: 'horizontal', position: nodeEdges.bottom })
        } else if (Math.abs(edges.bottom - nodeEdges.top) < snapThreshold) {
          result.y = nodeEdges.top - height
          result.snappedY = true
          result.guides.push({ type: 'horizontal', position: nodeEdges.top })
        }
      }
    }

    return result
  }

  return {
    snapToGrid,
    snapToGridPoint,
    snapToPoint,
    snapRect,
    snapEnabled,
    gridSize,
    snapThreshold,
  }
}
