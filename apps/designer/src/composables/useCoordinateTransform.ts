import type { Ref } from 'vue'
import type { VueFlow } from '@vue-flow/core'
import { useCanvasStore } from '@/stores/canvas'

export interface CoordinateTransform {
  screenToCanvas: (screenX: number, screenY: number) => { x: number; y: number }
  canvasToScreen: (canvasX: number, canvasY: number) => { x: number; y: number }
  canvasToVueFlow: (canvasX: number, canvasY: number) => { x: number; y: number }
  vueFlowToCanvas: (vfX: number, vfY: number) => { x: number; y: number }
  screenToVueFlow: (screenX: number, screenY: number) => { x: number; y: number }
  vueFlowToScreen: (vfX: number, vfY: number) => { x: number; y: number }
}

export function useCoordinateTransform(
  containerRef: Ref<HTMLElement | null>,
  vueFlowInstance: Ref<InstanceType<typeof VueFlow> | null>
): CoordinateTransform {
  const canvasStore = useCanvasStore()

  const screenToCanvas = (screenX: number, screenY: number) => {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: (screenX - rect.left - canvasStore.offsetX) / canvasStore.scale,
      y: (screenY - rect.top - canvasStore.offsetY) / canvasStore.scale,
    }
  }

  const canvasToScreen = (canvasX: number, canvasY: number) => {
    if (!containerRef.value) return { x: 0, y: 0 }
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: canvasX * canvasStore.scale + canvasStore.offsetX + rect.left,
      y: canvasY * canvasStore.scale + canvasStore.offsetY + rect.top,
    }
  }

  const canvasToVueFlow = (canvasX: number, canvasY: number) => {
    const flow = vueFlowInstance.value
    if (!flow) return { x: canvasX, y: canvasY }
    
    const viewportTransform = flow.viewport.value
    const zoom = viewportTransform.zoom ?? 1
    const x = viewportTransform.x ?? 0
    const y = viewportTransform.y ?? 0
    
    return {
      x: (canvasX - x) / zoom,
      y: (canvasY - y) / zoom,
    }
  }

  const vueFlowToCanvas = (vfX: number, vfY: number) => {
    const flow = vueFlowInstance.value
    if (!flow) return { x: vfX, y: vfY }
    
    const viewportTransform = flow.viewport.value
    const zoom = viewportTransform.zoom ?? 1
    const x = viewportTransform.x ?? 0
    const y = viewportTransform.y ?? 0
    
    return {
      x: vfX * zoom + x,
      y: vfY * zoom + y,
    }
  }

  const screenToVueFlow = (screenX: number, screenY: number) => {
    const canvasPos = screenToCanvas(screenX, screenY)
    return canvasToVueFlow(canvasPos.x, canvasPos.y)
  }

  const vueFlowToScreen = (vfX: number, vfY: number) => {
    const canvasPos = vueFlowToCanvas(vfX, vfY)
    return canvasToScreen(canvasPos.x, canvasPos.y)
  }

  return {
    screenToCanvas,
    canvasToScreen,
    canvasToVueFlow,
    vueFlowToCanvas,
    screenToVueFlow,
    vueFlowToScreen,
  }
}
