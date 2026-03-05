<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import { useDesignerStore } from '@/stores/designer'
import { ElTabs, ElTabPane, ElIcon } from 'element-plus'
import { EditPen, Brush, Connection, Setting } from '@element-plus/icons-vue'
import PropsForm from './PropsForm.vue'
import StyleForm from './StyleForm.vue'
import DataBindingForm from './DataBindingForm.vue'

const selectionStore = useSelectionStore()
const designerStore = useDesignerStore()

const activeTab = ref('props')

const selectedNode = computed(() => {
  const ids = Array.from(selectionStore.selectedIds)
  return ids.length === 1 ? ids[0] : null
})

const hasSelection = computed(() => selectionStore.hasSelection)

const selectedNodeData = computed(() => {
  if (!selectedNode.value) return null
  return designerStore.getNodeById(selectedNode.value)
})

const nodeInfo = computed(() => {
  if (!selectedNodeData.value) return null
  const node = selectedNodeData.value
  return {
    id: node.id,
    label: node.label,
    type: node.type || node.graphType || 'unknown',
    nodeKind: node.nodeKind,
  }
})
</script>

<template>
  <div class="props-panel tech-panel flex h-full flex-col">
    <div class="header border-b border-border p-4">
      <h3 class="title flex items-center gap-2">
        <ElIcon><EditPen /></ElIcon>
        属性配置
      </h3>
      <div v-if="nodeInfo" class="mt-2 space-y-1">
        <p class="info-row">
          <span class="info-label">名称：</span>{{ nodeInfo.label }}
        </p>
        <p class="info-row">
          <span class="info-label">类型：</span>
          <span class="type-badge">
            {{ nodeInfo.type }}
          </span>
        </p>
      </div>
    </div>

    <div v-if="hasSelection && selectedNode" class="flex-1 overflow-hidden">
      <ElTabs v-model="activeTab" class="props-tabs h-full">
        <ElTabPane name="props">
          <template #label>
            <span class="flex items-center gap-1.5">
              <ElIcon><Setting /></ElIcon>
              属性
            </span>
          </template>
          <PropsForm :node-id="selectedNode" />
        </ElTabPane>
        <ElTabPane name="style">
          <template #label>
            <span class="flex items-center gap-1.5">
              <ElIcon><Brush /></ElIcon>
              样式
            </span>
          </template>
          <StyleForm :node-id="selectedNode" />
        </ElTabPane>
        <ElTabPane name="data">
          <template #label>
            <span class="flex items-center gap-1.5">
              <ElIcon><Connection /></ElIcon>
              数据
            </span>
          </template>
          <DataBindingForm :node-id="selectedNode" />
        </ElTabPane>
      </ElTabs>
    </div>

    <div v-else class="empty-state flex flex-1 flex-col items-center justify-center">
      <ElIcon :size="48" class="empty-icon">
        <Setting />
      </ElIcon>
      <p class="empty-text">在画布中选择组件以编辑属性</p>
      <p class="empty-hint">支持单选或多选操作</p>
    </div>
  </div>
</template>

<style scoped>
.props-panel {
  --el-bg-color: var(--color-bg-surface);
  background: var(--color-bg-surface);
}

.props-panel .header {
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.05) 0%, transparent 100%);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 16px;
  background: var(--gradient-primary);
  border-radius: 2px;
  margin-right: 8px;
}

.info-row {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.info-label {
  color: var(--color-text-muted);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  background: rgba(0, 212, 255, 0.15);
  color: var(--color-primary);
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.props-panel .empty-state {
  background: radial-gradient(ellipse at center, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
}

.empty-icon {
  color: var(--color-text-muted);
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-muted);
}

.empty-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  opacity: 0.6;
  margin-top: 4px;
}

.props-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 16px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--color-border);
}

.props-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.props-tabs :deep(.el-tabs__item) {
  height: 40px;
  line-height: 40px;
  color: var(--color-text-secondary);
  font-size: 13px;
  transition: all 0.2s ease;
}

.props-tabs :deep(.el-tabs__item.is-active) {
  color: var(--color-primary);
}

.props-tabs :deep(.el-tabs__active-bar) {
  background-color: var(--color-primary);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.props-tabs :deep(.el-tabs__content) {
  height: calc(100% - 41px);
  overflow-y: auto;
}

.props-tabs :deep(.el-tab-pane) {
  padding: 16px;
}

.props-tabs :deep(.el-tabs__item):hover {
  color: var(--color-text-primary);
}
</style>
