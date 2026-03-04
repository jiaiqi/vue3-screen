<script setup lang="ts">
interface Props {
  text?: string
  fontSize?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '大屏标题',
  fontSize: 28,
  color: '#f0f6fc',
})
</script>

<template>
  <div 
    class="title-box flex h-full w-full items-center justify-center"
    :style="{ 
      fontSize: `${fontSize}px`,
      color,
      textShadow: `0 0 10px ${color}40`,
    }"
  >
    {{ text }}
  </div>
</template>
