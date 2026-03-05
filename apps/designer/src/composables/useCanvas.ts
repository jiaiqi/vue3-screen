import type { Ref } from 'vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useCanvasStore } from '@/stores/canvas'

const MIN_SCALE = 0.1
const MAX_SCALE = 4.0
const ZOOM_STEP = 0.1

export function useCanvas(containerRef: Ref<HTMLElement | null>) {
  const store = useCanvasStore()
  const isPanning = ref(false)
  const isSpacePressed = ref(false)
  const panStart = ref({ x: 0, y: 0 })
  const offsetStart = ref({ x: 0, y: 0 })

  const cursor = computed(() => {
    if (isPanning.value) return 'grabbing'
    if (isSpacePressed.value) return 'grab'
    return 'default'
  })

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const rect = containerRef.value?.getBoundingClientRect()
      if (rect) {
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        zoomAtPoint(store.scale * delta, mouseX, mouseY)
      } else {
        store.setScale(store.scale * delta)
      }
    } else {
      store.setOffset(
        store.offsetX - e.deltaX,
        store.offsetY - e.deltaY
      )
    }
  }

  const zoomAtPoint = (newScale: number, pointX: number, pointY: number) => {
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))
    const scaleRatio = clampedScale / store.scale
    const newOffsetX = pointX - (pointX - store.offsetX) * scaleRatio
    const newOffsetY = pointY - (pointY - store.offsetY) * scaleRatio
    store.setScale(clampedScale)
    store.setOffset(newOffsetX, newOffsetY)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault()
      isSpacePressed.value = true
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      isSpacePressed.value = false
      if (isPanning.value) {
        isPanning.value = false
      }
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && (e.altKey || isSpacePressed.value))) {
      isPanning.value = true
      panStart.value = { x: e.clientX, y: e.clientY }
      offsetStart.value = { x: store.offsetX, y: store.offsetY }
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isPanning.value) {
      const dx = e.clientX - panStart.value.x
      const dy = e.clientY - panStart.value.y
      store.setOffset(
        offsetStart.value.x + dx,
        offsetStart.value.y + dy
      )
    }
  }

  const handleMouseUp = () => {
    isPanning.value = false
  }

  const screenToCanvas = (screenX: number, screenY: number) => {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: (screenX - rect.left - store.offsetX) / store.scale,
      y: (screenY - rect.top - store.offsetY) / store.scale,
    }
  }

  const canvasToScreen = (canvasX: number, canvasY: number) => {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: canvasX * store.scale + store.offsetX + rect.left,
      y: canvasY * store.scale + store.offsetY + rect.top,
    }
  }

  const zoomIn = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    zoomAtPoint(store.scale + ZOOM_STEP, centerX, centerY)
  }

  const zoomOut = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    zoomAtPoint(store.scale - ZOOM_STEP, centerX, centerY)
  }

  const fitScreen = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    store.fitToScreen(rect.width, rect.height)
  }

  const resetZoom = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    store.setScale(1)
    store.setOffset(
      (rect.width - store.config.width) / 2,
      (rect.height - store.config.height) / 2
    )
  }

  const panTo = (x: number, y: number) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    store.setOffset(
      rect.width / 2 - x * store.scale,
      rect.height / 2 - y * store.scale
    )
  }

  onMounted(() => {
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      store.fitToScreen(rect.width, rect.height)
    }
  })

  useEventListener(containerRef, 'wheel', handleWheel, { passive: false })
  useEventListener(containerRef, 'mousedown', handleMouseDown)
  useEventListener(window, 'keydown', handleKeyDown)
  useEventListener(window, 'keyup', handleKeyUp)
  useEventListener(window, 'mousemove', handleMouseMove)
  useEventListener(window, 'mouseup', handleMouseUp)
  useEventListener(window, 'blur', handleKeyUp)

  return {
    isPanning,
    isSpacePressed,
    cursor,
    screenToCanvas,
    canvasToScreen,
    zoomIn,
    zoomOut,
    fitScreen,
    resetZoom,
    panTo,
  }
}
