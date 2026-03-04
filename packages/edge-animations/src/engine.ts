import { ref, watch, computed } from 'vue'
import type { Ref } from 'vue'
import type { EdgeAnimationConfig, DataDrivenAnimation } from './types'

export function useEdgeAnimation(
  config: EdgeAnimationConfig,
  dataBinding?: DataDrivenAnimation,
  data?: Ref<Record<string, unknown>>
) {
  const animationState = ref({
    speed: config.speed,
    direction: config.direction,
    color: config.color,
    active: true,
  })

  const animationStyle = computed(() => {
    const state = animationState.value
    if (!state.active) {
      return {
        strokeDasharray: 'none',
        animation: 'none',
      }
    }

    const dashLength = 20
    const gapLength = 10
    const duration = 2 / state.speed

    return {
      strokeDasharray: `${dashLength} ${gapLength}`,
      animation: `flow ${duration}s linear infinite ${state.direction === 'reverse' ? 'reverse' : 'normal'}`,
      stroke: state.color,
    }
  })

  function updateFromData(newData: Record<string, unknown>) {
    if (!dataBinding) return

    if (dataBinding.speedField && newData[dataBinding.speedField] !== undefined) {
      const speed = Number(newData[dataBinding.speedField])
      animationState.value.speed = Math.max(0.1, Math.min(5, speed / 20))
    }

    if (dataBinding.dirField && newData[dataBinding.dirField] !== undefined) {
      const dir = Number(newData[dataBinding.dirField])
      animationState.value.direction = dir >= 0 ? 'forward' : 'reverse'
    }

    if (dataBinding.colorField && newData[dataBinding.colorField] !== undefined && dataBinding.colorMap) {
      const value = Number(newData[dataBinding.colorField])
      const colorEntry = dataBinding.colorMap.find((c, i, arr) => {
        const next = arr[i + 1]
        return next ? value >= c.value && value < next.value : value >= c.value
      })
      if (colorEntry) {
        animationState.value.color = colorEntry.color
      }
    }

    if (dataBinding.activeField && newData[dataBinding.activeField] !== undefined) {
      animationState.value.active = Boolean(newData[dataBinding.activeField])
    }
  }

  if (data) {
    watch(data, updateFromData, { immediate: true, deep: true })
  }

  return {
    animationState,
    animationStyle,
    updateFromData,
  }
}
