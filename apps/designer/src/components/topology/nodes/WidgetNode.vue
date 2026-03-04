<script setup lang="ts">
import { computed, ref } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import { useSelectionStore } from '@/stores/selection'
import { getComponent } from '@screen/components'

const props = defineProps<NodeProps>()

const selectionStore = useSelectionStore()

const isSelected = computed(() => selectionStore.isSelected(props.id))

const componentMeta = computed(() => {
  const componentType = props.data?.componentType
  if (!componentType) return null
  return getComponent(componentType)?.meta
})

const nodeStyle = computed(() => ({
  width: `${props.data?.width || 200}px`,
  height: `${props.data?.height || 150}px`,
  ...props.data?.style,
}))

const nodeClass = computed(() => [
  'widget-node',
  'relative',
  'rounded-lg',
  'border',
  'transition-all',
  'duration-200',
  isSelected.value ? 'border-primary shadow-glow' : 'border-border hover:border-node-hover',
])
</script>

<template>
  <div :class="nodeClass" :style="nodeStyle">
    <div class="node-content h-full w-full overflow-hidden">
      <div class="flex h-full w-full items-center justify-center text-text-secondary">
        {{ data?.label || 'Widget' }}
      </div>
    </div>

    <Handle
      v-if="false"
      type="source"
      :position="Position.Right"
      class="!bg-primary !w-3 !h-3 !border-2 !border-white"
    />
    <Handle
      v-if="false"
      type="target"
      :position="Position.Left"
      class="!bg-primary !w-3 !h-3 !border-2 !border-white"
    />
  </div>
</template>

<style scoped>
.widget-node {
  background: var(--color-surface-elevated);
}
</style>
