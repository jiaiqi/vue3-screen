<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { ElIcon, ElButton, ElTooltip } from 'element-plus'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Grid } from '@element-plus/icons-vue'
import { useDesignerStore } from '@/stores/designer'
import { useCanvasStore } from '@/stores/canvas'
import { useKeyboard } from '@/composables/useKeyboard'
import TopToolbar from '@/components/toolbar/TopToolbar.vue'
import MaterialPanel from '@/components/panels/MaterialPanel.vue'
import PropsPanel from '@/components/panels/PropsPanel.vue'
import LayerPanel from '@/components/panels/LayerPanel.vue'
import Canvas from '@/components/canvas/Canvas.vue'

const designerStore = useDesignerStore()
const canvasStore = useCanvasStore()

useKeyboard()

const materialPanelCollapsed = computed(() => designerStore.panelState.material.collapsed)
const propsPanelCollapsed = computed(() => designerStore.panelState.props.collapsed)
const layerPanelCollapsed = computed(() => designerStore.panelState.layer.collapsed)

const materialPanelWidth = computed(() => 
  materialPanelCollapsed.value ? 48 : designerStore.panelState.material.width
)
const propsPanelWidth = computed(() => 
  propsPanelCollapsed.value ? 48 : designerStore.panelState.props.width
)
const layerPanelHeight = computed(() => 
  layerPanelCollapsed.value ? 40 : designerStore.panelState.layer.height
)

const canvasContainerRef = ref<HTMLElement | null>(null)

function toggleMaterialPanel() {
  designerStore.togglePanel('material')
}

function togglePropsPanel() {
  designerStore.togglePanel('props')
}

function toggleLayerPanel() {
  designerStore.togglePanel('layer')
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

      <div class="canvas-area flex flex-1 flex-col overflow-hidden">
        <div
          ref="canvasContainerRef"
          class="canvas-wrapper relative flex-1 overflow-hidden bg-canvas-bg"
        >
          <Canvas>
            <div class="flex h-full w-full items-center justify-center text-text-muted">
              <p>画布内容区域 - 拖拽组件到此处</p>
            </div>
          </Canvas>
        </div>

        <div
          class="layer-panel-container relative border-t border-border bg-surface transition-all duration-300"
          :style="{ height: `${layerPanelHeight}px` }"
        >
          <div
            v-if="!layerPanelCollapsed"
            class="h-full overflow-hidden"
          >
            <LayerPanel />
          </div>

          <div
            v-else
            class="flex h-full items-center justify-center"
          >
            <span class="text-sm text-text-secondary">图层</span>
          </div>

          <div
            class="collapse-trigger absolute left-1/2 top-0 z-10 flex h-4 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-t bg-surface-elevated hover:bg-surface-overlay"
            @click="toggleLayerPanel"
          >
            <ElIcon :size="12">
              <ArrowDown v-if="!layerPanelCollapsed" />
              <ArrowUp v-else />
            </ElIcon>
          </div>
        </div>
      </div>

      <aside
        class="props-panel-container relative flex flex-col border-l border-border bg-surface transition-all duration-300"
        :style="{ width: `${propsPanelWidth}px` }"
      >
        <div
          v-if="!propsPanelCollapsed"
          class="flex-1 overflow-hidden"
        >
          <PropsPanel />
        </div>

        <div
          v-else
          class="collapsed-content flex flex-col items-center gap-4 py-4"
        >
          <ElTooltip content="属性配置" placement="left">
            <ElButton link @click="togglePropsPanel">
              <ElIcon :size="20"><Grid /></ElIcon>
            </ElButton>
          </ElTooltip>
        </div>

        <div
          class="collapse-trigger absolute left-0 top-1/2 z-10 flex h-8 w-4 -translate-y-1/2 -translate-x-1/2 cursor-pointer items-center justify-center rounded-l bg-surface-elevated hover:bg-surface-overlay"
          @click="togglePropsPanel"
        >
          <ElIcon :size="12">
            <ArrowRight v-if="!propsPanelCollapsed" />
            <ArrowLeft v-else />
          </ElIcon>
        </div>
      </aside>
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

.material-panel-container,
.props-panel-container {
  position: relative;
}

.material-panel-container::after,
.props-panel-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, 
    var(--color-primary-500) 0%, 
    transparent 50%, 
    var(--color-primary-500) 100%
  );
  opacity: 0.2;
}

.material-panel-container::after {
  right: 0;
}

.props-panel-container::after {
  left: 0;
}

.layer-panel-container::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, 
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

.material-panel-container:hover .collapse-trigger,
.props-panel-container:hover .collapse-trigger,
.layer-panel-container:hover .collapse-trigger {
  opacity: 1;
}

.collapsed-content {
  color: var(--color-text-secondary);
}
</style>
