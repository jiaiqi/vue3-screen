import type { ComponentNode, GraphNodeSchema, PortSchema } from './types'

export function isGraphNode(node: ComponentNode): node is GraphNodeSchema {
  return node.nodeKind === 'graph'
}

export function isWidgetNode(node: ComponentNode): boolean {
  return node.nodeKind === 'widget'
}

export function hasPorts(node: GraphNodeSchema): boolean {
  return !!node.graphData.ports && node.graphData.ports.length > 0
}

export function getPortById(node: GraphNodeSchema, portId: string): PortSchema | undefined {
  if (!node.graphData.ports) {
    return undefined
  }
  return node.graphData.ports.find(port => port.id === portId)
}
