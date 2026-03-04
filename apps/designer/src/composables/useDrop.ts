import type { Ref } from 'vue'
import { ref } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useSnap } from './useSnap'

export interface DropData {
  type: string
  meta?: Record<string, unknown>
}

export function useDrop(
  containerRef: Ref<HTMLElement | null>,
  onDrop: (data: DropData, x: number, y: number) => void
) {
  const canvasStore = useCanvasStore()
  const { snapToGrid } = useSnap()

  const isDragOver = ref(false)
  const dropPreview = ref<{ x: number; y: number } | null>(null)

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    isDragOver.value = true

    if (!containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const canvasX = (e.clientX - rect.left - canvasStore.offsetX) / canvasStore.scale
    const canvasY = (e.clientY - rect.top - canvasStore.offsetY) / canvasStore.scale

    const snappedX = snapToGrid(canvasX)
    const snappedY = snapToGrid(canvasY)

    dropPreview.value = { x: snappedX, y: snappedY }
  }

  function handleDragLeave() {
    isDragOver.value = false
    dropPreview.value = null
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    isDragOver.value = false

    if (!containerRef.value) return

    const dataStr = e.dataTransfer?.getData('application/json')
    if (!dataStr) return

    const data: DropData = JSON.parse(dataStr)

    const rect = containerRef.value.getBoundingClientRect()
    const canvasX = (e.clientX - rect.left - canvasStore.offsetX) / canvasStore.scale
    const canvasY = (e.clientY - rect.top - canvasStore.offsetY) / canvasStore.scale

    const snappedX = snapToGrid(canvasX)
    const snappedY = snapToGrid(canvasY)

    onDrop(data, snappedX, snappedY)
    dropPreview.value = null
  }

  return {
    isDragOver,
    dropPreview,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
