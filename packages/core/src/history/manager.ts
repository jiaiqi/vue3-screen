import { ref, computed } from 'vue'
import { BaseCommand } from './command'

export function useHistoryManager(maxSize: number = 100) {
  const stack = ref<BaseCommand[]>([])
  const pointer = ref(-1)

  const canUndo = computed(() => pointer.value >= 0)
  const canRedo = computed(() => pointer.value < stack.value.length - 1)

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

  function undo() {
    if (canUndo.value) {
      stack.value[pointer.value]!.undo()
      pointer.value--
      return true
    }
    return false
  }

  function redo() {
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

  return {
    stack,
    pointer,
    canUndo,
    canRedo,
    execute,
    undo,
    redo,
    clear,
  }
}

export type HistoryManager = ReturnType<typeof useHistoryManager>
