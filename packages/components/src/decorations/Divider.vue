<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: string
  style?: 'solid' | 'dashed' | 'dotted'
}

const props = withDefaults(defineProps<Props>(), {
  color: '#0073ff',
  style: 'solid',
})

const dividerStyle = computed(() => ({
  borderColor: props.color,
  borderStyle: props.style,
}))
</script>

<template>
  <div class="divider h-full w-full flex items-center">
    <div 
      class="divider-line h-0 w-full border-t-2 transition-colors"
      :style="dividerStyle"
    />
  </div>
</template>

<style scoped>
.divider-line {
  box-shadow: 0 0 5px v-bind('color');
}
</style>
