import { onMounted, onUnmounted } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import { useSelectionStore } from '@/stores/selection'
import { ElMessage } from 'element-plus'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

export function useKeyboard() {
  const designerStore = useDesignerStore()
  const selectionStore = useSelectionStore()

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'z',
      ctrl: true,
      action: () => {
        if (designerStore.canUndo) {
          designerStore.undo()
        }
      },
      description: '撤销'
    },
    {
      key: 'y',
      ctrl: true,
      action: () => {
        if (designerStore.canRedo) {
          designerStore.redo()
        }
      },
      description: '重做'
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      action: () => {
        if (designerStore.canRedo) {
          designerStore.redo()
        }
      },
      description: '重做'
    },
    {
      key: 'c',
      ctrl: true,
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.copy()
        }
      },
      description: '复制'
    },
    {
      key: 'v',
      ctrl: true,
      action: () => {
        designerStore.paste()
      },
      description: '粘贴'
    },
    {
      key: 'd',
      ctrl: true,
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.duplicate()
        }
      },
      description: '原地复制'
    },
    {
      key: 'Delete',
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.deleteSelected()
        }
      },
      description: '删除选中'
    },
    {
      key: 'Backspace',
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.deleteSelected()
        }
      },
      description: '删除选中'
    },
    {
      key: 'a',
      ctrl: true,
      action: () => {
        designerStore.selectAll()
      },
      description: '全选'
    },
    {
      key: 'Escape',
      action: () => {
        selectionStore.clearSelection()
      },
      description: '取消选中'
    },
    {
      key: 'ArrowUp',
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.moveSelected(0, -1)
        }
      },
      description: '向上微移 1px'
    },
    {
      key: 'ArrowDown',
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.moveSelected(0, 1)
        }
      },
      description: '向下微移 1px'
    },
    {
      key: 'ArrowLeft',
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.moveSelected(-1, 0)
        }
      },
      description: '向左微移 1px'
    },
    {
      key: 'ArrowRight',
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.moveSelected(1, 0)
        }
      },
      description: '向右微移 1px'
    },
    {
      key: 'ArrowUp',
      shift: true,
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.moveSelected(0, -10)
        }
      },
      description: '向上微移 10px'
    },
    {
      key: 'ArrowDown',
      shift: true,
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.moveSelected(0, 10)
        }
      },
      description: '向下微移 10px'
    },
    {
      key: 'ArrowLeft',
      shift: true,
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.moveSelected(-10, 0)
        }
      },
      description: '向左微移 10px'
    },
    {
      key: 'ArrowRight',
      shift: true,
      action: () => {
        if (selectionStore.hasSelection) {
          designerStore.moveSelected(10, 0)
        }
      },
      description: '向右微移 10px'
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        designerStore.save()
        ElMessage.success('保存成功')
      },
      description: '保存'
    },
    {
      key: 'p',
      ctrl: true,
      action: () => {
        designerStore.preview()
      },
      description: '预览'
    }
  ]

  function matchShortcut(e: KeyboardEvent): KeyboardShortcut | null {
    for (const shortcut of shortcuts) {
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase() || 
                       e.key === shortcut.key
      const ctrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.metaKey)
      const shiftMatch = !!shortcut.shift === e.shiftKey
      const altMatch = !!shortcut.alt === e.altKey

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        return shortcut
      }
    }
    return null
  }

  function handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    const shortcut = matchShortcut(e)
    if (shortcut) {
      e.preventDefault()
      e.stopPropagation()
      shortcut.action()
    }
  }

  function enable() {
    window.addEventListener('keydown', handleKeyDown)
  }

  function disable() {
    window.removeEventListener('keydown', handleKeyDown)
  }

  onMounted(() => {
    enable()
  })

  onUnmounted(() => {
    disable()
  })

  return {
    shortcuts,
    enable,
    disable
  }
}
