<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentInstance } from '@screen/components'

interface Props {
  component: ComponentInstance
}

const props = defineProps<Props>()

const iconClass = computed(() => props.component.meta.icon || 'i-carbon-document')
const displayName = computed(() => props.component.meta.name)
</script>

<template>
  <div
    class="material-item flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated p-3 cursor-pointer transition-all duration-200 hover:border-primary hover:bg-surface-overlay"
  >
    <div :class="iconClass" class="h-8 w-8 text-primary" />
    <span class="text-xs text-text-secondary text-center">{{ displayName }}</span>
  </div>
</template>
