<script setup lang="ts">
import { computed, watch } from 'vue'
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElSwitch, ElSelect, ElOption, ElColorPicker, ElSlider } from 'element-plus'
import { useDesignerStore } from '@/stores/designer'

interface Props {
  nodeId: string | null
}

const props = defineProps<Props>()

const designerStore = useDesignerStore()

const node = computed(() => {
  if (!props.nodeId) return null
  return designerStore.getNodeById(props.nodeId)
})

const nodeProps = computed(() => node.value?.props || {})

function updateProp(key: string, value: unknown) {
  if (props.nodeId) {
    designerStore.updateNodeProp(props.nodeId, key, value)
  }
}
</script>

<template>
  <div class="props-form">
    <ElForm label-position="top" size="small">
      <ElFormItem label="名称">
        <ElInput
          :model-value="node?.label"
          @update:model-value="updateProp('label', $event)"
          placeholder="组件名称"
        />
      </ElFormItem>

      <ElFormItem label="宽度">
        <ElInputNumber
          :model-value="node?.layout?.w"
          @update:model-value="updateProp('width', $event)"
          :min="10"
          :max="2000"
          controls-position="right"
        />
      </ElFormItem>

      <ElFormItem label="高度">
        <ElInputNumber
          :model-value="node?.layout?.h"
          @update:model-value="updateProp('height', $event)"
          :min="10"
          :max="2000"
          controls-position="right"
        />
      </ElFormItem>

      <ElFormItem label="X 坐标">
        <ElInputNumber
          :model-value="node?.layout?.x"
          @update:model-value="updateProp('x', $event)"
          controls-position="right"
        />
      </ElFormItem>

      <ElFormItem label="Y 坐标">
        <ElInputNumber
          :model-value="node?.layout?.y"
          @update:model-value="updateProp('y', $event)"
          controls-position="right"
        />
      </ElFormItem>

      <ElFormItem label="锁定">
        <ElSwitch
          :model-value="node?.locked"
          @update:model-value="updateProp('locked', $event)"
        />
      </ElFormItem>

      <ElFormItem label="可见">
        <ElSwitch
          :model-value="node?.visible !== false"
          @update:model-value="updateProp('visible', $event)"
        />
      </ElFormItem>
    </ElForm>
  </div>
</template>
