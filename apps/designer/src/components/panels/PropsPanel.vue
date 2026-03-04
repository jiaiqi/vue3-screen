<script setup lang="ts">
import { computed } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import { ElTabs, ElTabPane } from 'element-plus'
import PropsForm from './PropsForm.vue'
import StyleForm from './StyleForm.vue'
import DataBindingForm from './DataBindingForm.vue'

const selectionStore = useSelectionStore()

const selectedNode = computed(() => {
  const ids = Array.from(selectionStore.selectedIds)
  return ids.length === 1 ? ids[0] : null
})

const hasSelection = computed(() => selectionStore.hasSelection)
</script>

<template>
  <div class="props-panel flex h-full flex-col bg-surface">
    <div class="border-b border-border p-4">
      <h3 class="text-lg font-semibold text-text-primary">
        {{ hasSelection ? '属性配置' : '请选择组件' }}
      </h3>
      <p v-if="selectedNode" class="mt-1 text-sm text-text-secondary">
        ID: {{ selectedNode }}
      </p>
    </div>

    <div v-if="hasSelection" class="flex-1 overflow-hidden">
      <ElTabs class="h-full">
        <ElTabPane label="属性" name="props">
          <PropsForm :node-id="selectedNode" />
        </ElTabPane>
        <ElTabPane label="样式" name="style">
          <StyleForm :node-id="selectedNode" />
        </ElTabPane>
        <ElTabPane label="数据" name="data">
          <DataBindingForm :node-id="selectedNode" />
        </ElTabPane>
      </ElTabs>
    </div>

    <div v-else class="flex flex-1 items-center justify-center text-text-muted">
      <p>在画布中选择组件以编辑属性</p>
    </div>
  </div>
</template>

<style scoped>
.props-panel :deep(.el-tabs__content) {
  height: calc(100% - 40px);
  overflow-y: auto;
}

.props-panel :deep(.el-tab-pane) {
  padding: 16px;
}
</style>
