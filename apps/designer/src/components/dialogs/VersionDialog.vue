<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElDialog, ElTable, ElTableColumn, ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import { useDesignerStore } from '@/stores/designer'
import { usePublishStore, type PublishedVersion } from '@/stores/publish'

const visible = defineModel<boolean>('visible')

const designerStore = useDesignerStore()
const publishStore = usePublishStore()

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await publishStore.loadVersions(designerStore.schema.id)
  } catch (error) {
    ElMessage.error('加载版本列表失败')
  } finally {
    loading.value = false
  }
})

async function handleRollback(version: PublishedVersion) {
  try {
    await ElMessageBox.confirm(
      `确定要回滚到版本 ${version.version} 吗？这将创建一个新版本。`,
      '版本回滚',
      { type: 'warning' }
    )

    await publishStore.rollback(version.id)
    ElMessage.success('回滚成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('回滚失败')
    }
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN')
}
</script>

<template>
  <ElDialog
    v-model="visible"
    title="版本管理"
    width="800px"
  >
    <ElTable :data="publishStore.versions" v-loading="loading">
      <ElTableColumn prop="version" label="版本号" width="100">
        <template #default="{ row }">
          <ElTag>{{ row.version }}</ElTag>
        </template>
      </ElTableColumn>

      <ElTableColumn prop="publishedAt" label="发布时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.publishedAt) }}
        </template>
      </ElTableColumn>

      <ElTableColumn prop="publishedBy" label="发布人" width="120" />

      <ElTableColumn label="配置" min-width="200">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-1">
            <ElTag v-if="row.config.password" type="warning" size="small">密码保护</ElTag>
            <ElTag v-if="row.config.embedEnabled" type="success" size="small">可嵌入</ElTag>
            <ElTag v-if="row.config.expireAt" type="info" size="small">
              有效期至 {{ formatDate(row.config.expireAt) }}
            </ElTag>
          </div>
        </template>
      </ElTableColumn>

      <ElTableColumn label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <ElButton
            type="primary"
            link
            size="small"
            @click="handleRollback(row)"
          >
            回滚
          </ElButton>
          <ElButton
            type="primary"
            link
            size="small"
            @click="window.open(`/view?id=${row.id}`, '_blank')"
          >
            预览
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
  </ElDialog>
</template>
