<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElIcon, ElButton, ElTooltip } from 'element-plus'
import { ArrowLeft, ArrowRight, Grid } from '@element-plus/icons-vue'
import { useDesignerStore } from '@/stores/designer'
import { useCanvasStore } from '@/stores/canvas'
import { useKeyboard } from '@/composables/useKeyboard'
import TopToolbar from '@/components/toolbar/TopToolbar.vue'
import MaterialPanel from '@/components/panels/MaterialPanel.vue'
import RightPanel from '@/components/panels/RightPanel.vue'
import CanvasWithRuler from '@/components/canvas/CanvasWithRuler.vue'

const designerStore = useDesignerStore()
const canvasStore = useCanvasStore()

useKeyboard()

const materialPanelCollapsed = computed(() => designerStore.panelState.material.collapsed)
const rightPanelCollapsed = computed(() => designerStore.panelState.right.collapsed)

const materialPanelWidth = computed(() => 
  materialPanelCollapsed.value ? 48 : designerStore.panelState.material.width
)
const rightPanelWidth = computed(() => 
  rightPanelCollapsed.value ? 48 : designerStore.panelState.right.width
)

const canvasContainerRef = ref<HTMLElement | null>(null)

function toggleMaterialPanel() {
  designerStore.togglePanel('material')
}

function handleFitToScreen() {
  if (canvasContainerRef.value) {
    const rect = canvasContainerRef.value.getBoundingClientRect()
    canvasStore.fitToScreen(rect.width, rect.height)
  }
}
</script>

<template>
  <div class="designer-container flex h-screen flex-col overflow-hidden bg-canvas-bg">
    <TopToolbar />

    <div class="main-content flex flex-1 overflow-hidden">
      <aside
        class="material-panel-container relative flex flex-col border-r border-border bg-surface transition-all duration-300"
        :style="{ width: `${materialPanelWidth}px` }"
      >
        <div
          v-if="!materialPanelCollapsed"
          class="flex-1 overflow-hidden"
        >
          <MaterialPanel />
        </div>

        <div
          v-else
          class="collapsed-content flex flex-col items-center gap-4 py-4"
        >
          <ElTooltip content="物料库" placement="right">
            <ElButton link @click="toggleMaterialPanel">
              <ElIcon :size="20"><Grid /></ElIcon>
            </ElButton>
          </ElTooltip>
        </div>

        <div
          class="collapse-trigger absolute right-0 top-1/2 z-10 flex h-8 w-4 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-r bg-surface-elevated hover:bg-surface-overlay"
          @click="toggleMaterialPanel"
        >
          <ElIcon :size="12">
            <ArrowLeft v-if="!materialPanelCollapsed" />
            <ArrowRight v-else />
          </ElIcon>
        </div>
      </aside>

      <div ref="canvasContainerRef" class="canvas-area flex flex-1 overflow-hidden bg-canvas-bg">
        <CanvasWithRuler />
      </div>

      <RightPanel />
    </div>
  </div>
</template>

<style scoped>
.designer-container {
  position: relative;
}

.designer-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid transparent;
  background: linear-gradient(var(--color-canvas-bg), var(--color-canvas-bg)) padding-box,
              linear-gradient(135deg, 
                var(--color-primary-500) 0%, 
                transparent 30%, 
                transparent 70%, 
                var(--color-primary-500) 100%
              ) border-box;
  pointer-events: none;
  opacity: 0.3;
}

.material-panel-container {
  position: relative;
}

.material-panel-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: linear-gradient(180deg, 
    var(--color-primary-500) 0%, 
    transparent 50%, 
    var(--color-primary-500) 100%
  );
  opacity: 0.2;
}

.collapse-trigger {
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.material-panel-container:hover .collapse-trigger {
  opacity: 1;
}

.collapsed-content {
  color: var(--color-text-secondary);
}
</style>
