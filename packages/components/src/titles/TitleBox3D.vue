<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  width?: number | string
  height?: number | string
  theme?: 'steel' | 'gold' | 'chrome'
}

const props = withDefaults(defineProps<Props>(), {
  title: '3D标题',
  subtitle: '',
  width: '100%',
  height: 90,
  theme: 'steel',
})

const themeStyles = {
  steel: {
    bg: 'linear-gradient(145deg, #2d3436, #636e72)',
    textColor: '#dfe6e9',
    subtitleColor: '#b2bec3',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  gold: {
    bg: 'linear-gradient(145deg, #f39c12, #e67e22)',
    textColor: '#ffffff',
    subtitleColor: 'rgba(255, 255, 255, 0.85)',
    shadow: '0 10px 30px rgba(243, 156, 18, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  chrome: {
    bg: 'linear-gradient(145deg, #bdc3c7, #2c3e50)',
    textColor: '#ecf0f1',
    subtitleColor: '#95a5a6',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
}

const currentTheme = computed(() => themeStyles[props.theme])
</script>

<template>
  <div
    class="title-box-3d"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      background: currentTheme.bg,
      boxShadow: currentTheme.shadow,
      border: currentTheme.border,
    }"
  >
    <div class="inner-layer">
      <div class="title-content">
        <h3 class="main-title" :style="{ color: currentTheme.textColor }">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="sub-title" :style="{ color: currentTheme.subtitleColor }">
          {{ subtitle }}
        </p>
      </div>
    </div>
    <div class="depth-layer depth-1" />
    <div class="depth-layer depth-2" />
    <div class="depth-layer depth-3" />
  </div>
</template>

<style scoped>
.title-box-3d {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transform: perspective(500px) rotateX(2deg);
  transform-style: preserve-3d;
}

.inner-layer {
  position: relative;
  z-index: 4;
  padding: 16px 32px;
}

.title-content {
  text-align: center;
}

.main-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.3),
    0 -1px 0 rgba(0, 0, 0, 0.2);
}

.sub-title {
  font-size: 13px;
  margin: 6px 0 0 0;
  letter-spacing: 1px;
}

.depth-layer {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  pointer-events: none;
}

.depth-1 {
  background: rgba(0, 0, 0, 0.15);
  transform: translateZ(-10px) translateY(4px);
  z-index: 3;
}

.depth-2 {
  background: rgba(0, 0, 0, 0.1);
  transform: translateZ(-20px) translateY(8px);
  z-index: 2;
}

.depth-3 {
  background: rgba(0, 0, 0, 0.05);
  transform: translateZ(-30px) translateY(12px);
  z-index: 1;
}
</style>
