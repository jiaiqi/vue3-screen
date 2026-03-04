import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CanvasConfig, GridConfig } from '@screen/core'

export const useCanvasStore = defineStore('canvas', () => {
  const config = ref<CanvasConfig>({
    width: 1920,
    height: 1080,
    background: { color: '#0d1117' },
    fitMode: 'scale',
    canvasMode: 'hybrid',
    grid: { enabled: true, size: 20, snap: true, color: 'rgba(255,255,255,0.05)' },
    rulers: true,
  })

  const scale = ref(1)
  const offsetX = ref(0)
  const offsetY = ref(0)

  const transform = computed(() =>
    `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`
  )

  function setScale(newScale: number) {
    scale.value = Math.max(0.1, Math.min(5, newScale))
  }

  function setOffset(x: number, y: number) {
    offsetX.value = x
    offsetY.value = y
  }

  function zoomIn() {
    setScale(scale.value * 1.1)
  }

  function zoomOut() {
    setScale(scale.value / 1.1)
  }

  function fitToScreen(containerWidth: number, containerHeight: number) {
    const scaleX = containerWidth / config.value.width
    const scaleY = containerHeight / config.value.height
    setScale(Math.min(scaleX, scaleY) * 0.95)
    setOffset(
      (containerWidth - config.value.width * scale.value) / 2,
      (containerHeight - config.value.height * scale.value) / 2
    )
  }

  function setCanvasSize(width: number, height: number) {
    config.value.width = width
    config.value.height = height
  }

  function setGridConfig(gridConfig: Partial<GridConfig>) {
    config.value.grid = { ...config.value.grid, ...gridConfig }
  }

  return {
    config,
    scale,
    offsetX,
    offsetY,
    transform,
    setScale,
    setOffset,
    zoomIn,
    zoomOut,
    fitToScreen,
    setCanvasSize,
    setGridConfig,
  }
})
