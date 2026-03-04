import { ref, computed } from 'vue'
import { useVueFlow, type Node, type Edge, type Connection } from '@vue-flow/core'
import { useDesignerStore } from '@/stores/designer'
import type { GraphNodeSchema, EdgeSchema } from '@screen/core'

export function useTopology() {
  const designerStore = useDesignerStore()
  const { addNodes, addEdges, removeNodes, removeEdges, getNodes, getEdges } = useVueFlow()

  function addGraphNode(node: GraphNodeSchema) {
    if (!designerStore.currentPage.graphNodes) {
      designerStore.currentPage.graphNodes = []
    }
    designerStore.currentPage.graphNodes.push(node)
  }

  function addEdge(edge: EdgeSchema) {
    if (!designerStore.currentPage.edges) {
      designerStore.currentPage.edges = []
    }
    designerStore.currentPage.edges.push(edge)
  }

  function removeGraphNode(id: string) {
    const nodes = designerStore.currentPage.graphNodes
    if (!nodes) return
    const index = nodes.findIndex(n => n.id === id)
    if (index > -1) {
      nodes.splice(index, 1)
    }
  }

  function removeEdge(id: string) {
    const edges = designerStore.currentPage.edges
    if (!edges) return
    const index = edges.findIndex(e => e.id === id)
    if (index > -1) {
      edges.splice(index, 1)
    }
  }

  function connectNodes(connection: Connection, animationType: string = 'default') {
    const edge: EdgeSchema = {
      id: `edge-${Date.now()}`,
      source: connection.source!,
      sourcePort: connection.sourceHandle || 'default',
      target: connection.target!,
      targetPort: connection.targetHandle || 'default',
      pathType: 'smoothstep',
      style: {
        stroke: 'rgba(255, 255, 255, 0.3)',
        strokeWidth: 2,
        opacity: 1,
      },
      animation: {
        type: animationType as any,
        speed: 1,
        direction: 'forward',
        color: '#0073ff',
        opacity: 1,
      },
    }
    addEdge(edge)
  }

  return {
    addGraphNode,
    addEdge,
    removeGraphNode,
    removeEdge,
    connectNodes,
  }
}
