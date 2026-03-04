import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useCanvasStore } from '@/stores/canvas'

export function useCanvas(containerRef: Ref<HTMLElement | null>) {
  const store = useCanvasStore()
  const isPanning = ref(false)
  const panStart = ref({ x: 0, y: 0 })
  const offsetStart = ref({ x: 0, y: 0 })

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      store.setScale(store.scale * delta)
    } else {
      store.setOffset(
        store.offsetX - e.deltaX,
        store.offsetY - e.deltaY
      )
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
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

  onMounted(() => {
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      store.fitToScreen(rect.width, rect.height)
    }
  })

  useEventListener(containerRef, 'wheel', handleWheel, { passive: false })
  useEventListener(containerRef, 'mousedown', handleMouseDown)
  useEventListener(window, 'mousemove', handleMouseMove)
  useEventListener(window, 'mouseup', handleMouseUp)

  return {
    isPanning,
    screenToCanvas,
    canvasToScreen,
  }
}
