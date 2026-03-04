import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSelectionStore = defineStore('selection', () => {
  const selectedIds = ref<Set<string>>(new Set())
  const hoveredId = ref<string | null>(null)

  const selectedCount = computed(() => selectedIds.value.size)
  const hasSelection = computed(() => selectedIds.value.size > 0)

  function select(id: string) {
    selectedIds.value.clear()
    selectedIds.value.add(id)
  }

  function selectMultiple(ids: string[]) {
    selectedIds.value.clear()
    ids.forEach(id => selectedIds.value.add(id))
  }

  function addToSelection(id: string) {
    selectedIds.value.add(id)
  }

  function removeFromSelection(id: string) {
    selectedIds.value.delete(id)
  }

  function toggleSelection(id: string) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
  }

  function clearSelection() {
    selectedIds.value.clear()
  }

  function isSelected(id: string) {
    return selectedIds.value.has(id)
  }

  function setHovered(id: string | null) {
    hoveredId.value = id
  }

  return {
    selectedIds,
    hoveredId,
    selectedCount,
    hasSelection,
    select,
    selectMultiple,
    addToSelection,
    removeFromSelection,
    toggleSelection,
    clearSelection,
    isSelected,
    setHovered,
  }
})
