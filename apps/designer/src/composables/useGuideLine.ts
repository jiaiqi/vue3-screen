import { ref } from 'vue'

export interface GuideLine {
  id: string
  type: 'horizontal' | 'vertical'
  position: number
}

export function useGuideLine() {
  const guides = ref<GuideLine[]>([])
  const isDragging = ref(false)
  const dragGuide = ref<GuideLine | null>(null)

  function addGuide(type: 'horizontal' | 'vertical', position: number) {
    const guide: GuideLine = {
      id: `guide-${Date.now()}`,
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
    startDrag,
    updateDrag,
    endDrag,
  }
}
