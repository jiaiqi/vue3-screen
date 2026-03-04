import { reactive, computed } from 'vue'
import type { CanvasConfig } from '../schema/types'

export interface CanvasState {
  config: CanvasConfig
  scale: number
  offsetX: number
  offsetY: number
}

export function createCanvasEngine(config: CanvasConfig) {
  const state = reactive<CanvasState>({
    config,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  })

  const transform = computed(() => 
    `translate(${state.offsetX}px, ${state.offsetY}px) scale(${state.scale})`
  )

  function setScale(newScale: number) {
    state.scale = Math.max(0.1, Math.min(5, newScale))
  }

  function setOffset(x: number, y: number) {
    state.offsetX = x
    state.offsetY = y
  }

  function zoomIn() {
    setScale(state.scale * 1.1)
  }

  function zoomOut() {
    setScale(state.scale / 1.1)
  }

  function fitToScreen(containerWidth: number, containerHeight: number) {
    const scaleX = containerWidth / state.config.width
    const scaleY = containerHeight / state.config.height
    setScale(Math.min(scaleX, scaleY) * 0.95)
    setOffset(0, 0)
  }

  function screenToCanvas(screenX: number, screenY: number) {
    return {
      x: (screenX - state.offsetX) / state.scale,
      y: (screenY - state.offsetY) / state.scale,
    }
  }

  function canvasToScreen(canvasX: number, canvasY: number) {
    return {
      x: canvasX * state.scale + state.offsetX,
      y: canvasY * state.scale + state.offsetY,
    }
  }

  return {
    state,
    transform,
    setScale,
    setOffset,
    zoomIn,
    zoomOut,
    fitToScreen,
    screenToCanvas,
    canvasToScreen,
  }
}

export type CanvasEngine = ReturnType<typeof createCanvasEngine>
