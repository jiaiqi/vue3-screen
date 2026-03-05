<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  width?: number | string
  height?: number | string
  theme?: 'matrix' | 'circuit' | 'data'
}

const props = withDefaults(defineProps<Props>(), {
  title: '组合标题',
  subtitle: '',
  width: '100%',
  height: 100,
  theme: 'matrix',
})

const themeConfigs = {
  matrix: {
    primary: '#00ff41',
    secondary: '#008f11',
    bg: 'rgba(0, 20, 0, 0.8)',
    accent: '#00ff41',
  },
  circuit: {
    primary: '#00d4ff',
    secondary: '#0099cc',
    bg: 'rgba(0, 30, 50, 0.8)',
    accent: '#00d4ff',
  },
  data: {
    primary: '#ff9500',
    secondary: '#cc7700',
    bg: 'rgba(30, 20, 0, 0.8)',
    accent: '#ff9500',
  },
}

const currentTheme = computed(() => themeConfigs[props.theme])
</script>

<template>
  <div
    class="combo-title-box"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      background: currentTheme.bg,
    }"
  >
    <div class="top-bar" :style="{ background: currentTheme.primary }">
      <div class="bar-pattern">
        <span v-for="i in 20" :key="i" class="pattern-dot" />
      </div>
    </div>
    
    <div class="left-deco">
      <div class="deco-line" :style="{ background: currentTheme.secondary }" />
      <div class="deco-dot" :style="{ background: currentTheme.primary }" />
    </div>
    
    <div class="main-content">
      <div class="title-row">
        <span class="title-prefix" :style="{ color: currentTheme.accent }">///</span>
        <h3 class="main-title" :style="{ color: currentTheme.primary }">
          {{ title }}
        </h3>
        <span class="title-suffix" :style="{ color: currentTheme.accent }">///</span>
      </div>
      <div v-if="subtitle" class="subtitle-row">
        <div class="subtitle-line" :style="{ background: currentTheme.secondary }" />
        <p class="sub-title" :style="{ color: currentTheme.secondary }">
          {{ subtitle }}
        </p>
        <div class="subtitle-line" :style="{ background: currentTheme.secondary }" />
      </div>
    </div>
    
    <div class="right-deco">
      <div class="deco-dot" :style="{ background: currentTheme.primary }" />
      <div class="deco-line" :style="{ background: currentTheme.secondary }" />
    </div>
    
    <div class="bottom-bar" :style="{ background: currentTheme.primary }">
      <div class="bar-pattern">
        <span v-for="i in 20" :key="i" class="pattern-dot" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.combo-title-box {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
}

.top-bar,
.bottom-bar {
  height: 4px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.bar-pattern {
  display: flex;
  gap: 8px;
  animation: scroll 10s linear infinite;
}

.pattern-dot {
  width: 4px;
  height: 4px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-240px); }
}

.left-deco,
.right-deco {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
}

.left-deco { left: 12px; }
.right-deco { right: 12px; flex-direction: row-reverse; }

.deco-line { width: 20px; height: 2px; }

.deco-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 60px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-prefix,
.title-suffix {
  font-family: monospace;
  font-size: 14px;
  opacity: 0.6;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 0 0 10px currentColor;
}

.subtitle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.subtitle-line { width: 30px; height: 1px; }

.sub-title {
  font-size: 12px;
  margin: 0;
  letter-spacing: 2px;
}
</style>
