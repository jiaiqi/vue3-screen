import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { Ref } from 'vue'

export interface AdaptiveScaleOptions {
  designWidth: number
  designHeight: number
  mode: 'scale-fit' | 'vw-vh' | 'rem'
  containerRef: Ref<HTMLElement | null>
}

export function useAdaptiveScale(options: AdaptiveScaleOptions) {
  const { designWidth, designHeight, mode, containerRef } = options

  const scale = ref(1)
  const offsetX = ref(0)
  const offsetY = ref(0)

  const transform = computed(() => {
    switch (mode) {
      case 'scale-fit':
        return `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`
      case 'vw-vh':
        return undefined
      case 'rem':
        return undefined
      default:
        return `scale(${scale.value})`
    }
  })

  const transformOrigin = computed(() => {
    return mode === 'scale-fit' ? 'top left' : 'center center'
  })

  function updateScale() {
    if (!containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const scaleX = rect.width / designWidth
    const scaleY = rect.height / designHeight

    scale.value = Math.min(scaleX, scaleY)

    offsetX.value = (rect.width - designWidth * scale.value) / 2
    offsetY.value = (rect.height - designHeight * scale.value) / 2
  }

  useResizeObserver(containerRef, updateScale)

  onMounted(updateScale)

  return {
    scale,
    offsetX,
    offsetY,
    transform,
    transformOrigin,
    updateScale,
  }
}
