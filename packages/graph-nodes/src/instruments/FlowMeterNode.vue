<script setup lang="ts">
interface Props {
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 80,
})
</script>

<template>
  <div :style="{ width: `${size}px`, height: `${size * 0.5}px` }">
    <svg viewBox="0 0 100 50" class="h-full w-full">
      <rect
        x="5"
        y="5"
        width="90"
        height="40"
        rx="5"
        stroke="currentColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
      <ellipse
        cx="50"
        cy="25"
        rx="20"
        ry="15"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" stroke-width="1" />
      <line x1="35" y1="25" x2="65" y2="25" stroke="currentColor" stroke-width="1" />
    </svg>
  </div>
</template>
