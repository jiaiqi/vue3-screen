import type { Ref } from 'vue'
import { ref, onUnmounted } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useSnap } from './useSnap'
import type { NodeLayout } from '@screen/core'

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export interface ResizeOptions {
  layout: Ref<NodeLayout>
  aspectRatio?: number
  minWidth?: number
  minHeight?: number
  onResize?: (newLayout: NodeLayout) => void
  onResizeEnd?: (oldLayout: NodeLayout, newLayout: NodeLayout) => void
}

export function useResize(
  containerRef: Ref<HTMLElement | null>,
  options: ResizeOptions
) {
  const canvasStore = useCanvasStore()
  const { snapToGrid } = useSnap()

  const isResizing = ref(false)
  const activeHandle = ref<ResizeHandle | null>(null)
  const startLayout = ref<NodeLayout | null>(null)
  const startMouse = ref({ x: 0, y: 0 })
  const currentLayout = ref<NodeLayout | null>(null)

  const minWidth = options.minWidth ?? 20
  const minHeight = options.minHeight ?? 20

  function screenToCanvas(screenX: number, screenY: number) {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: (screenX - rect.left - canvasStore.offsetX) / canvasStore.scale,
      y: (screenY - rect.top - canvasStore.offsetY) / canvasStore.scale,
    }
  }

  function startResize(e: MouseEvent, handle: ResizeHandle) {
    if (e.button !== 0) return

    e.preventDefault()
    e.stopPropagation()

    isResizing.value = true
    activeHandle.value = handle
    startLayout.value = { ...options.layout.value }
    currentLayout.value = { ...options.layout.value }
    startMouse.value = { x: e.clientX, y: e.clientY }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isResizing.value || !startLayout.value || !activeHandle.value) return

    const canvasStart = screenToCanvas(startMouse.value.x, startMouse.value.y)
    const canvasCurrent = screenToCanvas(e.clientX, e.clientY)

    const dx = canvasCurrent.x - canvasStart.x
    const dy = canvasCurrent.y - canvasStart.y

    const handle = activeHandle.value
    let newX = startLayout.value.x
    let newY = startLayout.value.y
    let newW = startLayout.value.w
    let newH = startLayout.value.h

    if (handle.includes('e')) {
      newW = Math.max(minWidth, startLayout.value.w + dx)
    }
    if (handle.includes('w')) {
      const deltaW = Math.min(dx, startLayout.value.w - minWidth)
      newW = startLayout.value.w - deltaW
      newX = startLayout.value.x + deltaW
    }
    if (handle.includes('s')) {
      newH = Math.max(minHeight, startLayout.value.h + dy)
    }
    if (handle.includes('n')) {
      const deltaH = Math.min(dy, startLayout.value.h - minHeight)
      newH = startLayout.value.h - deltaH
      newY = startLayout.value.y + deltaH
    }

    if (e.shiftKey && startLayout.value.w > 0 && startLayout.value.h > 0) {
      const originalRatio = startLayout.value.w / startLayout.value.h
      if (handle === 'n' || handle === 's') {
        newW = newH * originalRatio
      } else if (handle === 'e' || handle === 'w') {
        newH = newW / originalRatio
      } else {
        const currentRatio = newW / newH
        if (currentRatio > originalRatio) {
          newW = newH * originalRatio
          if (handle.includes('w')) {
            newX = startLayout.value.x + startLayout.value.w - newW
          }
        } else {
          newH = newW / originalRatio
          if (handle.includes('n')) {
            newY = startLayout.value.y + startLayout.value.h - newH
          }
        }
      }
    }

    newX = snapToGrid(newX)
    newY = snapToGrid(newY)
    newW = snapToGrid(newW)
    newH = snapToGrid(newH)

    currentLayout.value = { x: newX, y: newY, w: newW, h: newH }

    if (options.onResize) {
      options.onResize(currentLayout.value)
    }
  }

  function handleMouseUp() {
    if (!isResizing.value || !startLayout.value || !currentLayout.value) {
      cleanup()
      return
    }

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    if (options.onResizeEnd) {
      options.onResizeEnd(startLayout.value, currentLayout.value)
    }

    cleanup()
  }

  function cleanup() {
    isResizing.value = false
    activeHandle.value = null
    startLayout.value = null
    currentLayout.value = null
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    isResizing,
    activeHandle,
    startResize,
  }
}
