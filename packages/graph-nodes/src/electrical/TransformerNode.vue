<script setup lang="ts">
interface Props {
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 80,
})
</script>

<template>
  <div :style="{ width: `${size}px`, height: `${size * 1.25}px` }">
    <svg viewBox="0 0 80 100" class="h-full w-full">
      <rect
        x="15"
        y="10"
        width="50"
        height="35"
        stroke="currentColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
      <rect
        x="15"
        y="55"
        width="50"
        height="35"
        stroke="currentColor"
        stroke-width="2"
        fill="var(--color-surface-elevated)"
      />
      <line x1="40" y1="5" x2="40" y2="10" stroke="currentColor" stroke-width="2" />
      <line x1="40" y1="45" x2="40" y2="55" stroke="currentColor" stroke-width="2" />
      <line x1="40" y1="90" x2="40" y2="95" stroke="currentColor" stroke-width="2" />
      <line x1="25" y1="20" x2="25" y2="35" stroke="currentColor" stroke-width="1" />
      <line x1="35" y1="20" x2="35" y2="35" stroke="currentColor" stroke-width="1" />
      <line x1="45" y1="20" x2="45" y2="35" stroke="currentColor" stroke-width="1" />
      <line x1="55" y1="20" x2="55" y2="35" stroke="currentColor" stroke-width="1" />
      <line x1="25" y1="65" x2="25" y2="80" stroke="currentColor" stroke-width="1" />
      <line x1="35" y1="65" x2="35" y2="80" stroke="currentColor" stroke-width="1" />
      <line x1="45" y1="65" x2="45" y2="80" stroke="currentColor" stroke-width="1" />
      <line x1="55" y1="65" x2="55" y2="80" stroke="currentColor" stroke-width="1" />
    </svg>
  </div>
</template>
