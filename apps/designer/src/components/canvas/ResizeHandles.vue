<script setup lang="ts">
import { computed } from 'vue'
import type { NodeLayout } from '@screen/core'
import type { ResizeHandle } from '@/composables/useResize'

interface Props {
  layout: NodeLayout
  scale: number
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
})

const emit = defineEmits<{
  (e: 'resizeStart', handle: ResizeHandle, event: MouseEvent): void
}>()

const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

const handleCursors: Record<ResizeHandle, string> = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
}

const handlePositions = computed(() => ({
  nw: { top: '0', left: '0', transform: 'translate(-50%, -50%)' },
  n: { top: '0', left: '50%', transform: 'translate(-50%, -50%)' },
  ne: { top: '0', right: '0', transform: 'translate(50%, -50%)' },
  e: { top: '50%', right: '0', transform: 'translate(50%, -50%)' },
  se: { bottom: '0', right: '0', transform: 'translate(50%, 50%)' },
  s: { bottom: '0', left: '50%', transform: 'translate(-50%, 50%)' },
  sw: { bottom: '0', left: '0', transform: 'translate(-50%, 50%)' },
  w: { top: '50%', left: '0', transform: 'translate(-50%, -50%)' },
}))

const handleSize = computed(() => {
  const baseSize = 8
  const scaledSize = baseSize / props.scale
  return Math.max(6, Math.min(12, scaledSize))
})

function handleMouseDown(e: MouseEvent, handle: ResizeHandle) {
  e.preventDefault()
  e.stopPropagation()
  emit('resizeStart', handle, e)
}
</script>

<template>
  <div
    v-if="visible"
    class="resize-handles absolute inset-0 pointer-events-none"
  >
    <div
      v-for="handle in handles"
      :key="handle"
      :data-handle="handle"
      class="resize-handle pointer-events-auto absolute bg-primary border-2 border-white rounded-full shadow-lg transition-transform hover:scale-125"
      :style="{
        ...handlePositions[handle],
        cursor: handleCursors[handle],
        width: `${handleSize}px`,
        height: `${handleSize}px`,
      }"
      @mousedown="handleMouseDown($event, handle)"
    />
  </div>
</template>

<style scoped>
.resize-handle {
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.resize-handle:hover {
  background: var(--color-primary-light, #409eff);
}
</style>
