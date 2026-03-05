export interface PortInfo {
  id: string
  nodeId: string
  portType: 'input' | 'output' | 'both'
  dataType?: string
}

export interface Edge {
  id: string
  sourcePortId: string
  sourceNodeId: string
  targetPortId: string
  targetNodeId: string
  dataType?: string
}

export interface ValidationResult {
  isValid: boolean
  errorCode?: ValidationErrorCode
  message: string
}

export type ValidationErrorCode =
  | 'SELF_CONNECTION'
  | 'DUPLICATE_CONNECTION'
  | 'TYPE_MISMATCH'
  | 'CYCLE_DETECTED'
  | 'INVALID_PORT_TYPE'
  | 'MAX_CONNECTIONS_REACHED'

const DATA_TYPE_HIERARCHY: Record<string, string[]> = {
  'any': ['number', 'string', 'boolean', 'object', 'array'],
  'number': [],
  'string': [],
  'boolean': [],
  'object': ['array'],
  'array': [],
}

export function validateConnection(
  sourcePort: PortInfo,
  targetPort: PortInfo,
  existingEdges: Edge[] = []
): ValidationResult {
  if (!sourcePort || !targetPort) {
    return {
      isValid: false,
      errorCode: 'INVALID_PORT_TYPE',
      message: '端口信息不完整',
    }
  }

  if (sourcePort.nodeId === targetPort.nodeId) {
    return {
      isValid: false,
      errorCode: 'SELF_CONNECTION',
      message: '不能连接到自身节点',
    }
  }

  if (sourcePort.portType === 'input') {
    return {
      isValid: false,
      errorCode: 'INVALID_PORT_TYPE',
      message: '输出端口必须连接到输入端口',
    }
  }

  if (targetPort.portType === 'output') {
    return {
      isValid: false,
      errorCode: 'INVALID_PORT_TYPE',
      message: '不能连接到输出端口',
    }
  }

  const isDuplicate = existingEdges.some(
    edge =>
      edge.sourcePortId === sourcePort.id &&
      edge.targetPortId === targetPort.id
  )

  if (isDuplicate) {
    return {
      isValid: false,
      errorCode: 'DUPLICATE_CONNECTION',
      message: '连接已存在',
    }
  }

  if (!isDataTypeCompatible(sourcePort.dataType || 'any', targetPort.dataType || 'any')) {
    return {
      isValid: false,
      errorCode: 'TYPE_MISMATCH',
      message: `数据类型不兼容：${sourcePort.dataType} -> ${targetPort.dataType}`,
    }
  }

  if (wouldCreateCycle(sourcePort.nodeId, targetPort.nodeId, existingEdges)) {
    return {
      isValid: false,
      errorCode: 'CYCLE_DETECTED',
      message: '检测到循环依赖',
    }
  }

  const outputConnections = existingEdges.filter(
    edge => edge.sourcePortId === sourcePort.id
  ).length

  if (sourcePort.portType !== 'both' && outputConnections >= 1) {
    return {
      isValid: false,
      errorCode: 'MAX_CONNECTIONS_REACHED',
      message: '输出端口已达到最大连接数',
    }
  }

  return {
    isValid: true,
    message: '连接有效',
  }
}

export function isDataTypeCompatible(sourceType: string, targetType: string): boolean {
  if (sourceType === targetType) {
    return true
  }

  if (sourceType === 'any' || targetType === 'any') {
    return true
  }

  const compatibleTypes = DATA_TYPE_HIERARCHY[sourceType] || []
  return compatibleTypes.includes(targetType)
}

export function wouldCreateCycle(
  sourceNodeId: string,
  targetNodeId: string,
  existingEdges: Edge[]
): boolean {
  if (sourceNodeId === targetNodeId) {
    return true
  }

  const adjacencyList = buildAdjacencyList(existingEdges)

  if (wouldCreateCycleDFS(targetNodeId, sourceNodeId, adjacencyList, new Set())) {
    return true
  }

  return false
}

function wouldCreateCycleDFS(
  currentId: string,
  targetId: string,
  adjacencyList: Map<string, string[]>,
  visited: Set<string>
): boolean {
  if (currentId === targetId) {
    return true
  }

  if (visited.has(currentId)) {
    return false
  }

  visited.add(currentId)

  const neighbors = adjacencyList.get(currentId) || []
  for (const neighbor of neighbors) {
    if (wouldCreateCycleDFS(neighbor, targetId, adjacencyList, visited)) {
      return true
    }
  }

  return false
}

function buildAdjacencyList(edges: Edge[]): Map<string, string[]> {
  const adjacencyList = new Map<string, string[]>()

  for (const edge of edges) {
    if (!adjacencyList.has(edge.sourceNodeId)) {
      adjacencyList.set(edge.sourceNodeId, [])
    }
    adjacencyList.get(edge.sourceNodeId)!.push(edge.targetNodeId)
  }

  return adjacencyList
}

export function getConnectedPorts(nodeId: string, edges: Edge[]): {
  inputs: Edge[]
  outputs: Edge[]
} {
  const inputs = edges.filter(edge => edge.targetNodeId === nodeId)
  const outputs = edges.filter(edge => edge.sourceNodeId === nodeId)

  return { inputs, outputs }
}

export function canAddMoreConnections(
  portId: string,
  portType: 'input' | 'output' | 'both',
  edges: Edge[],
  maxConnections: number = 1
): boolean {
  if (portType === 'input') {
    return true
  }

  const connectionCount = edges.filter(edge => edge.sourcePortId === portId).length
  return connectionCount < maxConnections
}
