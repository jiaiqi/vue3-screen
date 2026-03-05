export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 9)
  return `${prefix}-${timestamp}-${randomPart}`
}

export function generatePortId(nodeId: string, position: string, index: number): string {
  return `${nodeId}-port-${position}-${index}`
}

export function generateEdgeId(sourcePortId: string, targetPortId: string): string {
  return `edge-${sourcePortId}-${targetPortId}`
}

export function parsePortId(portId: string): {
  nodeId: string
  position: string
  index: number
} | null {
  const parts = portId.split('-port-')
  if (parts.length !== 2) return null

  const nodeId = parts[0]
  const [position, indexStr] = parts[1].split('-')
  const index = parseInt(indexStr, 10)

  if (isNaN(index)) return null

  return { nodeId, position, index }
}
