import type { Ref } from 'vue'
import { ref, computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useSnap } from './useSnap'
import type { ComponentMeta } from '@screen/components'

export interface DropData {
  type: string
  meta: ComponentMeta
}

export interface DropPreview {
  x: number
  y: number
  width: number
  height: number
}

export function useDrop(
  containerRef: Ref<HTMLElement | null>,
  onDrop: (data: DropData, x: number, y: number) => void
) {
  const canvasStore = useCanvasStore()
  const { snapToGrid } = useSnap()

  const isDragOver = ref(false)
  const dropPreview = ref<DropPreview | null>(null)
  const dragData = ref<DropData | null>(null)

  const defaultSize = computed(() => ({
    width: 200,
    height: 150,
  }))

  function screenToCanvas(screenX: number, screenY: number) {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: (screenX - rect.left - canvasStore.offsetX) / canvasStore.scale,
      y: (screenY - rect.top - canvasStore.offsetY) / canvasStore.scale,
    }
  }

  function handleDragEnter(e: DragEvent) {
    const dataStr = e.dataTransfer?.getData('application/json')
    if (!dataStr) {
      console.warn('[useDrop] No data in dataTransfer')
      return
    }

    try {
      const data: DropData = JSON.parse(dataStr)
      console.log('[useDrop] Drag data received:', {
        type: data.type,
        meta: data.meta,
        category: data.meta?.category,
      })
      dragData.value = data
      isDragOver.value = true
    } catch (err) {
      console.error('[useDrop] Failed to parse drag data:', err)
      dragData.value = null
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    if (!e.dataTransfer) return

    e.dataTransfer.dropEffect = 'copy'
    isDragOver.value = true

    if (!containerRef.value) return

    const canvasPos = screenToCanvas(e.clientX, e.clientY)
    const snappedX = snapToGrid(canvasPos.x)
    const snappedY = snapToGrid(canvasPos.y)

    const meta = dragData.value?.meta
    const width = meta?.defaultSize?.w ?? defaultSize.value.width
    const height = meta?.defaultSize?.h ?? defaultSize.value.height

    // 使用鼠标位置作为组件左上角，减去半个组件尺寸使组件中心跟随鼠标
    const offsetX = 10 // 向右偏移一点，避免完全挡住鼠标
    const offsetY = 10 // 向下偏移一点
    
    dropPreview.value = {
      x: snappedX + offsetX,
      y: snappedY + offsetY,
      width,
      height,
    }
  }

  function handleDragLeave(e: DragEvent) {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const isOutside = 
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom

    if (isOutside) {
      isDragOver.value = false
      dropPreview.value = null
      dragData.value = null
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    isDragOver.value = false

    if (!containerRef.value) return

    const dataStr = e.dataTransfer?.getData('application/json')
    if (!dataStr) {
      console.warn('[useDrop] Drop: No data in dataTransfer')
      dropPreview.value = null
      dragData.value = null
      return
    }

    try {
      const data: DropData = JSON.parse(dataStr)
      console.log('[useDrop] Drop data:', {
        type: data.type,
        meta: data.meta,
        category: data.meta?.category,
      })

      const canvasPos = screenToCanvas(e.clientX, e.clientY)
      const snappedX = snapToGrid(canvasPos.x)
      const snappedY = snapToGrid(canvasPos.y)

      const meta = data.meta
      const width = meta?.defaultSize?.w ?? defaultSize.value.width
      const height = meta?.defaultSize?.h ?? defaultSize.value.height

      // 与预览位置保持一致
      const offsetX = 10
      const offsetY = 10
      const dropX = snappedX + offsetX
      const dropY = snappedY + offsetY

      console.log('[useDrop] Calling onDrop with:', { type: data.type, x: dropX, y: dropY })
      onDrop(data, dropX, dropY)
    } catch (err) {
      console.error('[useDrop] Failed to parse drop data:', err)
    }

    dropPreview.value = null
    dragData.value = null
  }

  return {
    isDragOver,
    dropPreview,
    dragData,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    screenToCanvas,
  }
}
