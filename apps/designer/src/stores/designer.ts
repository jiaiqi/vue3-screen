import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ScreenSchema, ComponentNode, GraphNodeSchema, EdgeSchema } from '@screen/core'
import { useHistoryManager } from '@screen/core'
import { AddNodeCommand, MoveCommand, DeleteNodeCommand } from '@screen/core'

export const useDesignerStore = defineStore('designer', () => {
  const schema = ref<ScreenSchema>({
    version: '2.1.0',
    id: 'screen-1',
    name: '未命名大屏',
    canvas: {
      width: 1920,
      height: 1080,
      background: { color: '#0d1117' },
      fitMode: 'scale',
      canvasMode: 'hybrid',
    },
    dataSources: [],
    variables: [],
    globalFilters: [],
    theme: { mode: 'dark' },
    pages: [
      {
        id: 'page-1',
        name: '页面 1',
        nodes: [],
        graphNodes: [],
        edges: [],
      },
    ],
    events: [],
  })

  const history = useHistoryManager(100)

  const currentPage = computed(() => schema.value.pages[0])

  const nodes = computed(() => currentPage.value.nodes)
  const graphNodes = computed(() => currentPage.value.graphNodes || [])
  const edges = computed(() => currentPage.value.edges || [])

  function getNodeById(id: string): ComponentNode | GraphNodeSchema | undefined {
    return nodes.value.find(n => n.id === id) || graphNodes.value.find(n => n.id === id)
  }

  function addNode(node: ComponentNode) {
    const command = new AddNodeCommand(currentPage.value.nodes, node)
    history.execute(command)
  }

  function removeNode(id: string) {
    const index = nodes.value.findIndex(n => n.id === id)
    if (index > -1) {
      const command = new DeleteNodeCommand(currentPage.value.nodes, nodes.value[index], index)
      history.execute(command)
    }
  }

  function updateNodeProp(id: string, key: string, value: unknown) {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      if (key === 'label') {
        node.label = value as string
      } else if (key === 'width') {
        node.layout.w = value as number
      } else if (key === 'height') {
        node.layout.h = value as number
      } else if (key === 'x') {
        node.layout.x = value as number
      } else if (key === 'y') {
        node.layout.y = value as number
      } else if (key === 'locked') {
        node.locked = value as boolean
      } else if (key === 'visible') {
        node.visible = value as boolean
      } else {
        node.props[key] = value
      }
    }
  }

  function updateNodeStyle(id: string, key: string, value: unknown) {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      node.style = { ...node.style, [key]: value }
    }
  }

  function updateDataBinding(id: string, key: string, value: unknown) {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      node.dataBinding = { ...node.dataBinding, [key]: value } as any
    }
  }

  function undo() {
    history.undo()
  }

  function redo() {
    history.redo()
  }

  return {
    schema,
    history,
    currentPage,
    nodes,
    graphNodes,
    edges,
    getNodeById,
    addNode,
    removeNode,
    updateNodeProp,
    updateNodeStyle,
    updateDataBinding,
    undo,
    redo,
  }
})
