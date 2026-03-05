<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElDescriptions, ElDescriptionsItem } from 'element-plus'
import type { ScreenSchema } from '@screen/core'

const visible = defineModel<boolean>('visible')

const props = defineProps<{
  schema: ScreenSchema | null
}>()

const emit = defineEmits<{
  confirm: [name: string]
}>()

const newName = ref('')

const originalName = computed(() => props.schema?.name || '')

const schemaInfo = computed(() => {
  if (!props.schema) return null

  const nodeCount = props.schema.pages.reduce((sum, page) => sum + page.nodes.length, 0)
  const graphNodeCount = props.schema.pages.reduce((sum, page) => sum + (page.graphNodes?.length || 0), 0)
  const edgeCount = props.schema.pages.reduce((sum, page) => sum + (page.edges?.length || 0), 0)

  return {
    id: props.schema.id,
    version: props.schema.version,
    canvasSize: `${props.schema.canvas.width} x ${props.schema.canvas.height}`,
    nodeCount,
    graphNodeCount,
    edgeCount,
    dataSourceCount: props.schema.dataSources.length,
    pageCount: props.schema.pages.length,
  }
})

watch(visible, (val) => {
  if (val && props.schema) {
    newName.value = `${props.schema.name} 副本`
  }
})

function handleConfirm() {
  if (!newName.value.trim()) {
    ElMessage.warning('请输入新名称')
    return
  }

  emit('confirm', newName.value.trim())
  visible.value = false
}
</script>

<template>
  <ElDialog
    v-model="visible"
    title="另存为"
    width="500px"
    :close-on-click-modal="false"
  >
    <ElForm label-width="80px">
      <ElFormItem label="新名称" required>
        <ElInput
          v-model="newName"
          placeholder="请输入新名称"
          maxlength="50"
          show-word-limit
        />
      </ElFormItem>

      <ElFormItem label="原名称">
        <div class="text-text-secondary">{{ originalName }}</div>
      </ElFormItem>

      <ElFormItem v-if="schemaInfo" label="Schema 信息">
        <ElDescriptions :column="2" border size="small">
          <ElDescriptionsItem label="版本">{{ schemaInfo.version }}</ElDescriptionsItem>
          <ElDescriptionsItem label="画布尺寸">{{ schemaInfo.canvasSize }}</ElDescriptionsItem>
          <ElDescriptionsItem label="组件数">{{ schemaInfo.nodeCount }}</ElDescriptionsItem>
          <ElDescriptionsItem label="图元数">{{ schemaInfo.graphNodeCount }}</ElDescriptionsItem>
          <ElDescriptionsItem label="连线数">{{ schemaInfo.edgeCount }}</ElDescriptionsItem>
          <ElDescriptionsItem label="数据源">{{ schemaInfo.dataSourceCount }}</ElDescriptionsItem>
        </ElDescriptions>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" @click="handleConfirm">保存</ElButton>
    </template>
  </ElDialog>
</template>
