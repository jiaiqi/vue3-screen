import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CanvasConfig, GridConfig } from '@screen/core'

export interface GuideLine {
  id: string
  type: 'horizontal' | 'vertical'
  position: number
}

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
  const guides = ref<GuideLine[]>([])
  const showMinimap = ref(true)

  const scalePercent = computed(() => Math.round(scale.value * 100))

  const transform = computed(() =>
    `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`
  )

  const scaleOptions = [25, 50, 75, 100, 125, 150, 200, 300, 400]

  function setScale(newScale: number) {
    scale.value = Math.max(0.1, Math.min(5, newScale))
  }

  function setScalePercent(percent: number) {
    setScale(percent / 100)
  }

  function resetScale() {
    setScale(1)
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
    const currentGrid = config.value.grid || { enabled: true, size: 10, snap: false }
    config.value.grid = { ...currentGrid, ...gridConfig } as GridConfig
  }

  function addGuide(type: 'horizontal' | 'vertical', position: number) {
    const guide: GuideLine = {
      id: `guide-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      position,
    }
    guides.value.push(guide)
    return guide
  }

  function removeGuide(id: string) {
    const index = guides.value.findIndex(g => g.id === id)
    if (index > -1) {
      guides.value.splice(index, 1)
    }
  }

  function updateGuidePosition(id: string, position: number) {
    const guide = guides.value.find(g => g.id === id)
    if (guide) {
      guide.position = position
    }
  }

  function clearGuides() {
    guides.value = []
  }

  function toggleMinimap() {
    showMinimap.value = !showMinimap.value
  }

  return {
    config,
    scale,
    scalePercent,
    scaleOptions,
    offsetX,
    offsetY,
    transform,
    guides,
    showMinimap,
    setScale,
    setScalePercent,
    resetScale,
    setOffset,
    zoomIn,
    zoomOut,
    fitToScreen,
    setCanvasSize,
    setGridConfig,
    addGuide,
    removeGuide,
    updateGuidePosition,
    clearGuides,
    toggleMinimap,
  }
})
