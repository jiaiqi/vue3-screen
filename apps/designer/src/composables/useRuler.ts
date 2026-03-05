import { ref, watch } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

export interface RulerMark {
  position: number
  value: number
  isMajor: boolean
}

export function useRuler(type: 'horizontal' | 'vertical') {
  const store = useCanvasStore()
  const marks = ref<RulerMark[]>([])
  const rulerSize = 16

  const updateMarks = () => {
    const newMarks: RulerMark[] = []
    const scale = store.scale
    const offset = type === 'horizontal' ? store.offsetX : store.offsetY
    const canvasSize = type === 'horizontal' ? store.config.width : store.config.height

    let step = 50
    if (scale < 0.5) step = 100
    if (scale < 0.25) step = 200
    if (scale > 2) step = 25
    if (scale > 4) step = 10

    const start = Math.floor(-offset / scale / step) * step
    const end = Math.ceil((canvasSize - offset / scale) / step) * step + step

    for (let i = start; i <= end; i += step) {
      const position = i * scale + offset
      if (position >= -rulerSize && position <= canvasSize * scale + rulerSize) {
        newMarks.push({
          position,
          value: i,
          isMajor: i % (step * 2) === 0,
        })
      }
    }

    marks.value = newMarks
  }

  watch([() => store.scale, () => store.offsetX, () => store.offsetY], updateMarks, { immediate: true })

  return {
    marks,
    rulerSize,
  }
}
