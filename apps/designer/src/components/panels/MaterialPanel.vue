<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElInput, ElCollapse, ElCollapseItem, ElIcon } from 'element-plus'
import type { CollapseModelValue } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import MaterialItem from './MaterialItem.vue'
import { 
  getAllComponents, 
  getComponentsByCategory,
  searchComponents,
} from '@screen/components'

const searchText = ref('')
const activeCollapse = ref<string[]>(['chart', 'data', 'decoration', 'container'])

const categoryConfig = [
  { 
    key: 'chart', 
    label: '图表类', 
    icon: 'i-carbon-chart-bar',
    gradient: 'from-blue-500 to-cyan-400'
  },
  { 
    key: 'data', 
    label: '数据类', 
    icon: 'i-carbon-data-vis-1',
    gradient: 'from-green-500 to-emerald-400'
  },
  { 
    key: 'decoration', 
    label: '装饰类', 
    icon: 'i-carbon-checkbox',
    gradient: 'from-purple-500 to-pink-400'
  },
  { 
    key: 'container', 
    label: '容器类', 
    icon: 'i-carbon-folder',
    gradient: 'from-orange-500 to-yellow-400'
  },
]

const filteredComponents = computed(() => {
  if (searchText.value) {
    return searchComponents(searchText.value)
  }
  return getAllComponents()
})

const getComponentsForCategory = (category: string) => {
  if (searchText.value) {
    return filteredComponents.value.filter(c => c.meta.category === category)
  }
  return getComponentsByCategory(category)
}

function handleCollapseChange(val: CollapseModelValue) {
  if (Array.isArray(val)) {
    activeCollapse.value = val.map(String)
  } else {
    activeCollapse.value = [String(val)]
  }
}
</script>

<template>
  <div class="material-panel tech-panel flex h-full flex-col">
    <div class="header border-b border-border p-4">
      <h3 class="title">物料库</h3>
    </div>

    <div class="p-3">
      <ElInput
        v-model="searchText"
        placeholder="搜索组件..."
        size="small"
        clearable
        class="search-input"
      >
        <template #prefix>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>
    </div>

    <div class="flex-1 overflow-y-auto px-2 pb-2">
      <ElCollapse 
        v-model="activeCollapse"
        class="category-collapse"
        @change="handleCollapseChange"
      >
        <ElCollapseItem
          v-for="category in categoryConfig"
          :key="category.key"
          :name="category.key"
        >
          <template #title>
            <div class="category-title flex items-center gap-2">
              <div 
                class="category-icon h-6 w-6 rounded flex items-center justify-center"
                :class="category.gradient"
              >
                <div :class="category.icon" class="h-4 w-4 text-white" />
              </div>
              <span class="category-label">{{ category.label }}</span>
              <span class="category-count">
                ({{ getComponentsForCategory(category.key).length }})
              </span>
            </div>
          </template>
          
          <div class="component-grid grid grid-cols-2 gap-2 p-1">
            <MaterialItem
              v-for="component in getComponentsForCategory(category.key)"
              :key="component.id"
              :component="component"
              :gradient="category.gradient"
            />
          </div>
        </ElCollapseItem>
      </ElCollapse>
    </div>
  </div>
</template>

<style scoped>
.material-panel {
  background: var(--color-bg-surface);
}

.header {
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.05) 0%, transparent 100%);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.title::before {
  content: '';
  width: 3px;
  height: 16px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.search-input :deep(.el-input__wrapper) {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  box-shadow: none;
  transition: all 0.2s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: var(--color-border-light);
}

.search-input :deep(.el-input__wrapper:focus-within) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.search-input :deep(.el-input__inner) {
  color: var(--color-text-primary);
}

.search-input :deep(.el-input__inner::placeholder) {
  color: var(--color-text-muted);
}

.category-collapse {
  border: none;
  background: transparent;
}

.category-collapse :deep(.el-collapse-item__header) {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0 12px;
  height: 40px;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.category-collapse :deep(.el-collapse-item__header:hover) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.category-collapse :deep(.el-collapse-item__wrap) {
  background: transparent;
  border: none;
}

.category-collapse :deep(.el-collapse-item__content) {
  padding: 8px 0;
}

.category-collapse :deep(.el-collapse-item__arrow) {
  color: var(--color-text-secondary);
}

.category-label {
  font-weight: 500;
  color: var(--color-text-primary);
}

.category-count {
  font-size: 12px;
  color: var(--color-text-muted);
}

.component-grid {
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
}
</style>
