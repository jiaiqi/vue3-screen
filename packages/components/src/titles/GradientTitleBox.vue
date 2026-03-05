<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  width?: number | string
  height?: number | string
  theme?: 'ocean' | 'sunset' | 'aurora'
}

const props = withDefaults(defineProps<Props>(), {
  title: '渐变标题',
  subtitle: '',
  width: '100%',
  height: 80,
  theme: 'ocean',
})

const themeGradients = {
  ocean: {
    colors: ['#0052d4', '#4364f7', '#6fb1fc'],
    textColor: '#ffffff',
    subtitleColor: 'rgba(255, 255, 255, 0.8)',
  },
  sunset: {
    colors: ['#f12711', '#f5af19', '#f12711'],
    textColor: '#ffffff',
    subtitleColor: 'rgba(255, 255, 255, 0.85)',
  },
  aurora: {
    colors: ['#00c9ff', '#92fe9d', '#00c9ff'],
    textColor: '#ffffff',
    subtitleColor: 'rgba(255, 255, 255, 0.9)',
  },
}

const currentTheme = computed(() => themeGradients[props.theme])
const gradientStyle = computed(() => {
  const colors = currentTheme.value.colors
  return `linear-gradient(135deg, ${colors.join(', ')})`
})
</script>

<template>
  <div
    class="gradient-title-box"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      background: gradientStyle,
    }"
  >
    <div class="gradient-overlay" />
    <div class="title-content">
      <h3 class="main-title" :style="{ color: currentTheme.textColor }">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="sub-title" :style="{ color: currentTheme.subtitleColor }">
        {{ subtitle }}
      </p>
    </div>
    <div class="shine-effect" />
  </div>
</template>

<style scoped>
.gradient-title-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.title-content {
  position: relative;
  text-align: center;
  z-index: 2;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.sub-title {
  font-size: 13px;
  margin: 6px 0 0 0;
  letter-spacing: 2px;
}

.shine-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50%, 100% { left: 150%; }
}
</style>
