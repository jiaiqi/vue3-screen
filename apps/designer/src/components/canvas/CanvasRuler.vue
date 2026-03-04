<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useRuler } from '@/composables/useRuler'

const store = useCanvasStore()

const { marks: hMarks, rulerSize } = useRuler('horizontal')
const { marks: vMarks } = useRuler('vertical')

const hRulerStyle = computed(() => ({
  width: `${store.config.width * store.scale}px`,
  transform: `translateX(${store.offsetX}px)`,
}))

const vRulerStyle = computed(() => ({
  height: `${store.config.height * store.scale}px`,
  transform: `translateY(${store.offsetY}px)`,
}))
</script>

<template>
  <div class="rulers pointer-events-none absolute inset-0">
    <div
      class="ruler-h absolute top-0 left-5 z-50 h-5 bg-surface-elevated"
      :style="hRulerStyle"
    >
      <svg width="100%" height="20">
        <g v-for="mark in hMarks" :key="mark.value">
          <line
            :x1="mark.position"
            :x2="mark.position"
            :y1="mark.isMajor ? 0 : 10"
            :y2="20"
            stroke="var(--color-text-muted)"
            stroke-width="1"
          />
          <text
            v-if="mark.isMajor"
            :x="mark.position + 2"
            y="12"
            fill="var(--color-text-muted)"
            font-size="10"
          >
            {{ mark.value }}
          </text>
        </g>
      </svg>
    </div>

    <div
      class="ruler-v absolute left-0 top-5 z-50 w-5 bg-surface-elevated"
      :style="vRulerStyle"
    >
      <svg width="20" height="100%">
        <g v-for="mark in vMarks" :key="mark.value">
          <line
            :y1="mark.position"
            :y2="mark.position"
            :x1="mark.isMajor ? 0 : 10"
            :x2="20"
            stroke="var(--color-text-muted)"
            stroke-width="1"
          />
          <text
            v-if="mark.isMajor"
            :y="mark.position + 12"
            x="2"
            fill="var(--color-text-muted)"
            font-size="10"
            writing-mode="vertical-rl"
          >
            {{ mark.value }}
          </text>
        </g>
      </svg>
    </div>

    <div class="absolute left-0 top-0 z-50 h-5 w-5 bg-surface-elevated" />
  </div>
</template>
