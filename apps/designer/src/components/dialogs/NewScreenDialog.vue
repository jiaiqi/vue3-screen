<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElButton, ElMessage } from 'element-plus'

const visible = defineModel<boolean>('visible')

const emit = defineEmits<{
  confirm: [name: string, width: number, height: number]
}>()

const screenName = ref('')
const presetSize = ref('1920x1080')
const customWidth = ref(1920)
const customHeight = ref(1080)

const presetOptions = [
  { label: '1920 x 1080 (Full HD)', value: '1920x1080' },
  { label: '2560 x 1440 (2K)', value: '2560x1440' },
  { label: '3840 x 2160 (4K)', value: '3840x2160' },
  { label: '自定义尺寸', value: 'custom' },
]

const isCustomSize = computed(() => presetSize.value === 'custom')

const currentWidth = computed(() => {
  if (isCustomSize.value) return customWidth.value
  return parseInt(presetSize.value.split('x')[0])
})

const currentHeight = computed(() => {
  if (isCustomSize.value) return customHeight.value
  return parseInt(presetSize.value.split('x')[1])
})

watch(visible, (val) => {
  if (val) {
    screenName.value = ''
    presetSize.value = '1920x1080'
    customWidth.value = 1920
    customHeight.value = 1080
  }
})

function handleConfirm() {
  if (!screenName.value.trim()) {
    ElMessage.warning('请输入大屏名称')
    return
  }

  if (isCustomSize.value) {
    if (customWidth.value < 100 || customWidth.value > 10000) {
      ElMessage.warning('宽度必须在 100-10000 之间')
      return
    }
    if (customHeight.value < 100 || customHeight.value > 10000) {
      ElMessage.warning('高度必须在 100-10000 之间')
      return
    }
  }

  emit('confirm', screenName.value.trim(), currentWidth.value, currentHeight.value)
  visible.value = false
}
</script>

<template>
  <ElDialog
    v-model="visible"
    title="新建大屏"
    width="480px"
    :close-on-click-modal="false"
  >
    <ElForm label-width="80px">
      <ElFormItem label="大屏名称" required>
        <ElInput
          v-model="screenName"
          placeholder="请输入大屏名称"
          maxlength="50"
          show-word-limit
        />
      </ElFormItem>

      <ElFormItem label="预设尺寸">
        <ElSelect v-model="presetSize" style="width: 100%">
          <ElOption
            v-for="option in presetOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </ElFormItem>

      <template v-if="isCustomSize">
        <ElFormItem label="宽度">
          <ElInputNumber
            v-model="customWidth"
            :min="100"
            :max="10000"
            :step="10"
            style="width: 100%"
          />
        </ElFormItem>

        <ElFormItem label="高度">
          <ElInputNumber
            v-model="customHeight"
            :min="100"
            :max="10000"
            :step="10"
            style="width: 100%"
          />
        </ElFormItem>
      </template>

      <ElFormItem v-else label="尺寸预览">
        <div class="text-text-secondary">
          {{ currentWidth }} x {{ currentHeight }} 像素
        </div>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" @click="handleConfirm">创建</ElButton>
    </template>
  </ElDialog>
</template>
