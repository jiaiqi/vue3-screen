<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  width?: number | string
  height?: number | string
  theme?: 'royal' | 'cyber' | 'crystal'
}

const props = withDefaults(defineProps<Props>(), {
  title: '装饰标题',
  subtitle: '',
  width: '100%',
  height: 85,
  theme: 'royal',
})

const themeConfigs = {
  royal: {
    primary: '#ffd700',
    secondary: '#b8860b',
    bg: 'linear-gradient(135deg, rgba(30, 20, 50, 0.9), rgba(50, 30, 80, 0.9))',
    textColor: '#ffd700',
    glow: 'rgba(255, 215, 0, 0.4)',
  },
  cyber: {
    primary: '#ff0080',
    secondary: '#00ffff',
    bg: 'linear-gradient(135deg, rgba(20, 0, 40, 0.9), rgba(40, 0, 60, 0.9))',
    textColor: '#ff0080',
    glow: 'rgba(255, 0, 128, 0.4)',
  },
  crystal: {
    primary: '#e0e0ff',
    secondary: '#8080ff',
    bg: 'linear-gradient(135deg, rgba(40, 40, 80, 0.9), rgba(60, 60, 100, 0.9))',
    textColor: '#e0e0ff',
    glow: 'rgba(224, 224, 255, 0.3)',
  },
}

const currentTheme = computed(() => themeConfigs[props.theme])
</script>

<template>
  <div
    class="deco-title-box"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      background: currentTheme.bg,
    }"
  >
    <svg class="corner-deco top-left" viewBox="0 0 50 50">
      <path d="M 0 50 L 0 0 L 50 0" :stroke="currentTheme.primary" stroke-width="2" fill="none" />
      <circle cx="0" cy="0" r="4" :fill="currentTheme.primary" />
    </svg>
    
    <svg class="corner-deco top-right" viewBox="0 0 50 50">
      <path d="M 0 0 L 50 0 L 50 50" :stroke="currentTheme.primary" stroke-width="2" fill="none" />
      <circle cx="50" cy="0" r="4" :fill="currentTheme.primary" />
    </svg>
    
    <svg class="corner-deco bottom-left" viewBox="0 0 50 50">
      <path d="M 0 0 L 0 50 L 50 50" :stroke="currentTheme.primary" stroke-width="2" fill="none" />
      <circle cx="0" cy="50" r="4" :fill="currentTheme.primary" />
    </svg>
    
    <svg class="corner-deco bottom-right" viewBox="0 0 50 50">
      <path d="M 50 0 L 50 50 L 0 50" :stroke="currentTheme.primary" stroke-width="2" fill="none" />
      <circle cx="50" cy="50" r="4" :fill="currentTheme.primary" />
    </svg>
    
    <div class="side-deco left" :style="{ background: currentTheme.secondary }" />
    <div class="side-deco right" :style="{ background: currentTheme.secondary }" />
    
    <div class="title-content">
      <div class="deco-icon">
        <svg viewBox="0 0 40 40" :style="{ color: currentTheme.primary }">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="currentColor" stroke-width="2" />
          <polygon points="20,8 32,20 20,32 8,20" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <h3 class="main-title" :style="{ color: currentTheme.textColor }">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="sub-title" :style="{ color: currentTheme.secondary }">
        {{ subtitle }}
      </p>
      <div class="deco-icon">
        <svg viewBox="0 0 40 40" :style="{ color: currentTheme.primary }">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="currentColor" stroke-width="2" />
          <polygon points="20,8 32,20 20,32 8,20" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
    </div>
    
    <div class="glow-effect" :style="{ background: currentTheme.glow }" />
  </div>
</template>

<style scoped>
.deco-title-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}

.corner-deco {
  position: absolute;
  width: 30px;
  height: 30px;
  filter: drop-shadow(0 0 4px currentColor);
}

.top-left { top: 0; left: 0; }
.top-right { top: 0; right: 0; }
.bottom-left { bottom: 0; left: 0; }
.bottom-right { bottom: 0; right: 0; }

.side-deco {
  position: absolute;
  width: 2px;
  height: 60%;
  top: 20%;
}

.side-deco.left { left: 8px; }
.side-deco.right { right: 8px; }

.title-content {
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 2;
}

.deco-icon svg {
  width: 28px;
  height: 28px;
  animation: rotate 8s linear infinite;
}

.deco-icon:last-child svg {
  animation-direction: reverse;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.main-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 0 0 15px currentColor;
}

.sub-title {
  font-size: 12px;
  margin: 4px 0 0 0;
  letter-spacing: 1px;
}

.glow-effect {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: float-glow 4s ease-in-out infinite;
}

@keyframes float-glow {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
}
</style>
