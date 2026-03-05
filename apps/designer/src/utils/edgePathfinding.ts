export interface Point {
  x: number
  y: number
}

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface PathResult {
  path: string
  points: Point[]
  type: 'straight' | 'orthogonal' | 'bezier'
}

export function calculateStraightPath(p1: Point, p2: Point): PathResult {
  const path = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
  
  return {
    path,
    points: [p1, p2],
    type: 'straight',
  }
}

export function calculateBezierPath(
  p1: Point,
  p2: Point,
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left',
  targetPosition?: 'top' | 'right' | 'bottom' | 'left'
): PathResult {
  const curvature = 0.5
  const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  const controlOffset = distance * curvature

  let controlX1: number
  let controlY1: number
  let controlX2: number
  let controlY2: number

  if (sourcePosition && targetPosition) {
    const sourceOffsets = getControlOffsets(sourcePosition, controlOffset)
    const targetOffsets = getControlOffsets(targetPosition, controlOffset)

    controlX1 = p1.x + sourceOffsets.x
    controlY1 = p1.y + sourceOffsets.y
    controlX2 = p2.x - targetOffsets.x
    controlY2 = p2.y - targetOffsets.y
  } else {
    controlX1 = p1.x
    controlY1 = p1.y - controlOffset * 0.5
    controlX2 = p2.x
    controlY2 = p2.y + controlOffset * 0.5
  }

  const path = `M ${p1.x} ${p1.y} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${p2.x} ${p2.y}`

  return {
    path,
    points: [p1, { x: controlX1, y: controlY1 }, { x: controlX2, y: controlY2 }, p2],
    type: 'bezier',
  }
}

function getControlOffsets(position: string, offset: number): Point {
  switch (position) {
    case 'top':
      return { x: 0, y: -offset }
    case 'bottom':
      return { x: 0, y: offset }
    case 'left':
      return { x: -offset, y: 0 }
    case 'right':
      return { x: offset, y: 0 }
    default:
      return { x: 0, y: 0 }
  }
}

export function calculateOrthogonalPath(
  p1: Point,
  p2: Point,
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left',
  targetPosition?: 'top' | 'right' | 'bottom' | 'left',
  obstacles: Rectangle[] = []
): PathResult {
  const margin = 20
  let points: Point[] = []

  if (obstacles.length > 0) {
    points = calculateOrthogonalPathWithObstacles(p1, p2, sourcePosition, targetPosition, obstacles, margin)
  } else {
    points = calculateSimpleOrthogonalPath(p1, p2, sourcePosition, targetPosition, margin)
  }

  if (points.length < 2) {
    return calculateBezierPath(p1, p2, sourcePosition, targetPosition)
  }

  const path = pointsToPath(points)

  return {
    path,
    points,
    type: 'orthogonal',
  }
}

function calculateSimpleOrthogonalPath(
  p1: Point,
  p2: Point,
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left',
  targetPosition?: 'top' | 'right' | 'bottom' | 'left',
  margin: number = 20
): Point[] {
  const points: Point[] = [p1]

  const sourceOffset = getDirectionOffset(sourcePosition || 'right', margin)
  const targetOffset = getDirectionOffset(targetPosition || 'left', margin)

  const intermediate1: Point = {
    x: p1.x + sourceOffset.x,
    y: p1.y + sourceOffset.y,
  }
  points.push(intermediate1)

  const intermediate2: Point = {
    x: p2.x - targetOffset.x,
    y: p2.y - targetOffset.y,
  }

  if (sourcePosition === 'top' || sourcePosition === 'bottom') {
    if (Math.abs(intermediate1.x - intermediate2.x) > margin) {
      points.push({ x: intermediate2.x, y: intermediate1.y })
    }
  } else {
    if (Math.abs(intermediate1.y - intermediate2.y) > margin) {
      points.push({ x: intermediate1.x, y: intermediate2.y })
    }
  }

  points.push(intermediate2)
  points.push(p2)

  return optimizeOrthogonalPoints(points)
}

function calculateOrthogonalPathWithObstacles(
  p1: Point,
  p2: Point,
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left',
  targetPosition?: 'top' | 'right' | 'bottom' | 'left',
  obstacles: Rectangle[] = [],
  margin: number = 20
): Point[] {
  const grid = createGrid(p1, p2, obstacles, margin)
  const startNode = pointToNode(p1, grid)
  const endNode = pointToNode(p2, grid)

  if (!startNode || !endNode) {
    return [p1, p2]
  }

  const pathNodes = astar(grid, startNode, endNode)

  if (pathNodes.length === 0) {
    return calculateSimpleOrthogonalPath(p1, p2, sourcePosition, targetPosition, margin)
  }

  const pathPoints = pathNodes.map(node => nodeToPoint(node, margin))
  
  pathPoints.unshift(p1)
  pathPoints.push(p2)

  return optimizeOrthogonalPoints(pathPoints)
}

interface GridNode {
  x: number
  y: number
  walkable: boolean
  g: number
  h: number
  f: number
  parent: GridNode | null
}

function createGrid(
  p1: Point,
  p2: Point,
  obstacles: Rectangle[],
  cellSize: number
): GridNode[][] {
  const minX = Math.min(p1.x, p2.x) - cellSize * 2
  const maxX = Math.max(p1.x, p2.x) + cellSize * 2
  const minY = Math.min(p1.y, p2.y) - cellSize * 2
  const maxY = Math.max(p1.y, p2.y) + cellSize * 2

  const cols = Math.ceil((maxX - minX) / cellSize)
  const rows = Math.ceil((maxY - minY) / cellSize)

  const grid: GridNode[][] = []

  for (let y = 0; y < rows; y++) {
    grid[y] = []
    for (let x = 0; x < cols; x++) {
      const nodeX = minX + x * cellSize
      const nodeY = minY + y * cellSize

      const isObstacle = obstacles.some(
        obs =>
          nodeX >= obs.x &&
          nodeX <= obs.x + obs.width &&
          nodeY >= obs.y &&
          nodeY <= obs.y + obs.height
      )

      grid[y][x] = {
        x,
        y,
        walkable: !isObstacle,
        g: 0,
        h: 0,
        f: 0,
        parent: null,
      }
    }
  }

  return grid
}

function pointToNode(point: Point, grid: GridNode[][]): GridNode | null {
  if (grid.length === 0 || grid[0].length === 0) return null

  const cellSize = 20
  const minX = grid[0][0].x * cellSize
  const minY = grid[0][0].y * cellSize

  const col = Math.floor((point.x - minX) / cellSize)
  const row = Math.floor((point.y - minY) / cellSize)

  if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
    return grid[row][col]
  }

  return grid[0][0]
}

function nodeToPoint(node: GridNode, cellSize: number): Point {
  return {
    x: node.x * cellSize,
    y: node.y * cellSize,
  }
}

function astar(grid: GridNode[][], start: GridNode, end: GridNode): GridNode[] {
  const openList: GridNode[] = [start]
  const closedList: Set<GridNode> = new Set()

  start.g = 0
  start.h = heuristic(start, end)
  start.f = start.h

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f)
    const current = openList.shift()!

    if (current === end) {
      return reconstructPath(current)
    }

    closedList.add(current)

    const neighbors = getNeighbors(grid, current)
    for (const neighbor of neighbors) {
      if (closedList.has(neighbor) || !neighbor.walkable) continue

      const tentativeG = current.g + heuristic(current, neighbor)

      if (!openList.includes(neighbor)) {
        openList.push(neighbor)
      } else if (tentativeG >= neighbor.g) {
        continue
      }

      neighbor.parent = current
      neighbor.g = tentativeG
      neighbor.h = heuristic(neighbor, end)
      neighbor.f = neighbor.g + neighbor.h
    }
  }

  return []
}

function heuristic(a: GridNode, b: GridNode): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function getNeighbors(grid: GridNode[][], node: GridNode): GridNode[] {
  const neighbors: GridNode[] = []
  const { x, y } = node

  if (y > 0) neighbors.push(grid[y - 1][x])
  if (y < grid.length - 1) neighbors.push(grid[y + 1][x])
  if (x > 0) neighbors.push(grid[y][x - 1])
  if (x < grid[0].length - 1) neighbors.push(grid[y][x + 1])

  return neighbors
}

function reconstructPath(node: GridNode): GridNode[] {
  const path: GridNode[] = [node]
  let current: GridNode | null = node

  while (current.parent) {
    path.unshift(current.parent)
    current = current.parent
  }

  return path
}

function pointsToPath(points: Point[]): string {
  if (points.length === 0) return ''

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }

  return path
}

function optimizeOrthogonalPoints(points: Point[]): Point[] {
  if (points.length <= 2) return points

  const optimized: Point[] = [points[0]]

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]

    const prevDx = curr.x - prev.x
    const prevDy = curr.y - prev.y
    const nextDx = next.x - curr.x
    const nextDy = next.y - curr.y

    const isCollinear =
      (prevDx === 0 && nextDx === 0) ||
      (prevDy === 0 && nextDy === 0)

    if (!isCollinear) {
      optimized.push(curr)
    }
  }

  optimized.push(points[points.length - 1])

  return optimized
}

function getDirectionOffset(position: string, distance: number): Point {
  switch (position) {
    case 'top':
      return { x: 0, y: -distance }
    case 'bottom':
      return { x: 0, y: distance }
    case 'left':
      return { x: -distance, y: 0 }
    case 'right':
      return { x: distance, y: 0 }
    default:
      return { x: distance, y: 0 }
  }
}

export function avoidObstacles(
  path: Point[],
  obstacles: Rectangle[],
  margin: number = 20
): Point[] {
  if (obstacles.length === 0 || path.length < 2) {
    return path
  }

  const optimizedPath: Point[] = [path[0]]

  for (let i = 1; i < path.length - 1; i++) {
    const point = path[i]
    const nextPoint = path[i + 1]

    const inObstacle = obstacles.some(
      obs =>
        point.x >= obs.x - margin &&
        point.x <= obs.x + obs.width + margin &&
        point.y >= obs.y - margin &&
        point.y <= obs.y + obs.height + margin
    )

    if (inObstacle) {
      const avoidancePoints = calculateAvoidancePath(
        optimizedPath[optimizedPath.length - 1],
        nextPoint,
        obstacles,
        margin
      )
      optimizedPath.push(...avoidancePoints)
    } else {
      optimizedPath.push(point)
    }
  }

  optimizedPath.push(path[path.length - 1])

  return optimizeOrthogonalPoints(optimizedPath)
}

function calculateAvoidancePath(
  from: Point,
  to: Point,
  obstacles: Rectangle[],
  margin: number
): Point[] {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2

  const detourDistance = margin * 2

  const dx = to.x - from.x
  const dy = to.y - from.y

  if (Math.abs(dx) > Math.abs(dy)) {
    return [
      { x: midX, y: from.y },
      { x: midX, y: from.y - detourDistance },
      { x: midX, y: to.y - detourDistance },
      { x: midX, y: to.y },
    ]
  } else {
    return [
      { x: from.x, y: midY },
      { x: from.x - detourDistance, y: midY },
      { x: to.x - detourDistance, y: midY },
      { x: to.x, y: midY },
    ]
  }
}
