<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElInput, ElTabs, ElTabPane, ElCollapse, ElCollapseItem, ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import MaterialItem from './MaterialItem.vue'
import { 
  getAllComponents, 
  getComponentsByCategory,
  searchComponents,
  componentCategories 
} from '@screen/components'

const searchText = ref('')
const activeTab = ref('all')

const categories = [
  { key: 'all', label: '全部', icon: 'i-carbon-apps' },
  { key: 'chart', label: '图表', icon: 'i-carbon-chart-bar' },
  { key: 'data', label: '数据', icon: 'i-carbon-data-vis-1' },
  { key: 'decoration', label: '装饰', icon: 'i-carbon-checkbox' },
  { key: 'container', label: '容器', icon: 'i-carbon-folder' },
  { key: 'media', label: '媒体', icon: 'i-carbon-video' },
]

const filteredComponents = computed(() => {
  if (searchText.value) {
    return searchComponents(searchText.value)
  }
  if (activeTab.value === 'all') {
    return getAllComponents()
  }
  return getComponentsByCategory(activeTab.value)
})

function handleDragStart(e: DragEvent, component: any) {
  if (!e.dataTransfer) return
  
  e.dataTransfer.setData('application/json', JSON.stringify({
    type: component.type,
    meta: component.meta,
  }))
  e.dataTransfer.effectAllowed = 'copy'
}
</script>

<template>
  <div class="material-panel flex h-full flex-col bg-surface">
    <div class="border-b border-border p-4">
      <h3 class="text-lg font-semibold text-text-primary">物料库</h3>
    </div>

    <div class="p-2">
      <ElInput
        v-model="searchText"
        placeholder="搜索组件..."
        size="small"
        clearable
      >
        <template #prefix>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>
    </div>

    <ElTabs v-model="activeTab" class="flex-1 overflow-hidden">
      <ElTabPane
        v-for="category in categories"
        :key="category.key"
        :label="category.label"
        :name="category.key"
      >
        <div class="component-grid grid grid-cols-2 gap-2 p-2">
          <MaterialItem
            v-for="component in filteredComponents"
            :key="component.id"
            :component="component"
            draggable="true"
            @dragstart="handleDragStart($event, component)"
          />
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped>
.material-panel :deep(.el-tabs__content) {
  height: calc(100% - 40px);
  overflow-y: auto;
}

.component-grid {
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
</style>
