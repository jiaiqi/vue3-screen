<script setup lang="ts">
import { computed } from 'vue'
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElColorPicker, ElSlider, ElSelect, ElOption } from 'element-plus'
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

const nodeStyle = computed(() => node.value?.style || {})

function updateStyle(key: string, value: unknown) {
  if (props.nodeId) {
    designerStore.updateNodeStyle(props.nodeId, key, value)
  }
}

const borderStyles = ['none', 'solid', 'dashed', 'dotted', 'double']
</script>

<template>
  <div class="style-form">
    <ElForm label-position="top" size="small">
      <ElFormItem label="背景色">
        <ElColorPicker
          :model-value="nodeStyle.background"
          @update:model-value="updateStyle('background', $event)"
          show-alpha
        />
      </ElFormItem>

      <ElFormItem label="边框">
        <div class="flex gap-2">
          <ElColorPicker
            :model-value="nodeStyle.borderColor"
            @update:model-value="updateStyle('borderColor', $event)"
            show-alpha
          />
          <ElInputNumber
            :model-value="nodeStyle.borderWidth || 1"
            @update:model-value="updateStyle('borderWidth', $event)"
            :min="0"
            :max="20"
            controls-position="right"
          />
          <ElSelect
            :model-value="nodeStyle.borderStyle || 'solid'"
            @update:model-value="updateStyle('borderStyle', $event)"
          >
            <ElOption
              v-for="style in borderStyles"
              :key="style"
              :label="style"
              :value="style"
            />
          </ElSelect>
        </div>
      </ElFormItem>

      <ElFormItem label="圆角">
        <ElSlider
          :model-value="nodeStyle.borderRadius || 0"
          @update:model-value="updateStyle('borderRadius', $event)"
          :min="0"
          :max="100"
        />
      </ElFormItem>

      <ElFormItem label="透明度">
        <ElSlider
          :model-value="(nodeStyle.opacity ?? 1) * 100"
          @update:model-value="updateStyle('opacity', $event / 100)"
          :min="0"
          :max="100"
        />
      </ElFormItem>

      <ElFormItem label="旋转角度">
        <ElInputNumber
          :model-value="node?.layout?.rotate || 0"
          @update:model-value="updateStyle('rotate', $event)"
          :min="-360"
          :max="360"
          controls-position="right"
        />
      </ElFormItem>

      <ElFormItem label="阴影">
        <ElSelect
          :model-value="nodeStyle.shadow || 'none'"
          @update:model-value="updateStyle('shadow', $event)"
        >
          <ElOption label="无" value="none" />
          <ElOption label="小" value="sm" />
          <ElOption label="中" value="md" />
          <ElOption label="大" value="lg" />
          <ElOption label="发光" value="glow" />
        </ElSelect>
      </ElFormItem>
    </ElForm>
  </div>
</template>
