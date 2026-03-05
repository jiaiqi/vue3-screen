import { ref, computed } from 'vue'
import { BaseCommand } from './command'

export interface HistoryState {
  stack: BaseCommand[]
  pointer: number
}

export function useHistoryManager(maxSize: number = 100) {
  const stack = ref<BaseCommand[]>([])
  const pointer = ref(-1)

  const canUndo = computed(() => pointer.value >= 0)
  const canRedo = computed(() => pointer.value < stack.value.length - 1)
  const size = computed(() => stack.value.length)
  const currentIndex = computed(() => pointer.value)

  function execute(command: BaseCommand) {
    command.execute()
    
    if (pointer.value < stack.value.length - 1) {
      stack.value = stack.value.slice(0, pointer.value + 1)
    }
    
    stack.value.push(command)
    
    if (stack.value.length > maxSize) {
      stack.value.shift()
    } else {
      pointer.value++
    }
  }

  function undo(): boolean {
    if (canUndo.value) {
      stack.value[pointer.value]!.undo()
      pointer.value--
      return true
    }
    return false
  }

  function redo(): boolean {
    if (canRedo.value) {
      pointer.value++
      stack.value[pointer.value]!.execute()
      return true
    }
    return false
  }

  function clear() {
    stack.value = []
    pointer.value = -1
  }

  function getCurrentCommand(): BaseCommand | null {
    if (pointer.value >= 0 && pointer.value < stack.value.length) {
      return stack.value[pointer.value]
    }
    return null
  }

  function getUndoDescription(): string | null {
    if (canUndo.value) {
      return stack.value[pointer.value]?.description || null
    }
    return null
  }

  function getRedoDescription(): string | null {
    if (canRedo.value) {
      return stack.value[pointer.value + 1]?.description || null
    }
    return null
  }

  function getHistoryList(): Array<{ description: string; isCurrent: boolean }> {
    return stack.value.map((cmd, index) => ({
      description: cmd.description,
      isCurrent: index === pointer.value
    }))
  }

  function jumpTo(targetPointer: number): boolean {
    if (targetPointer < -1 || targetPointer >= stack.value.length) {
      return false
    }

    while (pointer.value > targetPointer) {
      stack.value[pointer.value]!.undo()
      pointer.value--
    }

    while (pointer.value < targetPointer) {
      pointer.value++
      stack.value[pointer.value]!.execute()
    }

    return true
  }

  return {
    stack,
    pointer,
    canUndo,
    canRedo,
    size,
    currentIndex,
    execute,
    undo,
    redo,
    clear,
    getCurrentCommand,
    getUndoDescription,
    getRedoDescription,
    getHistoryList,
    jumpTo,
  }
}

export type HistoryManager = ReturnType<typeof useHistoryManager>
