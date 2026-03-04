<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElIcon, ElTooltip } from 'element-plus'
import {
  Top, Bottom, Left, Right,
  Rank, DcRefresh, FullScreen,
  Grid
} from '@element-plus/icons-vue'
import { useSelectionStore } from '@/stores/selection'
import { useDesignerStore } from '@/stores/designer'

const selectionStore = useSelectionStore()
const designerStore = useDesignerStore()

const hasMultipleSelection = computed(() => selectionStore.selectedCount >= 2)

function getSelectedNodes() {
  const ids = Array.from(selectionStore.selectedIds)
  return ids
    .map(id => designerStore.getNodeById(id))
    .filter(Boolean) as { id: string; layout: { x: number; y: number; w: number; h: number } }[]
}

function alignLeft() {
  const nodes = getSelectedNodes()
  if (nodes.length < 2) return
  const minX = Math.min(...nodes.map(n => n.layout.x))
  nodes.forEach(n => {
    n.layout.x = minX
  })
}

function alignCenter() {
  const nodes = getSelectedNodes()
  if (nodes.length < 2) return
  const centerX = nodes.reduce((sum, n) => sum + n.layout.x + n.layout.w / 2, 0) / nodes.length
  nodes.forEach(n => {
    n.layout.x = centerX - n.layout.w / 2
  })
}

function alignRight() {
  const nodes = getSelectedNodes()
  if (nodes.length < 2) return
  const maxRight = Math.max(...nodes.map(n => n.layout.x + n.layout.w))
  nodes.forEach(n => {
    n.layout.x = maxRight - n.layout.w
  })
}

function alignTop() {
  const nodes = getSelectedNodes()
  if (nodes.length < 2) return
  const minY = Math.min(...nodes.map(n => n.layout.y))
  nodes.forEach(n => {
    n.layout.y = minY
  })
}

function alignMiddle() {
  const nodes = getSelectedNodes()
  if (nodes.length < 2) return
  const centerY = nodes.reduce((sum, n) => sum + n.layout.y + n.layout.h / 2, 0) / nodes.length
  nodes.forEach(n => {
    n.layout.y = centerY - n.layout.h / 2
  })
}

function alignBottom() {
  const nodes = getSelectedNodes()
  if (nodes.length < 2) return
  const maxBottom = Math.max(...nodes.map(n => n.layout.y + n.layout.h))
  nodes.forEach(n => {
    n.layout.y = maxBottom - n.layout.h
  })
}

function distributeHorizontal() {
  const nodes = getSelectedNodes()
  if (nodes.length < 3) return
  
  const sorted = [...nodes].sort((a, b) => a.layout.x - b.layout.x)
  const totalWidth = sorted.reduce((sum, n) => sum + n.layout.w, 0)
  const minX = sorted[0].layout.x
  const maxX = sorted[sorted.length - 1].layout.x + sorted[sorted.length - 1].layout.w
  const availableSpace = maxX - minX - totalWidth
  const gap = availableSpace / (sorted.length - 1)

  let currentX = minX
  sorted.forEach((n, i) => {
    if (i === 0) {
      currentX = n.layout.x + n.layout.w + gap
    } else if (i < sorted.length - 1) {
      n.layout.x = currentX
      currentX += n.layout.w + gap
    }
  })
}

function distributeVertical() {
  const nodes = getSelectedNodes()
  if (nodes.length < 3) return
  
  const sorted = [...nodes].sort((a, b) => a.layout.y - b.layout.y)
  const totalHeight = sorted.reduce((sum, n) => sum + n.layout.h, 0)
  const minY = sorted[0].layout.y
  const maxY = sorted[sorted.length - 1].layout.y + sorted[sorted.length - 1].layout.h
  const availableSpace = maxY - minY - totalHeight
  const gap = availableSpace / (sorted.length - 1)

  let currentY = minY
  sorted.forEach((n, i) => {
    if (i === 0) {
      currentY = n.layout.y + n.layout.h + gap
    } else if (i < sorted.length - 1) {
      n.layout.y = currentY
      currentY += n.layout.h + gap
    }
  })
}
</script>

<template>
  <div
    v-if="hasMultipleSelection"
    class="align-toolbar absolute top-4 left-1/2 z-50 flex gap-1 rounded-lg bg-surface-elevated p-2 shadow-lg"
    style="transform: translateX(-50%)"
  >
    <ElTooltip content="左对齐" placement="bottom">
      <ElButton size="small" @click="alignLeft">
        <ElIcon><Left /></ElIcon>
      </ElButton>
    </ElTooltip>

    <ElTooltip content="水平居中" placement="bottom">
      <ElButton size="small" @click="alignCenter">
        <ElIcon><Rank /></ElIcon>
      </ElButton>
    </ElTooltip>

    <ElTooltip content="右对齐" placement="bottom">
      <ElButton size="small" @click="alignRight">
        <ElIcon><Right /></ElIcon>
      </ElButton>
    </ElTooltip>

    <div class="mx-1 w-px bg-border" />

    <ElTooltip content="顶对齐" placement="bottom">
      <ElButton size="small" @click="alignTop">
        <ElIcon><Top /></ElIcon>
      </ElButton>
    </ElTooltip>

    <ElTooltip content="垂直居中" placement="bottom">
      <ElButton size="small" @click="alignMiddle">
        <ElIcon><DcRefresh /></ElIcon>
      </ElButton>
    </ElTooltip>

    <ElTooltip content="底对齐" placement="bottom">
      <ElButton size="small" @click="alignBottom">
        <ElIcon><Bottom /></ElIcon>
      </ElButton>
    </ElTooltip>

    <div class="mx-1 w-px bg-border" />

    <ElTooltip content="水平等间距" placement="bottom">
      <ElButton size="small" @click="distributeHorizontal">
        <ElIcon><Grid /></ElIcon>
      </ElButton>
    </ElTooltip>

    <ElTooltip content="垂直等间距" placement="bottom">
      <ElButton size="small" @click="distributeVertical">
        <ElIcon class="rotate-90"><Grid /></ElIcon>
      </ElButton>
    </ElTooltip>
  </div>
</template>
