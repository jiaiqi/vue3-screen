import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ScreenSchema, ComponentNode, GraphNodeSchema, EdgeSchema, NodeLayout } from '@screen/core'
import { useHistoryManager, AddNodeCommand, MoveCommand, DeleteCommand, BatchCommand } from '@screen/core'
import { useCanvasStore } from './canvas'
import { useSelectionStore } from './selection'

export interface PanelState {
  material: { collapsed: boolean; width: number }
  props: { collapsed: boolean; width: number }
  layer: { collapsed: boolean; height: number }
}

export interface SavedScreen {
  id: string
  name: string
  schema: ScreenSchema
  savedAt: string
}

const STORAGE_KEY = 'vue3-screen-saved-screens'
const CURRENT_SCREEN_KEY = 'vue3-screen-current'

export const useDesignerStore = defineStore('designer', () => {
  const panelState = ref<PanelState>({
    material: { collapsed: false, width: 260 },
    props: { collapsed: false, width: 320 },
    layer: { collapsed: false, height: 200 },
  })

  function togglePanel(panel: 'material' | 'props' | 'layer') {
    panelState.value[panel].collapsed = !panelState.value[panel].collapsed
  }

  function setPanelWidth(panel: 'material' | 'props', width: number) {
    panelState.value[panel].width = width
  }

  function setPanelHeight(height: number) {
    panelState.value.layer.height = height
  }

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

  function generateId(): string {
    return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function createNode(
    type: string,
    x: number,
    y: number,
    options?: {
      width?: number
      height?: number
      label?: string
      props?: Record<string, unknown>
    }
  ): ComponentNode {
    const id = generateId()
    return {
      id,
      nodeKind: 'widget',
      type,
      label: options?.label ?? type,
      layout: {
        x,
        y,
        w: options?.width ?? 200,
        h: options?.height ?? 150,
      },
      props: options?.props ?? {},
      style: {},
    }
  }

  function addNode(node: ComponentNode) {
    const command = new AddNodeCommand(currentPage.value.nodes, node)
    history.execute(command)
  }

  function addNodeAt(type: string, x: number, y: number, options?: {
    width?: number
    height?: number
    label?: string
    props?: Record<string, unknown>
  }) {
    const node = createNode(type, x, y, options)
    addNode(node)
    return node
  }

  function removeNode(id: string) {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      const command = new DeleteCommand(
        currentPage.value.nodes,
        currentPage.value.graphNodes || [],
        [node]
      )
      history.execute(command)
    }
  }

  function removeNodes(ids: string[]) {
    const deletedNodes = ids
      .map(id => nodes.value.find(n => n.id === id))
      .filter((n): n is ComponentNode => n !== undefined)

    if (deletedNodes.length > 0) {
      const command = new DeleteCommand(
        currentPage.value.nodes,
        currentPage.value.graphNodes || [],
        deletedNodes
      )
      history.execute(command)
    }
  }

  function moveNode(id: string, newX: number, newY: number, recordHistory = true) {
    const node = nodes.value.find(n => n.id === id) || graphNodes.value.find(n => n.id === id)
    if (!node) return

    const deltaX = newX - node.layout.x
    const deltaY = newY - node.layout.y

    if (recordHistory) {
      const command = new MoveCommand([node], deltaX, deltaY)
      history.execute(command)
    } else {
      node.layout.x = newX
      node.layout.y = newY
    }
  }

  function moveNodes(moves: { id: string; x: number; y: number }[], recordHistory = true) {
    if (moves.length === 0) return

    const movedNodes = moves
      .map(move => {
        const node = nodes.value.find(n => n.id === move.id) || graphNodes.value.find(n => n.id === move.id)
        if (!node) return null
        return { node, deltaX: move.x - node.layout.x, deltaY: move.y - node.layout.y }
      })
      .filter((item): item is { node: ComponentNode | GraphNodeSchema; deltaX: number; deltaY: number } => item !== null)

    if (recordHistory && movedNodes.length > 0) {
      const command = new MoveCommand(
        movedNodes.map(m => m.node),
        movedNodes[0].deltaX,
        movedNodes[0].deltaY
      )
      history.execute(command)
    } else {
      moves.forEach(move => {
        const node = nodes.value.find(n => n.id === move.id) || graphNodes.value.find(n => n.id === move.id)
        if (node) {
          node.layout.x = move.x
          node.layout.y = move.y
        }
      })
    }
  }

  function resizeNode(id: string, newLayout: NodeLayout, recordHistory = true) {
    const node = nodes.value.find(n => n.id === id) || graphNodes.value.find(n => n.id === id)
    if (!node) return

    const oldLayout = { ...node.layout }

    if (recordHistory) {
      const command = new ResizeCommand(node, oldLayout, newLayout)
      history.execute(command)
    } else {
      node.layout = { ...newLayout }
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

  function duplicateNode(id: string): ComponentNode | null {
    const node = nodes.value.find(n => n.id === id)
    if (!node) return null

    const newNode: ComponentNode = {
      ...JSON.parse(JSON.stringify(node)),
      id: generateId(),
      label: `${node.label} (副本)`,
      layout: {
        ...node.layout,
        x: node.layout.x + 20,
        y: node.layout.y + 20,
      },
    }

    addNode(newNode)
    return newNode
  }

  function duplicateNodes(ids: string[]): ComponentNode[] {
    const newNodes: ComponentNode[] = []
    ids.forEach(id => {
      const newNode = duplicateNode(id)
      if (newNode) newNodes.push(newNode)
    })
    return newNodes
  }

  function undo() {
    history.undo()
  }

  function redo() {
    history.redo()
  }

  const canUndo = computed(() => history.canUndo.value)
  const canRedo = computed(() => history.canRedo.value)

  let clipboard: ComponentNode[] = []

  function createNewScreen(name: string, width: number, height: number) {
    const newId = generateId()
    schema.value = {
      version: '2.1.0',
      id: newId,
      name,
      canvas: {
        width,
        height,
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
          id: `page-${Date.now()}`,
          name: '页面 1',
          nodes: [],
          graphNodes: [],
          edges: [],
        },
      ],
      events: [],
    }

    history.clear()

    const canvasStore = useCanvasStore()
    canvasStore.setCanvasSize(width, height)

    const selectionStore = useSelectionStore()
    selectionStore.clearSelection()
  }

  function saveScreen(): boolean {
    try {
      const savedScreen: SavedScreen = {
        id: schema.value.id,
        name: schema.value.name,
        schema: JSON.parse(JSON.stringify(schema.value)),
        savedAt: new Date().toISOString(),
      }

      const savedScreens = getSavedScreens()
      const existingIndex = savedScreens.findIndex(s => s.id === schema.value.id)
      
      if (existingIndex >= 0) {
        savedScreens[existingIndex] = savedScreen
      } else {
        savedScreens.push(savedScreen)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScreens))
      localStorage.setItem(CURRENT_SCREEN_KEY, schema.value.id)

      return true
    } catch (error) {
      console.error('保存失败:', error)
      return false
    }
  }

  function saveAs(name: string): boolean {
    const newId = generateId()
    const newSchema = JSON.parse(JSON.stringify(schema.value))
    newSchema.id = newId
    newSchema.name = name

    const savedScreen: SavedScreen = {
      id: newId,
      name,
      schema: newSchema,
      savedAt: new Date().toISOString(),
    }

    try {
      const savedScreens = getSavedScreens()
      savedScreens.push(savedScreen)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScreens))

      schema.value = newSchema
      history.clear()

      return true
    } catch (error) {
      console.error('另存为失败:', error)
      return false
    }
  }

  function loadScreen(id: string): boolean {
    try {
      const savedScreens = getSavedScreens()
      const savedScreen = savedScreens.find(s => s.id === id)
      
      if (!savedScreen) {
        return false
      }

      schema.value = JSON.parse(JSON.stringify(savedScreen.schema))
      history.clear()

      const canvasStore = useCanvasStore()
      canvasStore.setCanvasSize(schema.value.canvas.width, schema.value.canvas.height)

      const selectionStore = useSelectionStore()
      selectionStore.clearSelection()

      localStorage.setItem(CURRENT_SCREEN_KEY, id)

      return true
    } catch (error) {
      console.error('加载失败:', error)
      return false
    }
  }

  function getSavedScreens(): SavedScreen[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  function deleteSavedScreen(id: string) {
    const savedScreens = getSavedScreens()
    const index = savedScreens.findIndex(s => s.id === id)
    if (index >= 0) {
      savedScreens.splice(index, 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScreens))
    }
  }

  function copy() {
    const selectionStore = useSelectionStore()
    const selectedIds = Array.from(selectionStore.selectedIds)
    
    clipboard = nodes.value
      .filter(n => selectedIds.includes(n.id))
      .map(n => JSON.parse(JSON.stringify(n)))
  }

  function paste() {
    if (clipboard.length === 0) return

    const selectionStore = useSelectionStore()
    selectionStore.clearSelection()

    const newNodes: ComponentNode[] = clipboard.map(n => ({
      ...n,
      id: generateId(),
      label: `${n.label} 副本`,
      layout: {
        ...n.layout,
        x: n.layout.x + 20,
        y: n.layout.y + 20,
      },
    }))

    newNodes.forEach(node => {
      addNode(node)
      selectionStore.addToSelection(node.id)
    })
  }

  function deleteSelected() {
    const selectionStore = useSelectionStore()
    const selectedIds = Array.from(selectionStore.selectedIds)
    
    selectedIds.forEach(id => {
      removeNode(id)
    })
    
    selectionStore.clearSelection()
  }

  function duplicate() {
    const selectionStore = useSelectionStore()
    const selectedIds = Array.from(selectionStore.selectedIds)
    duplicateNodes(selectedIds)
  }

  function selectAll() {
    const selectionStore = useSelectionStore()
    const allIds = nodes.value.map(n => n.id)
    selectionStore.selectMultiple(allIds)
  }

  function moveSelected(deltaX: number, deltaY: number) {
    const selectionStore = useSelectionStore()
    const selectedIds = Array.from(selectionStore.selectedIds)
    
    const moves = selectedIds.map(id => {
      const node = nodes.value.find(n => n.id === id)
      if (node) {
        return {
          id,
          x: node.layout.x + deltaX,
          y: node.layout.y + deltaY,
        }
      }
      return null
    }).filter((m): m is { id: string; x: number; y: number } => m !== null)
    
    moveNodes(moves, true)
  }

  function save() {
    saveScreen()
  }

  function preview() {
    const previewUrl = `/preview?id=${schema.value.id}`
    window.open(previewUrl, '_blank')
  }

  function updateNodeLayout(id: string, layout: Partial<NodeLayout>) {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      node.layout = { ...node.layout, ...layout }
    }
  }

  function updateNodesLayout(updates: Array<{ id: string; layout: NodeLayout }>) {
    updates.forEach(({ id, layout }) => {
      const node = nodes.value.find(n => n.id === id)
      if (node) {
        node.layout = { ...layout }
      }
    })
  }

  return {
    schema,
    history,
    currentPage,
    nodes,
    graphNodes,
    edges,
    panelState,
    canUndo,
    canRedo,
    getNodeById,
    generateId,
    createNode,
    addNode,
    addNodeAt,
    removeNode,
    removeNodes,
    moveNode,
    moveNodes,
    resizeNode,
    updateNodeProp,
    updateNodeStyle,
    updateDataBinding,
    updateNodeLayout,
    updateNodesLayout,
    duplicateNode,
    duplicateNodes,
    duplicate,
    selectAll,
    moveSelected,
    save,
    preview,
    undo,
    redo,
    togglePanel,
    setPanelWidth,
    setPanelHeight,
    createNewScreen,
    saveScreen,
    saveAs,
    loadScreen,
    getSavedScreens,
    deleteSavedScreen,
    copy,
    paste,
    deleteSelected,
  }
})
