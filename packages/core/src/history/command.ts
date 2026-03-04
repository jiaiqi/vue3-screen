export abstract class BaseCommand {
  abstract execute(): void
  abstract undo(): void
  description: string = ''
}

export class AddNodeCommand extends BaseCommand {
  constructor(
    private nodes: unknown[],
    private node: unknown
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
  constructor(
    private node: { x: number; y: number },
    private oldX: number,
    private oldY: number,
    private newX: number,
    private newY: number
  ) {
    super()
    this.description = '移动节点'
  }

  execute(): void {
    this.node.x = this.newX
    this.node.y = this.newY
  }

  undo(): void {
    this.node.x = this.oldX
    this.node.y = this.oldY
  }
}

export class ResizeCommand extends BaseCommand {
  constructor(
    private node: { width: number; height: number },
    private oldWidth: number,
    private oldHeight: number,
    private newWidth: number,
    private newHeight: number
  ) {
    super()
    this.description = '调整大小'
  }

  execute(): void {
    this.node.width = this.newWidth
    this.node.height = this.newHeight
  }

  undo(): void {
    this.node.width = this.oldWidth
    this.node.height = this.oldHeight
  }
}

export class DeleteNodeCommand extends BaseCommand {
  constructor(
    private nodes: unknown[],
    private node: unknown,
    private index: number
  ) {
    super()
    this.description = '删除节点'
  }

  execute(): void {
    const idx = this.nodes.indexOf(this.node)
    if (idx > -1) {
      this.nodes.splice(idx, 1)
    }
  }

  undo(): void {
    this.nodes.splice(this.index, 0, this.node)
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
