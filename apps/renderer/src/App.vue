<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import ScreenRenderer from './components/ScreenRenderer.vue'
import type { ScreenSchema } from '@screen/core'

const containerRef = ref<HTMLElement | null>(null)
const containerSize = ref({ width: 0, height: 0 })

const schema = ref<ScreenSchema | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

useResizeObserver(containerRef, ([entry]) => {
  containerSize.value = {
    width: entry.contentRect.width,
    height: entry.contentRect.height,
  }
})

onMounted(async () => {
  const screenId = new URLSearchParams(window.location.search).get('id')
  const token = new URLSearchParams(window.location.search).get('token')

  if (!screenId) {
    error.value = '缺少屏幕 ID'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`/api/screens/${screenId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    schema.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div ref="containerRef" class="renderer-container h-screen w-screen overflow-hidden bg-canvas-bg">
    <div v-if="loading" class="flex h-full w-full items-center justify-center">
      <div class="text-text-secondary">加载中...</div>
    </div>

    <div v-else-if="error" class="flex h-full w-full items-center justify-center">
      <div class="text-error">{{ error }}</div>
    </div>

    <ScreenRenderer
      v-else-if="schema"
      :schema="schema"
      :container-width="containerSize.width"
      :container-height="containerSize.height"
    />
  </div>
</template>
