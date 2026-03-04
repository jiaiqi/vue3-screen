<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElSwitch, ElButton, ElTabs, ElTabPane, ElMessage } from 'element-plus'
import { useDesignerStore } from '@/stores/designer'
import { usePublishStore } from '@/stores/publish'

const visible = defineModel<boolean>('visible')

const designerStore = useDesignerStore()
const publishStore = usePublishStore()

const activeTab = ref('config')
const password = ref('')
const expireDays = ref(0)
const embedEnabled = ref(true)
const shareEnabled = ref(true)

const isPublishing = computed(() => publishStore.isPublishing)

async function handlePublish() {
  try {
    const version = await publishStore.publish(designerStore.schema, {
      password: password.value || undefined,
      expireAt: expireDays.value > 0 
        ? new Date(Date.now() + expireDays.value * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      embedEnabled: embedEnabled.value,
      shareEnabled: shareEnabled.value,
    })

    ElMessage.success(`发布成功！版本: ${version.version}`)
    activeTab.value = 'result'
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '发布失败')
  }
}

const viewUrl = computed(() => {
  if (!publishStore.currentVersion) return ''
  return publishStore.generateUrl(publishStore.currentVersion, 'view')
})

const embedCode = computed(() => {
  if (!publishStore.currentVersion) return ''
  return publishStore.generateEmbedCode(publishStore.currentVersion)
})

const sdkCode = computed(() => {
  if (!publishStore.currentVersion) return ''
  return publishStore.generateSdkCode(publishStore.currentVersion)
})

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  ElMessage.success('已复制到剪贴板')
}

function openPreview() {
  if (viewUrl.value) {
    window.open(viewUrl.value, '_blank')
  }
}
</script>

<template>
  <ElDialog
    v-model="visible"
    title="发布大屏"
    width="600px"
    :close-on-click-modal="false"
  >
    <ElTabs v-model="activeTab">
      <ElTabPane label="发布配置" name="config">
        <ElForm label-width="100px">
          <ElFormItem label="访问密码">
            <ElInput
              v-model="password"
              type="password"
              placeholder="留空则无需密码"
              show-password
            />
          </ElFormItem>

          <ElFormItem label="有效期">
            <ElInput
              v-model.number="expireDays"
              type="number"
              placeholder="留空则永久有效"
            >
              <template #append>天</template>
            </ElInput>
          </ElFormItem>

          <ElFormItem label="允许嵌入">
            <ElSwitch v-model="embedEnabled" />
          </ElFormItem>

          <ElFormItem label="允许分享">
            <ElSwitch v-model="shareEnabled" />
          </ElFormItem>
        </ElForm>
      </ElTabPane>

      <ElTabPane label="发布结果" name="result" :disabled="!publishStore.currentVersion">
        <div class="space-y-4">
          <div>
            <div class="mb-2 text-sm text-text-secondary">预览链接</div>
            <div class="flex gap-2">
              <ElInput :model-value="viewUrl" readonly />
              <ElButton @click="copyToClipboard(viewUrl)">复制</ElButton>
              <ElButton type="primary" @click="openPreview">打开</ElButton>
            </div>
          </div>

          <div>
            <div class="mb-2 text-sm text-text-secondary">嵌入代码</div>
            <ElInput
              :model-value="embedCode"
              type="textarea"
              :rows="3"
              readonly
            />
            <ElButton class="mt-2" @click="copyToClipboard(embedCode)">复制嵌入代码</ElButton>
          </div>

          <div>
            <div class="mb-2 text-sm text-text-secondary">SDK 代码</div>
            <ElInput
              :model-value="sdkCode"
              type="textarea"
              :rows="4"
              readonly
            />
            <ElButton class="mt-2" @click="copyToClipboard(sdkCode)">复制 SDK 代码</ElButton>
          </div>
        </div>
      </ElTabPane>
    </ElTabs>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton
        v-if="activeTab === 'config'"
        type="primary"
        :loading="isPublishing"
        @click="handlePublish"
      >
        发布
      </ElButton>
    </template>
  </ElDialog>
</template>
