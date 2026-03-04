<script setup lang="ts">
import { ref } from 'vue'

const canvasWidth = ref(1920)
const canvasHeight = ref(1080)
const scale = ref(1)
</script>

<template>
  <div class="designer-layout flex h-full">
    <!-- 左侧物料面板 -->
    <aside class="w-64 flex-shrink-0 border-r border-border bg-surface">
      <div class="p-4">
        <h2 class="text-lg font-semibold text-text-primary">物料库</h2>
      </div>
    </aside>

    <!-- 中间画布区域 -->
    <main class="relative flex-1 overflow-hidden bg-canvas-bg">
      <div
        class="canvas-container absolute-center"
        :style="{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${scale})`,
        }"
      >
        <div class="h-full w-full border border-border bg-surface-elevated">
          <!-- 画布内容 -->
        </div>
      </div>
    </main>

    <!-- 右侧属性面板 -->
    <aside class="w-80 flex-shrink-0 border-l border-border bg-surface">
      <div class="p-4">
        <h2 class="text-lg font-semibold text-text-primary">属性配置</h2>
      </div>
    </aside>
  </div>
</template>
