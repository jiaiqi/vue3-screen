<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  width?: number | string
  height?: number | string
  theme?: 'cyan' | 'green' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  title: '科技标题',
  subtitle: '',
  width: '100%',
  height: 70,
  theme: 'cyan',
})

const themeColors = {
  cyan: {
    primary: '#00ffff',
    secondary: '#0080ff',
    glow: 'rgba(0, 255, 255, 0.3)',
  },
  green: {
    primary: '#00ff88',
    secondary: '#00cc66',
    glow: 'rgba(0, 255, 136, 0.3)',
  },
  purple: {
    primary: '#bf5af2',
    secondary: '#5e5ce6',
    glow: 'rgba(191, 90, 242, 0.3)',
  },
}

const currentTheme = computed(() => themeColors[props.theme])
</script>

<template>
  <div
    class="tech-title-box"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    }"
  >
    <svg class="tech-bg" viewBox="0 0 400 70" preserveAspectRatio="none">
      <defs>
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="currentTheme.primary" stop-opacity="0" />
          <stop offset="50%" :stop-color="currentTheme.primary" stop-opacity="0.8" />
          <stop offset="100%" :stop-color="currentTheme.primary" stop-opacity="0" />
        </linearGradient>
        <filter id="techGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <path
        d="M 0 35 L 30 10 L 60 35 L 30 60 Z"
        :fill="currentTheme.glow"
        :stroke="currentTheme.primary"
        stroke-width="1"
        filter="url(#techGlow)"
        class="deco-left"
      />
      
      <line
        x1="70" y1="35" x2="330" y2="35"
        :stroke="currentTheme.primary"
        stroke-width="2"
        stroke-dasharray="5,3"
        filter="url(#techGlow)"
        class="center-line"
      />
      
      <path
        d="M 400 35 L 370 10 L 340 35 L 370 60 Z"
        :fill="currentTheme.glow"
        :stroke="currentTheme.primary"
        stroke-width="1"
        filter="url(#techGlow)"
        class="deco-right"
      />
    </svg>
    
    <div class="title-wrapper">
      <div class="icon-container">
        <svg viewBox="0 0 24 24" class="tech-icon" :style="{ color: currentTheme.primary }">
          <path
            fill="currentColor"
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          />
        </svg>
      </div>
      <div class="text-container">
        <h3 class="main-title" :style="{ color: currentTheme.primary }">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="sub-title" :style="{ color: currentTheme.secondary }">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tech-title-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 10, 30, 0.6);
  overflow: hidden;
}

.tech-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.deco-left,
.deco-right {
  animation: pulse 2s ease-in-out infinite;
}

.center-line {
  animation: flow 3s linear infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes flow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -80; }
}

.title-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-icon {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 0 6px currentColor);
}

.text-container {
  text-align: left;
}

.main-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 0 0 10px currentColor;
}

.sub-title {
  font-size: 12px;
  margin: 2px 0 0 0;
  letter-spacing: 1px;
}
</style>
