<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rect: { x: number; y: number; width: number; height: number }
  count?: number
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  scale: 1,
})

const boxStyle = computed(() => ({
  left: `${props.rect.x}px`,
  top: `${props.rect.y}px`,
  width: `${props.rect.width}px`,
  height: `${props.rect.height}px`,
}))

const showCount = computed(() => props.count > 1)

const countLabelStyle = computed(() => ({
  transform: `scale(${1 / props.scale})`,
}))
</script>

<template>
  <div
    v-if="rect.width > 0 && rect.height > 0"
    class="selection-box absolute border-2 border-dashed border-primary bg-primary/5 pointer-events-none"
    :style="boxStyle"
  >
    <div
      v-if="showCount"
      class="count-label absolute -top-6 left-0 px-2 py-0.5 bg-primary text-white text-xs rounded"
      :style="countLabelStyle"
    >
      已选中 {{ count }} 个元素
    </div>
  </div>
</template>

<style scoped>
.selection-box {
  z-index: 1000;
  border-color: var(--color-primary, #0073ff);
  background-color: rgba(0, 115, 255, 0.05);
}

.count-label {
  white-space: nowrap;
  transform-origin: bottom left;
}
</style>
