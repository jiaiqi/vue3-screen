<script setup lang="ts">
import { computed } from 'vue'
import { ElTabs, ElTabPane, ElIcon, ElTooltip } from 'element-plus'
import { EditPen, Rank, Lightning, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useDesignerStore, type TabType } from '@/stores/designer'
import PropsPanel from './PropsPanel.vue'
import LayerPanel from './LayerPanel.vue'
import EventPanel from './EventPanel.vue'

const designerStore = useDesignerStore()

const activeTab = computed({
  get: () => designerStore.panelState.right.activeTab,
  set: (val: TabType) => designerStore.setActiveTab(val),
})

const isCollapsed = computed(() => designerStore.panelState.right.collapsed)
const panelWidth = computed(() => isCollapsed.value ? 48 : designerStore.panelState.right.width)

function togglePanel() {
  designerStore.togglePanel('right')
}

const tabs: { name: TabType; label: string; icon: any }[] = [
  { name: 'props', label: '属性', icon: EditPen },
  { name: 'layer', label: '图层', icon: Rank },
  { name: 'event', label: '事件', icon: Lightning },
]
</script>

<template>
  <aside
    class="right-panel-container relative flex flex-col border-l border-border bg-surface transition-all duration-300"
    :style="{ width: `${panelWidth}px` }"
  >
    <template v-if="!isCollapsed">
      <ElTabs
        v-model="activeTab"
        class="right-tabs h-full"
      >
        <ElTabPane
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
        >
          <template #label>
            <span class="flex items-center gap-1.5">
              <ElIcon><component :is="tab.icon" /></ElIcon>
              {{ tab.label }}
            </span>
          </template>

          <PropsPanel v-if="tab.name === 'props'" />
          <LayerPanel v-else-if="tab.name === 'layer'" />
          <EventPanel v-else-if="tab.name === 'event'" />
        </ElTabPane>
      </ElTabs>
    </template>

    <template v-else>
      <div class="collapsed-content flex flex-col items-center gap-4 py-4">
        <ElTooltip
          v-for="tab in tabs"
          :key="tab.name"
          :content="tab.label"
          placement="left"
        >
          <button
            class="tab-icon-btn"
            :class="{ active: activeTab === tab.name }"
            @click="activeTab = tab.name; togglePanel()"
          >
            <ElIcon :size="20"><component :is="tab.icon" /></ElIcon>
          </button>
        </ElTooltip>
      </div>
    </template>

    <div
      class="collapse-trigger absolute left-0 top-1/2 z-10 flex h-8 w-4 -translate-y-1/2 -translate-x-1/2 cursor-pointer items-center justify-center rounded-l bg-surface-elevated hover:bg-surface-overlay"
      @click="togglePanel"
    >
      <ElIcon :size="12">
        <ArrowRight v-if="isCollapsed" />
        <ArrowLeft v-else />
      </ElIcon>
    </div>
  </aside>
</template>

<style scoped>
.right-panel-container {
  position: relative;
}

.right-panel-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
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

.right-panel-container:hover .collapse-trigger {
  opacity: 1;
}

.collapsed-content {
  color: var(--color-text-secondary);
}

.tab-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-icon-btn:hover {
  background: rgba(0, 212, 255, 0.1);
  color: var(--color-primary);
}

.tab-icon-btn.active {
  background: rgba(0, 212, 255, 0.15);
  color: var(--color-primary);
}

.right-tabs {
  --el-bg-color: var(--color-bg-surface);
}

.right-tabs :deep(.el-tabs__header) {
  margin: 0;
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-border);
}

.right-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.right-tabs :deep(.el-tabs__nav-scroll) {
  padding: 0 8px;
}

.right-tabs :deep(.el-tabs__item) {
  height: 48px;
  line-height: 48px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 0 16px;
}

.right-tabs :deep(.el-tabs__item.is-active) {
  color: var(--color-primary);
}

.right-tabs :deep(.el-tabs__active-bar) {
  background-color: var(--color-primary);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  height: 2px;
}

.right-tabs :deep(.el-tabs__content) {
  height: calc(100% - 49px);
  overflow: hidden;
}

.right-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.right-tabs :deep(.el-tabs__item):hover {
  color: var(--color-text-primary);
}
</style>
