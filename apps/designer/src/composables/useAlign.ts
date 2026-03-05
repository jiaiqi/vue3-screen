import type { ComponentNode, GraphNodeSchema, NodeLayout } from '@screen/core'

type AlignNode = ComponentNode | GraphNodeSchema

function getNodeBounds(nodes: AlignNode[]) {
  if (nodes.length === 0) {
    return null
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach(node => {
    const { x, y, w, h } = node.layout
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x + w)
    maxY = Math.max(maxY, y + h)
  })

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  }
}

export function useAlign() {
  function alignLeft(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 2) return []
    const bounds = getNodeBounds(nodes)
    if (!bounds) return []

    return nodes.map(node => ({
      ...node.layout,
      x: bounds.minX,
    }))
  }

  function alignCenter(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 2) return []
    const bounds = getNodeBounds(nodes)
    if (!bounds) return []

    return nodes.map(node => ({
      ...node.layout,
      x: bounds.centerX - node.layout.w / 2,
    }))
  }

  function alignRight(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 2) return []
    const bounds = getNodeBounds(nodes)
    if (!bounds) return []

    return nodes.map(node => ({
      ...node.layout,
      x: bounds.maxX - node.layout.w,
    }))
  }

  function alignTop(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 2) return []
    const bounds = getNodeBounds(nodes)
    if (!bounds) return []

    return nodes.map(node => ({
      ...node.layout,
      y: bounds.minY,
    }))
  }

  function alignMiddle(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 2) return []
    const bounds = getNodeBounds(nodes)
    if (!bounds) return []

    return nodes.map(node => ({
      ...node.layout,
      y: bounds.centerY - node.layout.h / 2,
    }))
  }

  function alignBottom(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 2) return []
    const bounds = getNodeBounds(nodes)
    if (!bounds) return []

    return nodes.map(node => ({
      ...node.layout,
      y: bounds.maxY - node.layout.h,
    }))
  }

  function distributeHorizontally(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 3) return []

    const sortedNodes = [...nodes].sort((a, b) => a.layout.x - b.layout.x)
    const bounds = getNodeBounds(nodes)
    if (!bounds) return []

    const totalWidth = sortedNodes.reduce((sum, node) => sum + node.layout.w, 0)
    const totalGap = bounds.width - totalWidth
    const gap = totalGap / (sortedNodes.length - 1)

    const layouts: NodeLayout[] = []
    let currentX = bounds.minX

    sortedNodes.forEach(node => {
      layouts.push({
        ...node.layout,
        x: currentX,
      })
      currentX += node.layout.w + gap
    })

    return layouts
  }

  function distributeVertically(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 3) return []

    const sortedNodes = [...nodes].sort((a, b) => a.layout.y - b.layout.y)
    const bounds = getNodeBounds(nodes)
    if (!bounds) return []

    const totalHeight = sortedNodes.reduce((sum, node) => sum + node.layout.h, 0)
    const totalGap = bounds.height - totalHeight
    const gap = totalGap / (sortedNodes.length - 1)

    const layouts: NodeLayout[] = []
    let currentY = bounds.minY

    sortedNodes.forEach(node => {
      layouts.push({
        ...node.layout,
        y: currentY,
      })
      currentY += node.layout.h + gap
    })

    return layouts
  }

  function equalWidth(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 2) return []

    const firstNode = nodes[0]
    const targetWidth = firstNode.layout.w

    return nodes.map(node => ({
      ...node.layout,
      w: targetWidth,
    }))
  }

  function equalHeight(nodes: AlignNode[]): NodeLayout[] {
    if (nodes.length < 2) return []

    const firstNode = nodes[0]
    const targetHeight = firstNode.layout.h

    return nodes.map(node => ({
      ...node.layout,
      h: targetHeight,
    }))
  }

  return {
    alignLeft,
    alignCenter,
    alignRight,
    alignTop,
    alignMiddle,
    alignBottom,
    distributeHorizontally,
    distributeVertically,
    equalWidth,
    equalHeight,
  }
}
