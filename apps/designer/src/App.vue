<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

useDark()
</script>

<template>
  <div class="app-container h-screen w-screen overflow-hidden bg-canvas-bg text-text-primary">
    <RouterView />
  </div>
</template>
