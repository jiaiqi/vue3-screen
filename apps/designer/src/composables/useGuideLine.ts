import { ref, computed } from 'vue'
import { useCanvasStore, type GuideLine } from '@/stores/canvas'

export type { GuideLine }

export function useGuideLine() {
  const store = useCanvasStore()

  const guides = computed(() => store.guides)
  const isDragging = ref(false)
  const dragGuide = ref<GuideLine | null>(null)

  function addGuide(type: 'horizontal' | 'vertical', position: number) {
    return store.addGuide(type, position)
  }

  function removeGuide(id: string) {
    store.removeGuide(id)
  }

  function updateGuidePosition(id: string, position: number) {
    store.updateGuidePosition(id, position)
  }

  function clearGuides() {
    store.clearGuides()
  }

  function startDrag(type: 'horizontal' | 'vertical', startPosition: number) {
    isDragging.value = true
    dragGuide.value = addGuide(type, startPosition)
  }

  function updateDrag(position: number) {
    if (dragGuide.value) {
      updateGuidePosition(dragGuide.value.id, position)
    }
  }

  function endDrag() {
    if (dragGuide.value && dragGuide.value.position < 0) {
      removeGuide(dragGuide.value.id)
    }
    isDragging.value = false
    dragGuide.value = null
  }

  return {
    guides,
    isDragging,
    dragGuide,
    addGuide,
    removeGuide,
    updateGuidePosition,
    clearGuides,
    startDrag,
    updateDrag,
    endDrag,
  }
}
