<script setup lang="ts">
import { computed } from 'vue'
import { ElIcon, ElButton, ElEmpty } from 'element-plus'
import { Lightning, Plus, Setting, Connection, Clock } from '@element-plus/icons-vue'
import { useSelectionStore } from '@/stores/selection'
import { useDesignerStore } from '@/stores/designer'

const selectionStore = useSelectionStore()
const designerStore = useDesignerStore()

const selectedNode = computed(() => {
  const ids = Array.from(selectionStore.selectedIds)
  return ids.length === 1 ? ids[0] : null
})

const selectedNodeData = computed(() => {
  if (!selectedNode.value) return null
  return designerStore.getNodeById(selectedNode.value)
})

const hasSelection = computed(() => selectionStore.hasSelection)

const plannedFeatures = [
  { icon: Setting, label: '属性变更事件', desc: '组件属性变化时触发' },
  { icon: Lightning, label: '点击事件', desc: '组件被点击时触发' },
  { icon: Connection, label: '数据联动', desc: '与其他组件数据联动' },
  { icon: Clock, label: '定时刷新', desc: '定时刷新数据源' },
]
</script>

<template>
  <div class="event-panel tech-panel flex h-full flex-col">
    <div class="header border-b border-border p-4">
      <h3 class="title flex items-center gap-2">
        <ElIcon><Lightning /></ElIcon>
        事件绑定
      </h3>
      <p class="header-desc">
        配置组件的交互事件和数据联动
      </p>
    </div>

    <div v-if="hasSelection && selectedNodeData" class="flex-1 overflow-auto p-4">
      <div class="event-list space-y-3">
        <div
          v-for="feature in plannedFeatures"
          :key="feature.label"
          class="event-item"
        >
          <div class="flex items-center gap-3">
            <div class="event-icon">
              <ElIcon><component :is="feature.icon" /></ElIcon>
            </div>
            <div class="flex-1">
              <p class="event-label">{{ feature.label }}</p>
              <p class="event-desc">{{ feature.desc }}</p>
            </div>
            <ElButton size="small" disabled>
              <ElIcon><Plus /></ElIcon>
              添加
            </ElButton>
          </div>
        </div>
      </div>

      <div class="coming-soon mt-6">
        <ElEmpty
          description="事件系统开发中"
          :image-size="80"
        >
          <template #image>
            <ElIcon :size="48" class="text-text-muted opacity-30">
              <Lightning />
            </ElIcon>
          </template>
          <p class="text-sm text-text-muted mt-2">
            即将支持组件事件绑定、数据联动等功能
          </p>
        </ElEmpty>
      </div>
    </div>

    <div v-else class="empty-state flex flex-1 flex-col items-center justify-center">
      <ElIcon :size="48" class="empty-icon">
        <Lightning />
      </ElIcon>
      <p class="empty-text">在画布中选择组件以配置事件</p>
      <p class="empty-hint">支持点击、数据联动等事件类型</p>
    </div>
  </div>
</template>

<style scoped>
.event-panel {
  --el-bg-color: var(--color-bg-surface);
  background: var(--color-bg-surface);
}

.event-panel .header {
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

.header-desc {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.event-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.event-item:hover {
  border-color: var(--color-border-light);
  background: rgba(0, 212, 255, 0.05);
}

.event-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(0, 212, 255, 0.15);
  color: var(--color-primary);
}

.event-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.event-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.event-panel .empty-state {
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

.coming-soon :deep(.el-empty__description) {
  color: var(--color-text-muted);
}
</style>
