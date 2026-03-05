<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElInput,
  ElInputNumber,
  ElButton,
  ElDialog,
  ElIcon,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElEmpty,
  ElTag,
  ElSwitch,
  ElMessage,
} from 'element-plus'
import {
  Connection,
  Refresh,
  DataLine,
  Setting,
  View,
  Plus,
  Delete,
  Edit,
} from '@element-plus/icons-vue'
import { useDesignerStore } from '@/stores/designer'
import { useDataStore } from '@/stores/data'

interface Props {
  nodeId: string | null
}

const props = defineProps<Props>()

const designerStore = useDesignerStore()
const dataStore = useDataStore()

const node = computed(() => {
  if (!props.nodeId) return null
  return designerStore.getNodeById(props.nodeId)
})

const dataBinding = computed(() => node.value?.dataBinding || {})

const dataSources = computed(() => dataStore.dataSources)

const showFilterDialog = ref(false)
const filterCode = ref('')
const showPreview = ref(false)
const previewData = ref<unknown>(null)
const previewLoading = ref(false)

const fieldMappings = computed({
  get: () => {
    const mapping = dataBinding.value.fieldMapping || {}
    return Object.entries(mapping).map(([field, path]) => ({ field, path }))
  },
  set: (val: { field: string; path: string }[]) => {
    const mapping: Record<string, string> = {}
    val.forEach(item => {
      if (item.field && item.path) {
        mapping[item.field] = item.path
      }
    })
    updateBinding('fieldMapping', mapping)
  },
})

function updateBinding(key: string, value: unknown) {
  if (props.nodeId) {
    designerStore.updateDataBinding(props.nodeId, key, value)
  }
}

function openFilterDialog() {
  filterCode.value = dataBinding.value.filterCode || ''
  showFilterDialog.value = true
}

function saveFilter() {
  updateBinding('filterCode', filterCode.value)
  showFilterDialog.value = false
  ElMessage.success('过滤器已保存')
}

function addFieldMapping() {
  const current = [...fieldMappings.value, { field: '', path: '' }]
  fieldMappings.value = current
}

function removeFieldMapping(index: number) {
  const current = [...fieldMappings.value]
  current.splice(index, 1)
  fieldMappings.value = current
}

function updateFieldMapping(index: number, key: 'field' | 'path', value: string) {
  const current = [...fieldMappings.value]
  current[index] = { ...current[index], [key]: value }
  fieldMappings.value = current
}

async function fetchPreview() {
  if (!dataBinding.value.dataSourceId) {
    ElMessage.warning('请先选择数据源')
    return
  }
  
  previewLoading.value = true
  showPreview.value = true
  
  try {
    const data = await dataStore.fetchData(dataBinding.value.dataSourceId)
    previewData.value = data
  } catch (error) {
    ElMessage.error('数据获取失败')
    previewData.value = null
  } finally {
    previewLoading.value = false
  }
}

const refreshOptions = [
  { label: '不刷新', value: 0 },
  { label: '5 秒', value: 5 },
  { label: '10 秒', value: 10 },
  { label: '30 秒', value: 30 },
  { label: '1 分钟', value: 60 },
  { label: '5 分钟', value: 300 },
]

function formatPreviewData(data: unknown): string {
  if (data === null || data === undefined) return 'null'
  return JSON.stringify(data, null, 2)
}
</script>

<template>
  <div class="data-binding-form">
    <ElForm label-position="top" size="small">
      <div class="section-title flex items-center gap-2 mb-3 text-text-secondary">
        <ElIcon><Connection /></ElIcon>
        <span class="text-xs font-medium uppercase tracking-wider">数据源配置</span>
      </div>

      <ElFormItem label="数据源">
        <ElSelect
          :model-value="dataBinding.dataSourceId"
          @update:model-value="updateBinding('dataSourceId', $event)"
          placeholder="选择数据源"
          clearable
          filterable
        >
          <ElOption
            v-for="ds in dataSources"
            :key="ds.id"
            :label="ds.name"
            :value="ds.id"
          >
            <div class="flex items-center justify-between">
              <span>{{ ds.name }}</span>
              <ElTag size="small" type="info">{{ ds.type }}</ElTag>
            </div>
          </ElOption>
        </ElSelect>
      </ElFormItem>

      <ElFormItem v-if="dataSources.length === 0">
        <ElEmpty description="暂无数据源" :image-size="60">
          <ElButton type="primary" size="small">添加数据源</ElButton>
        </ElEmpty>
      </ElFormItem>

      <ElFormItem label="JSONPath">
        <ElInput
          :model-value="dataBinding.jsonPath"
          @update:model-value="updateBinding('jsonPath', $event)"
          placeholder="$.data[*]"
          clearable
        >
          <template #prepend>$</template>
        </ElInput>
        <div class="mt-1 text-xs text-text-muted">
          使用 JSONPath 提取数据，例如：$.data.items
        </div>
      </ElFormItem>

      <ElDivider />

      <div class="section-title flex items-center gap-2 mb-3 text-text-secondary">
        <ElIcon><Refresh /></ElIcon>
        <span class="text-xs font-medium uppercase tracking-wider">刷新配置</span>
      </div>

      <ElFormItem label="自动刷新">
        <ElSwitch
          :model-value="dataBinding.autoRefresh !== false"
          @update:model-value="updateBinding('autoRefresh', $event)"
          active-text="开启"
          inactive-text="关闭"
        />
      </ElFormItem>

      <ElFormItem label="刷新间隔">
        <ElSelect
          :model-value="dataBinding.refreshInterval || 0"
          @update:model-value="updateBinding('refreshInterval', $event)"
          :disabled="dataBinding.autoRefresh === false"
        >
          <ElOption
            v-for="opt in refreshOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElDivider />

      <div class="section-title flex items-center gap-2 mb-3 text-text-secondary">
        <ElIcon><DataLine /></ElIcon>
        <span class="text-xs font-medium uppercase tracking-wider">字段映射</span>
      </div>

      <div class="field-mappings mb-3">
        <div
          v-for="(mapping, index) in fieldMappings"
          :key="index"
          class="field-mapping-item flex items-center gap-2 mb-2"
        >
          <ElInput
            :model-value="mapping.field"
            @update:model-value="updateFieldMapping(index, 'field', $event)"
            placeholder="字段名"
            size="small"
            class="flex-1"
          />
          <ElInput
            :model-value="mapping.path"
            @update:model-value="updateFieldMapping(index, 'path', $event)"
            placeholder="数据路径"
            size="small"
            class="flex-1"
          />
          <ElButton
            link
            size="small"
            type="danger"
            @click="removeFieldMapping(index)"
          >
            <ElIcon><Delete /></ElIcon>
          </ElButton>
        </div>
        
        <ElButton
          size="small"
          type="primary"
          link
          @click="addFieldMapping"
        >
          <ElIcon class="mr-1"><Plus /></ElIcon>
          添加映射
        </ElButton>
      </div>

      <ElDivider />

      <div class="section-title flex items-center gap-2 mb-3 text-text-secondary">
        <ElIcon><Setting /></ElIcon>
        <span class="text-xs font-medium uppercase tracking-wider">数据处理</span>
      </div>

      <ElFormItem label="数据过滤器">
        <ElButton @click="openFilterDialog" size="small">
          <ElIcon class="mr-1"><Edit /></ElIcon>
          {{ dataBinding.filterCode ? '编辑过滤器' : '添加过滤器' }}
        </ElButton>
        <div v-if="dataBinding.filterCode" class="mt-2 text-xs text-text-muted">
          已配置过滤器
        </div>
      </ElFormItem>

      <ElDivider />

      <div class="section-title flex items-center gap-2 mb-3 text-text-secondary">
        <ElIcon><View /></ElIcon>
        <span class="text-xs font-medium uppercase tracking-wider">数据预览</span>
      </div>

      <ElFormItem>
        <ElButton
          @click="fetchPreview"
          size="small"
          :loading="previewLoading"
          :disabled="!dataBinding.dataSourceId"
        >
          <ElIcon class="mr-1"><View /></ElIcon>
          预览数据
        </ElButton>
      </ElFormItem>

      <div
        v-if="showPreview && previewData !== null"
        class="preview-area bg-black/20 rounded p-3 text-xs font-mono text-text-secondary overflow-auto max-h-48"
      >
        <pre>{{ formatPreviewData(previewData) }}</pre>
      </div>
    </ElForm>

    <ElDialog
      v-model="showFilterDialog"
      title="数据过滤器"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="mb-3 text-sm text-text-secondary">
        编写 JavaScript 函数处理数据。可用参数：
      </div>
      <div class="mb-3 text-xs text-text-muted bg-black/20 p-2 rounded">
        <code>function filter(data, params, { $dayjs, $_ }) { return data; }</code>
      </div>
      <ElInput
        v-model="filterCode"
        type="textarea"
        :rows="12"
        placeholder="function filter(data, params, { $dayjs, $_ }) {
  // 处理数据
  return data;
}"
        class="filter-editor"
      />
      <template #footer>
        <ElButton @click="showFilterDialog = false">取消</ElButton>
        <ElButton type="primary" @click="saveFilter">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.data-binding-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.data-binding-form :deep(.el-form-item__label) {
  font-size: 12px;
  color: var(--color-text-secondary);
  padding-bottom: 4px;
}

.data-binding-form :deep(.el-select) {
  width: 100%;
}

.data-binding-form :deep(.el-divider) {
  margin: 16px 0;
  border-color: var(--color-border);
}

.section-title {
  opacity: 0.7;
}

.field-mapping-item {
  background: rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 4px;
}

.preview-area {
  border: 1px solid var(--color-border);
}

.preview-area pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.filter-editor :deep(.el-textarea__inner) {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
  background: rgba(0, 0, 0, 0.2);
}
</style>
