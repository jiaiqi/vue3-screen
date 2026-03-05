<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  width?: number | string
  height?: number | string
  theme?: 'dark' | 'light' | 'blue'
}

const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  subtitle: '',
  width: '100%',
  height: 60,
  theme: 'dark',
})

const themeColors = {
  dark: {
    bg: 'rgba(0, 20, 40, 0.8)',
    titleColor: '#f0f6fc',
    subtitleColor: '#8b949e',
    borderColor: '#30363d',
  },
  light: {
    bg: 'rgba(255, 255, 255, 0.9)',
    titleColor: '#1f2328',
    subtitleColor: '#656d76',
    borderColor: '#d0d7de',
  },
  blue: {
    bg: 'rgba(0, 50, 100, 0.8)',
    titleColor: '#58a6ff',
    subtitleColor: '#388bfd',
    borderColor: '#1f6feb',
  },
}

const currentTheme = computed(() => themeColors[props.theme])
</script>

<template>
  <div
    class="base-title-box"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      background: currentTheme.bg,
      borderColor: currentTheme.borderColor,
    }"
  >
    <div class="title-content">
      <h3
        class="main-title"
        :style="{ color: currentTheme.titleColor }"
      >
        {{ title }}
      </h3>
      <p
        v-if="subtitle"
        class="sub-title"
        :style="{ color: currentTheme.subtitleColor }"
      >
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.base-title-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 16px;
}

.title-content {
  text-align: center;
}

.main-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 2px;
}

.sub-title {
  font-size: 12px;
  margin: 4px 0 0 0;
  opacity: 0.8;
}
</style>
