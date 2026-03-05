<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  width?: number | string
  height?: number | string
  theme?: 'neon' | 'plasma' | 'quantum'
}

const props = withDefaults(defineProps<Props>(), {
  title: '悬浮标题',
  subtitle: '',
  width: '100%',
  height: 75,
  theme: 'neon',
})

const isHovered = ref(false)

const themeConfigs = {
  neon: {
    baseColor: '#00ffff',
    hoverColor: '#ff00ff',
    textColor: '#ffffff',
    glowColor: 'rgba(0, 255, 255, 0.6)',
  },
  plasma: {
    baseColor: '#ff6b6b',
    hoverColor: '#4ecdc4',
    textColor: '#ffffff',
    glowColor: 'rgba(255, 107, 107, 0.6)',
  },
  quantum: {
    baseColor: '#a29bfe',
    hoverColor: '#fd79a8',
    textColor: '#ffffff',
    glowColor: 'rgba(162, 155, 254, 0.6)',
  },
}

const currentTheme = computed(() => themeConfigs[props.theme])
</script>

<template>
  <div
    class="hover-title-box"
    :class="{ hovered: isHovered }"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="hover-bg"
      :style="{
        background: isHovered
          ? `linear-gradient(135deg, ${currentTheme.baseColor}, ${currentTheme.hoverColor})`
          : 'rgba(20, 30, 50, 0.8)',
        boxShadow: isHovered
          ? `0 20px 40px ${currentTheme.glowColor}, 0 0 60px ${currentTheme.glowColor}`
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
      }"
    />
    <div class="title-content">
      <h3
        class="main-title"
        :style="{
          color: isHovered ? currentTheme.textColor : currentTheme.baseColor,
          textShadow: isHovered ? `0 0 20px ${currentTheme.hoverColor}` : 'none',
        }"
      >
        {{ title }}
      </h3>
      <p
        v-if="subtitle"
        class="sub-title"
        :style="{ color: isHovered ? currentTheme.textColor : 'rgba(255, 255, 255, 0.6)' }"
      >
        {{ subtitle }}
      </p>
    </div>
    <div class="hover-particles">
      <span v-for="i in 6" :key="i" class="particle" />
    </div>
  </div>
</template>

<style scoped>
.hover-title-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.hover-title-box:hover {
  transform: translateY(-5px);
}

.hover-bg {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  transition: all 0.4s ease;
}

.title-content {
  position: relative;
  text-align: center;
  z-index: 2;
  transition: all 0.3s ease;
}

.main-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.sub-title {
  font-size: 12px;
  margin: 4px 0 0 0;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.hover-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  opacity: 0;
}

.hover-title-box.hovered .particle {
  animation: float 1.5s ease-in-out infinite;
}

.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 30%; animation-delay: 0.2s; }
.particle:nth-child(3) { left: 50%; animation-delay: 0.4s; }
.particle:nth-child(4) { left: 70%; animation-delay: 0.6s; }
.particle:nth-child(5) { left: 20%; animation-delay: 0.8s; }
.particle:nth-child(6) { left: 80%; animation-delay: 1s; }

@keyframes float {
  0% {
    transform: translateY(100%) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100%) scale(1);
    opacity: 0;
  }
}
</style>
