import type { Ref } from 'vue'
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'
import { useSnap } from './useSnap'
import type { NodeLayout } from '@screen/core'

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export function useResize(
  handleEl: Ref<HTMLElement | null>,
  layout: Ref<NodeLayout>,
  aspectRatio: number | undefined,
  onResize: (newLayout: NodeLayout) => void
) {
  const { snapToGrid } = useSnap()
  const isResizing = ref(false)
  const startLayout = ref<NodeLayout | null>(null)
  const activeHandle = ref<ResizeHandle | null>(null)

  const { position } = useDraggable(handleEl, {
    onStart: (pos) => {
      isResizing.value = true
      startLayout.value = { ...layout.value }
      activeHandle.value = handleEl.value?.dataset.handle as ResizeHandle
    },
    onMove: (pos) => {
      if (!isResizing.value || !startLayout.value || !activeHandle.value) return

      const dx = position.value.x - pos.x
      const dy = position.value.y - pos.y

      let newX = startLayout.value.x
      let newY = startLayout.value.y
      let newW = startLayout.value.w
      let newH = startLayout.value.h

      const handle = activeHandle.value

      if (handle.includes('w')) {
        newW = Math.max(50, startLayout.value.w + dx)
        newX = startLayout.value.x + startLayout.value.w - newW
      }
      if (handle.includes('e')) {
        newW = Math.max(50, startLayout.value.w - dx)
      }
      if (handle.includes('n')) {
        newH = Math.max(50, startLayout.value.h + dy)
        newY = startLayout.value.y + startLayout.value.h - newH
      }
      if (handle.includes('s')) {
        newH = Math.max(50, startLayout.value.h - dy)
      }

      if (aspectRatio) {
        if (handle === 'n' || handle === 's') {
          newW = newH * aspectRatio
        } else if (handle === 'e' || handle === 'w') {
          newH = newW / aspectRatio
        } else {
          const ratio = newW / newH
          if (ratio > aspectRatio) {
            newH = newW / aspectRatio
          } else {
            newW = newH * aspectRatio
          }
        }
      }

      newX = snapToGrid(newX)
      newY = snapToGrid(newY)
      newW = snapToGrid(newW)
      newH = snapToGrid(newH)

      onResize({ x: newX, y: newY, w: newW, h: newH })
    },
    onEnd: () => {
      isResizing.value = false
      startLayout.value = null
      activeHandle.value = null
    },
  })

  return {
    isResizing,
    activeHandle,
  }
}
