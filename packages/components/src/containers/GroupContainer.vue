<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  showTitle?: boolean
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '分组',
  showTitle: true,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
})

const containerStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
}))
</script>

<template>
  <div class="group-container h-full w-full rounded-lg border border-border p-3" :style="containerStyle">
    <div v-if="showTitle" class="mb-2 text-sm font-medium text-text-primary">
      {{ title }}
    </div>
    <div class="content-area h-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.group-container {
  box-shadow: 0 0 10px rgba(0, 115, 255, 0.1);
}
</style>
