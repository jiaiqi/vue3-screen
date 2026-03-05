<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  width?: number | string
  height?: number | string
  fontSize?: number
  fontWeight?: number | string
  letterSpacing?: number
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  backgroundColor?: string
  textColor?: string
  subtitleColor?: string
  glowColor?: string
  glowIntensity?: number
  animationType?: 'none' | 'pulse' | 'glow' | 'slide'
}

const props = withDefaults(defineProps<Props>(), {
  title: '自定义标题',
  subtitle: '',
  width: '100%',
  height: 80,
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: 2,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#00ffff',
  backgroundColor: 'rgba(0, 20, 40, 0.8)',
  textColor: '#ffffff',
  subtitleColor: '#88ccff',
  glowColor: '#00ffff',
  glowIntensity: 0.6,
  animationType: 'none',
})

const boxStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  backgroundColor: props.backgroundColor,
  borderRadius: `${props.borderRadius}px`,
  border: `${props.borderWidth}px solid ${props.borderColor}`,
  boxShadow: `0 0 ${props.glowIntensity * 20}px ${props.glowColor}40`,
}))

const titleStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  fontWeight: String(props.fontWeight),
  letterSpacing: `${props.letterSpacing}px`,
  color: props.textColor,
  textShadow: `0 0 ${props.glowIntensity * 10}px ${props.glowColor}`,
}))

const subtitleStyle = computed(() => ({
  color: props.subtitleColor,
  letterSpacing: `${props.letterSpacing * 0.5}px`,
}))
</script>

<template>
  <div
    class="custom-title-box"
    :class="[`animation-${animationType}`]"
    :style="boxStyle"
  >
    <div
      class="bg-layer"
      :style="{
        background: `linear-gradient(135deg, transparent 40%, ${glowColor}15 50%, transparent 60%)`,
      }"
    />
    
    <div class="border-decorations">
      <div
        class="corner corner-tl"
        :style="{ borderColor: `${borderColor} ${borderColor} transparent transparent` }"
      />
      <div
        class="corner corner-tr"
        :style="{ borderColor: `${borderColor} transparent transparent ${borderColor}` }"
      />
      <div
        class="corner corner-bl"
        :style="{ borderColor: `transparent ${borderColor} ${borderColor} transparent` }"
      />
      <div
        class="corner corner-br"
        :style="{ borderColor: `transparent transparent ${borderColor} ${borderColor}` }"
      />
    </div>
    
    <div class="content-wrapper">
      <h3 class="main-title" :style="titleStyle">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="sub-title" :style="subtitleStyle">
        {{ subtitle }}
      </p>
    </div>
    
    <div v-if="animationType !== 'none'" class="animation-layer">
      <div
        v-if="animationType === 'pulse'"
        class="pulse-ring"
        :style="{ borderColor: glowColor }"
      />
      <div
        v-if="animationType === 'slide'"
        class="slide-line"
        :style="{ background: glowColor }"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-title-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.border-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-width: 2px;
  border-style: solid;
}

.corner-tl { top: 4px; left: 4px; }
.corner-tr { top: 4px; right: 4px; transform: rotate(90deg); }
.corner-bl { bottom: 4px; left: 4px; transform: rotate(-90deg); }
.corner-br { bottom: 4px; right: 4px; transform: rotate(180deg); }

.content-wrapper {
  position: relative;
  text-align: center;
  z-index: 2;
  padding: 16px 24px;
}

.main-title { margin: 0; }

.sub-title {
  font-size: 12px;
  margin: 6px 0 0 0;
}

.animation-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.animation-pulse .pulse-ring {
  position: absolute;
  inset: 10px;
  border: 1px solid;
  border-radius: inherit;
  animation: pulse-expand 2s ease-out infinite;
}

@keyframes pulse-expand {
  0% { transform: scale(0.95); opacity: 1; }
  100% { transform: scale(1.1); opacity: 0; }
}

.animation-glow {
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.animation-slide .slide-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  animation: slide-across 2s linear infinite;
}

@keyframes slide-across {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
