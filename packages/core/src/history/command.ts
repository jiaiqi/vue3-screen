import type { ComponentNode, GraphNodeSchema, NodeLayout } from '../schema/types'

export abstract class BaseCommand {
  abstract execute(): void
  abstract undo(): void
  description: string = ''
}

export interface MovableNode {
  id: string
  layout: NodeLayout
}

export class AddNodeCommand extends BaseCommand {
  constructor(
    private nodes: ComponentNode[],
    private node: ComponentNode
  ) {
    super()
    this.description = '添加节点'
  }

  execute(): void {
    this.nodes.push(this.node)
  }

  undo(): void {
    const index = this.nodes.indexOf(this.node)
    if (index > -1) {
      this.nodes.splice(index, 1)
    }
  }
}

export class MoveCommand extends BaseCommand {
  private oldPositions: Map<string, { x: number; y: number }>
  private newPositions: Map<string, { x: number; y: number }>

  constructor(
    nodes: MovableNode[],
    deltaX: number,
    deltaY: number
  ) {
    super()
    this.description = nodes.length > 1 ? `移动 ${nodes.length} 个节点` : '移动节点'
    
    this.oldPositions = new Map()
    this.newPositions = new Map()
    
    nodes.forEach(node => {
      this.oldPositions.set(node.id, { x: node.layout.x, y: node.layout.y })
      this.newPositions.set(node.id, { 
        x: node.layout.x + deltaX, 
        y: node.layout.y + deltaY 
      })
    })
    
    this.nodes = nodes
  }

  private nodes: MovableNode[]

  execute(): void {
    this.nodes.forEach(node => {
      const newPos = this.newPositions.get(node.id)
      if (newPos) {
        node.layout.x = newPos.x
        node.layout.y = newPos.y
      }
    })
  }

  undo(): void {
    this.nodes.forEach(node => {
      const oldPos = this.oldPositions.get(node.id)
      if (oldPos) {
        node.layout.x = oldPos.x
        node.layout.y = oldPos.y
      }
    })
  }
}

export class ResizeCommand extends BaseCommand {
  private node: { layout: NodeLayout }
  private oldLayout: NodeLayout
  private newLayout: NodeLayout

  constructor(
    node: { layout: NodeLayout },
    oldLayout: NodeLayout,
    newLayout: NodeLayout
  ) {
    super()
    this.description = '调整大小'
    this.node = node
    this.oldLayout = { ...oldLayout }
    this.newLayout = { ...newLayout }
  }

  execute(): void {
    this.node.layout = { ...this.newLayout }
  }

  undo(): void {
    this.node.layout = { ...this.oldLayout }
  }
}

export class DeleteCommand extends BaseCommand {
  private deletedItems: Array<{
    node: ComponentNode | GraphNodeSchema,
    index: number,
    type: 'widget' | 'graph'
  }>

  constructor(
    private nodes: ComponentNode[],
    private graphNodes: GraphNodeSchema[],
    private deletedNodes: (ComponentNode | GraphNodeSchema)[]
  ) {
    super()
    this.description = deletedNodes.length > 1 ? `删除 ${deletedNodes.length} 个节点` : '删除节点'
    
    this.deletedItems = deletedNodes.map(node => {
      if (node.nodeKind === 'widget') {
        return {
          node,
          index: nodes.indexOf(node as ComponentNode),
          type: 'widget' as const
        }
      } else {
        return {
          node,
          index: graphNodes.indexOf(node as GraphNodeSchema),
          type: 'graph' as const
        }
      }
    })
  }

  execute(): void {
    this.deletedItems.forEach(item => {
      if (item.type === 'widget') {
        const idx = this.nodes.indexOf(item.node as ComponentNode)
        if (idx > -1) {
          this.nodes.splice(idx, 1)
        }
      } else {
        const idx = this.graphNodes.indexOf(item.node as GraphNodeSchema)
        if (idx > -1) {
          this.graphNodes.splice(idx, 1)
        }
      }
    })
  }

  undo(): void {
    this.deletedItems.forEach(item => {
      if (item.type === 'widget') {
        this.nodes.splice(item.index, 0, item.node as ComponentNode)
      } else {
        this.graphNodes.splice(item.index, 0, item.node as GraphNodeSchema)
      }
    })
  }
}

export class BatchCommand extends BaseCommand {
  constructor(private commands: BaseCommand[]) {
    super()
    this.description = '批量操作'
  }

  execute(): void {
    this.commands.forEach(cmd => cmd.execute())
  }

  undo(): void {
    [...this.commands].reverse().forEach(cmd => cmd.undo())
  }
}

export class PropertyChangeCommand extends BaseCommand {
  private oldValue: unknown
  private newValue: unknown

  constructor(
    private object: Record<string, unknown>,
    private key: string,
    newValue: unknown
  ) {
    super()
    this.description = `修改属性 ${key}`
    this.oldValue = object[key]
    this.newValue = newValue
  }

  execute(): void {
    this.object[this.key] = this.newValue
  }

  undo(): void {
    this.object[this.key] = this.oldValue
  }
}
