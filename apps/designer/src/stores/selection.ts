import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NodeLayout } from '@screen/core'

export interface SelectionBounds {
  x: number
  y: number
  width: number
  height: number
}

export const useSelectionStore = defineStore('selection', () => {
  const selectedIds = ref<Set<string>>(new Set())
  const hoveredId = ref<string | null>(null)
  const focusedId = ref<string | null>(null)

  const selectedCount = computed(() => selectedIds.value.size)
  const hasSelection = computed(() => selectedIds.value.size > 0)
  const hasMultipleSelection = computed(() => selectedIds.value.size > 1)
  const firstSelectedId = computed(() => {
    const ids = Array.from(selectedIds.value)
    return ids.length > 0 ? ids[0] : null
  })

  function select(id: string) {
    selectedIds.value.clear()
    selectedIds.value.add(id)
    focusedId.value = id
  }

  function selectMultiple(ids: string[]) {
    selectedIds.value.clear()
    ids.forEach(id => selectedIds.value.add(id))
    if (ids.length === 1) {
      focusedId.value = ids[0]
    }
  }

  function addToSelection(id: string) {
    selectedIds.value.add(id)
  }

  function removeFromSelection(id: string) {
    selectedIds.value.delete(id)
    if (focusedId.value === id) {
      focusedId.value = null
    }
  }

  function toggleSelection(id: string) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
      if (focusedId.value === id) {
        focusedId.value = null
      }
    } else {
      selectedIds.value.add(id)
      focusedId.value = id
    }
  }

  function clearSelection() {
    selectedIds.value.clear()
    focusedId.value = null
  }

  function isSelected(id: string) {
    return selectedIds.value.has(id)
  }

  function setHovered(id: string | null) {
    hoveredId.value = id
  }

  function setFocused(id: string | null) {
    focusedId.value = id
  }

  function isFocused(id: string) {
    return focusedId.value === id
  }

  function getSelectedIds(): string[] {
    return Array.from(selectedIds.value)
  }

  function getSelectionBounds(nodes: { id: string; layout: NodeLayout }[]): SelectionBounds | null {
    const selectedNodes = nodes.filter(n => selectedIds.value.has(n.id))
    if (selectedNodes.length === 0) return null

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    selectedNodes.forEach(node => {
      minX = Math.min(minX, node.layout.x)
      minY = Math.min(minY, node.layout.y)
      maxX = Math.max(maxX, node.layout.x + node.layout.w)
      maxY = Math.max(maxY, node.layout.y + node.layout.h)
    })

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  function selectAll(ids: string[]) {
    selectedIds.value.clear()
    ids.forEach(id => selectedIds.value.add(id))
  }

  function invertSelection(allIds: string[]) {
    const currentSelected = new Set(selectedIds.value)
    selectedIds.value.clear()
    allIds.forEach(id => {
      if (!currentSelected.has(id)) {
        selectedIds.value.add(id)
      }
    })
  }

  return {
    selectedIds,
    hoveredId,
    focusedId,
    selectedCount,
    hasSelection,
    hasMultipleSelection,
    firstSelectedId,
    select,
    selectMultiple,
    addToSelection,
    removeFromSelection,
    toggleSelection,
    clearSelection,
    isSelected,
    setHovered,
    setFocused,
    isFocused,
    getSelectedIds,
    getSelectionBounds,
    selectAll,
    invertSelection,
  }
})
