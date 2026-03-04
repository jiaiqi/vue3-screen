<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElInputNumber, ElButton, ElDialog } from 'element-plus'
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
}
</script>

<template>
  <div class="data-binding-form">
    <ElForm label-position="top" size="small">
      <ElFormItem label="数据源">
        <ElSelect
          :model-value="dataBinding.dataSourceId"
          @update:model-value="updateBinding('dataSourceId', $event)"
          placeholder="选择数据源"
          clearable
        >
          <ElOption
            v-for="ds in dataSources"
            :key="ds.id"
            :label="ds.name"
            :value="ds.id"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="JSONPath">
        <ElInput
          :model-value="dataBinding.jsonPath"
          @update:model-value="updateBinding('jsonPath', $event)"
          placeholder="$.data[*]"
        />
      </ElFormItem>

      <ElFormItem label="刷新间隔 (秒)">
        <ElInputNumber
          :model-value="dataBinding.refreshInterval || 0"
          @update:model-value="updateBinding('refreshInterval', $event)"
          :min="0"
          :max="3600"
          controls-position="right"
        />
        <span class="ml-2 text-xs text-text-muted">0 表示不自动刷新</span>
      </ElFormItem>

      <ElFormItem label="数据过滤器">
        <ElButton @click="openFilterDialog" size="small">
          {{ dataBinding.filterCode ? '编辑过滤器' : '添加过滤器' }}
        </ElButton>
      </ElFormItem>
    </ElForm>

    <ElDialog v-model="showFilterDialog" title="数据过滤器" width="600px">
      <div class="mb-2 text-sm text-text-secondary">
        编写 JavaScript 函数处理数据。可用参数：data, params, $dayjs, $_
      </div>
      <ElInput
        v-model="filterCode"
        type="textarea"
        :rows="10"
        placeholder="function filter(data, params, { $dayjs, $_ }) { return data; }"
      />
      <template #footer>
        <ElButton @click="showFilterDialog = false">取消</ElButton>
        <ElButton type="primary" @click="saveFilter">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>
