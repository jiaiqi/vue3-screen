import { ref, computed } from 'vue'

export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function useTransform() {
  const scale = ref(1)
  const offsetX = ref(0)
  const offsetY = ref(0)

  const matrix = computed(() => ({
    a: scale.value,
    b: 0,
    c: 0,
    d: scale.value,
    e: offsetX.value,
    f: offsetY.value,
  }))

  const transformString = computed(() => 
    `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`
  )

  function applyTransform(point: Point): Point {
    return {
      x: point.x * scale.value + offsetX.value,
      y: point.y * scale.value + offsetY.value,
    }
  }

  function inverseTransform(point: Point): Point {
    return {
      x: (point.x - offsetX.value) / scale.value,
      y: (point.y - offsetY.value) / scale.value,
    }
  }

  return {
    scale,
    offsetX,
    offsetY,
    matrix,
    transformString,
    applyTransform,
    inverseTransform,
  }
}
