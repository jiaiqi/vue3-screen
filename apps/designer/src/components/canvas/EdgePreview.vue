<script setup lang="ts">
import { computed } from 'vue'

export interface EdgePreviewProps {
  path: string
  isValid: boolean
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
}

const props = defineProps<EdgePreviewProps>()

const strokeColor = computed(() => {
  return props.isValid ? '#10b981' : '#ef4444'
})

const glowColor = computed(() => {
  return props.isValid ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'
})

const arrowMarkerId = computed(() => {
  return `arrow-${props.isValid ? 'valid' : 'invalid'}-${Date.now()}`
})
</script>

<template>
  <svg
    class="edge-preview absolute inset-0 pointer-events-none overflow-visible"
    :style="{
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }"
  >
    <defs>
      <marker
        :id="arrowMarkerId"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d="M0,0 L0,6 L9,3 z"
          :fill="strokeColor"
        />
      </marker>
    </defs>

    <path
      :d="path"
      fill="none"
      :stroke="strokeColor"
      stroke-width="2"
      stroke-dasharray="5,5"
      :stroke-linecap="'round'"
      :marker-end="`url(#${arrowMarkerId})`"
      :style="{
        filter: `drop-shadow(0 0 4px ${glowColor})`,
        animation: 'dashAnimation 0.5s linear infinite',
      }"
      class="edge-path"
    />

    <circle
      :cx="sourceX"
      :cy="sourceY"
      r="4"
      :fill="strokeColor"
      class="source-point"
    />

    <circle
      :cx="targetX"
      :cy="targetY"
      r="4"
      :fill="strokeColor"
      class="target-point"
    />

    <g
      :transform="`translate(${targetX + 10}, ${targetY - 10})`"
      class="status-indicator"
    >
      <rect
        x="0"
        y="-16"
        :fill="strokeColor"
        rx="3"
        ry="3"
        width="48"
        height="20"
        opacity="0.8"
      />
      <text
        x="24"
        y="-2"
        text-anchor="middle"
        fill="white"
        font-size="10"
        font-family="sans-serif"
      >
        {{ isValid ? '有效' : '无效' }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.edge-preview {
  z-index: 1000;
  overflow: visible;
}

.edge-path {
  transition: stroke 0.2s ease;
}

@keyframes dashAnimation {
  to {
    stroke-dashoffset: -10;
  }
}

.source-point,
.target-point {
  transition: all 0.2s ease;
}

.status-indicator {
  pointer-events: none;
  transition: all 0.2s ease;
}
</style>
