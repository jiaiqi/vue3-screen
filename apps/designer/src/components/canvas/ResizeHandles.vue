<script setup lang="ts">
import { computed } from 'vue'
import type { NodeLayout } from '@screen/core'
import type { ResizeHandle } from '@/composables/useResize'

interface Props {
  layout: NodeLayout
  scale: number
}

const props = defineProps<Props>()

const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

const handleCursors: Record<ResizeHandle, string> = {
  nw: 'cursor-nw-resize',
  n: 'cursor-n-resize',
  ne: 'cursor-ne-resize',
  e: 'cursor-e-resize',
  se: 'cursor-se-resize',
  s: 'cursor-s-resize',
  sw: 'cursor-sw-resize',
  w: 'cursor-w-resize',
}

const handlePositions = computed(() => ({
  nw: { top: '-4px', left: '-4px' },
  n: { top: '-4px', left: '50%', transform: 'translateX(-50%)' },
  ne: { top: '-4px', right: '-4px' },
  e: { top: '50%', right: '-4px', transform: 'translateY(-50%)' },
  se: { bottom: '-4px', right: '-4px' },
  s: { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' },
  sw: { bottom: '-4px', left: '-4px' },
  w: { top: '50%', left: '-4px', transform: 'translateY(-50%)' },
}))
</script>

<template>
  <div class="resize-handles absolute inset-0 pointer-events-none">
    <div
      v-for="handle in handles"
      :key="handle"
      :data-handle="handle"
      class="resize-handle pointer-events-auto absolute h-2 w-2 rounded-full bg-primary border border-white"
      :class="handleCursors[handle]"
      :style="handlePositions[handle]"
    />
  </div>
</template>
