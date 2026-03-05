<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElColorPicker,
  ElSlider,
  ElSelect,
  ElOption,
  ElDivider,
  ElIcon,
  ElCollapse,
  ElCollapseItem,
  ElRadioGroup,
  ElRadioButton,
} from 'element-plus'
import {
  Rank,
  Position,
  Brush,
  Grid,
  Sunny,
} from '@element-plus/icons-vue'
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

const activeCollapse = ref(['size', 'position', 'background', 'border', 'shadow'])

function updateStyle(key: string, value: unknown) {
  if (props.nodeId) {
    designerStore.updateNodeStyle(props.nodeId, key, value)
  }
}

function updateLayout(key: string, value: unknown) {
  if (props.nodeId) {
    designerStore.updateNodeProp(props.nodeId, key, value)
  }
}

const borderStyles = [
  { label: '无', value: 'none' },
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
  { label: '点线', value: 'dotted' },
  { label: '双线', value: 'double' },
]

const shadowPresets = [
  { label: '无', value: 'none' },
  { label: '小', value: '0 1px 3px rgba(0,0,0,0.12)' },
  { label: '中', value: '0 4px 6px rgba(0,0,0,0.15)' },
  { label: '大', value: '0 10px 15px rgba(0,0,0,0.2)' },
  { label: '发光', value: '0 0 20px rgba(59,130,246,0.5)' },
]

const bgType = ref<'color' | 'image' | 'gradient'>('color')

const gradientDirection = computed({
  get: () => nodeStyle.value.gradientDirection || 'to right',
  set: (val) => updateStyle('gradientDirection', val),
})

const gradientColors = computed({
  get: () => nodeStyle.value.gradientColors || ['#0073ff', '#00d4ff'],
  set: (val) => updateStyle('gradientColors', val),
})
</script>

<template>
  <div class="style-form">
    <ElCollapse v-model="activeCollapse" class="style-collapse">
      <ElCollapseItem name="size">
        <template #title>
          <div class="collapse-title flex items-center gap-2">
            <ElIcon><Rank /></ElIcon>
            <span>尺寸</span>
          </div>
        </template>
        <ElForm label-position="top" size="small">
          <div class="grid grid-cols-2 gap-3">
            <ElFormItem label="宽度">
              <ElInputNumber
                :model-value="node?.layout?.w"
                @update:model-value="updateLayout('width', $event)"
                :min="10"
                :max="4000"
                controls-position="right"
              />
            </ElFormItem>
            <ElFormItem label="高度">
              <ElInputNumber
                :model-value="node?.layout?.h"
                @update:model-value="updateLayout('height', $event)"
                :min="10"
                :max="4000"
                controls-position="right"
              />
            </ElFormItem>
          </div>
        </ElForm>
      </ElCollapseItem>

      <ElCollapseItem name="position">
        <template #title>
          <div class="collapse-title flex items-center gap-2">
            <ElIcon><Position /></ElIcon>
            <span>位置</span>
          </div>
        </template>
        <ElForm label-position="top" size="small">
          <div class="grid grid-cols-2 gap-3">
            <ElFormItem label="X 坐标">
              <ElInputNumber
                :model-value="node?.layout?.x"
                @update:model-value="updateLayout('x', $event)"
                controls-position="right"
              />
            </ElFormItem>
            <ElFormItem label="Y 坐标">
              <ElInputNumber
                :model-value="node?.layout?.y"
                @update:model-value="updateLayout('y', $event)"
                controls-position="right"
              />
            </ElFormItem>
          </div>
          <ElFormItem label="旋转角度">
            <ElSlider
              :model-value="node?.layout?.rotate || 0"
              @update:model-value="updateStyle('rotate', $event)"
              :min="-180"
              :max="180"
              :step="1"
              show-input
              :show-input-controls="false"
            />
          </ElFormItem>
        </ElForm>
      </ElCollapseItem>

      <ElCollapseItem name="background">
        <template #title>
          <div class="collapse-title flex items-center gap-2">
            <ElIcon><Brush /></ElIcon>
            <span>背景</span>
          </div>
        </template>
        <ElForm label-position="top" size="small">
          <ElFormItem label="背景类型">
            <ElRadioGroup v-model="bgType" size="small">
              <ElRadioButton value="color">纯色</ElRadioButton>
              <ElRadioButton value="image">图片</ElRadioButton>
              <ElRadioButton value="gradient">渐变</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>

          <template v-if="bgType === 'color'">
            <ElFormItem label="背景颜色">
              <ElColorPicker
                :model-value="nodeStyle.background"
                @update:model-value="updateStyle('background', $event)"
                show-alpha
              />
            </ElFormItem>
          </template>

          <template v-else-if="bgType === 'image'">
            <ElFormItem label="图片地址">
              <ElInput
                :model-value="nodeStyle.backgroundImage"
                @update:model-value="updateStyle('backgroundImage', `url(${$event})`)"
                placeholder="输入图片 URL"
              />
            </ElFormItem>
            <ElFormItem label="背景尺寸">
              <ElSelect
                :model-value="nodeStyle.backgroundSize || 'cover'"
                @update:model-value="updateStyle('backgroundSize', $event)"
              >
                <ElOption label="覆盖" value="cover" />
                <ElOption label="包含" value="contain" />
                <ElOption label="自动" value="auto" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="背景位置">
              <ElSelect
                :model-value="nodeStyle.backgroundPosition || 'center'"
                @update:model-value="updateStyle('backgroundPosition', $event)"
              >
                <ElOption label="居中" value="center" />
                <ElOption label="顶部" value="top" />
                <ElOption label="底部" value="bottom" />
                <ElOption label="左侧" value="left" />
                <ElOption label="右侧" value="right" />
              </ElSelect>
            </ElFormItem>
          </template>

          <template v-else-if="bgType === 'gradient'">
            <ElFormItem label="渐变方向">
              <ElSelect
                :model-value="gradientDirection"
                @update:model-value="gradientDirection = $event"
              >
                <ElOption label="从左到右" value="to right" />
                <ElOption label="从上到下" value="to bottom" />
                <ElOption label="对角线(左上到右下)" value="to bottom right" />
                <ElOption label="对角线(右上到左下)" value="to bottom left" />
              </ElSelect>
            </ElFormItem>
            <div class="grid grid-cols-2 gap-3">
              <ElFormItem label="起始颜色">
                <ElColorPicker
                  :model-value="gradientColors[0]"
                  @update:model-value="gradientColors = [$event, gradientColors[1]]"
                  show-alpha
                />
              </ElFormItem>
              <ElFormItem label="结束颜色">
                <ElColorPicker
                  :model-value="gradientColors[1]"
                  @update:model-value="gradientColors = [gradientColors[0], $event]"
                  show-alpha
                />
              </ElFormItem>
            </div>
          </template>

          <ElFormItem label="透明度">
            <ElSlider
              :model-value="(nodeStyle.opacity ?? 1) * 100"
              @update:model-value="updateStyle('opacity', $event / 100)"
              :min="0"
              :max="100"
              :step="1"
            />
          </ElFormItem>
        </ElForm>
      </ElCollapseItem>

      <ElCollapseItem name="border">
        <template #title>
          <div class="collapse-title flex items-center gap-2">
            <ElIcon><Grid /></ElIcon>
            <span>边框</span>
          </div>
        </template>
        <ElForm label-position="top" size="small">
          <ElFormItem label="边框样式">
            <ElSelect
              :model-value="nodeStyle.borderStyle || 'none'"
              @update:model-value="updateStyle('borderStyle', $event)"
            >
              <ElOption
                v-for="style in borderStyles"
                :key="style.value"
                :label="style.label"
                :value="style.value"
              />
            </ElSelect>
          </ElFormItem>
          <div v-if="nodeStyle.borderStyle !== 'none'" class="grid grid-cols-2 gap-3">
            <ElFormItem label="边框颜色">
              <ElColorPicker
                :model-value="nodeStyle.borderColor"
                @update:model-value="updateStyle('borderColor', $event)"
                show-alpha
              />
            </ElFormItem>
            <ElFormItem label="边框宽度">
              <ElInputNumber
                :model-value="nodeStyle.borderWidth || 1"
                @update:model-value="updateStyle('borderWidth', $event)"
                :min="0"
                :max="50"
                controls-position="right"
              />
            </ElFormItem>
          </div>
          <ElFormItem label="圆角">
            <ElSlider
              :model-value="nodeStyle.borderRadius || 0"
              @update:model-value="updateStyle('borderRadius', $event)"
              :min="0"
              :max="100"
              :step="1"
            />
          </ElFormItem>
        </ElForm>
      </ElCollapseItem>

      <ElCollapseItem name="shadow">
        <template #title>
          <div class="collapse-title flex items-center gap-2">
            <ElIcon><Sunny /></ElIcon>
            <span>阴影</span>
          </div>
        </template>
        <ElForm label-position="top" size="small">
          <ElFormItem label="阴影预设">
            <ElSelect
              :model-value="nodeStyle.boxShadow || 'none'"
              @update:model-value="updateStyle('boxShadow', $event)"
            >
              <ElOption
                v-for="preset in shadowPresets"
                :key="preset.value"
                :label="preset.label"
                :value="preset.value"
              />
            </ElSelect>
          </ElFormItem>
          <template v-if="nodeStyle.boxShadow && nodeStyle.boxShadow !== 'none'">
            <div class="grid grid-cols-2 gap-3">
              <ElFormItem label="水平偏移">
                <ElInputNumber
                  :model-value="nodeStyle.shadowX || 0"
                  @update:model-value="updateStyle('shadowX', $event)"
                  :min="-100"
                  :max="100"
                  controls-position="right"
                />
              </ElFormItem>
              <ElFormItem label="垂直偏移">
                <ElInputNumber
                  :model-value="nodeStyle.shadowY || 0"
                  @update:model-value="updateStyle('shadowY', $event)"
                  :min="-100"
                  :max="100"
                  controls-position="right"
                />
              </ElFormItem>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <ElFormItem label="模糊半径">
                <ElInputNumber
                  :model-value="nodeStyle.shadowBlur || 10"
                  @update:model-value="updateStyle('shadowBlur', $event)"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
              </ElFormItem>
              <ElFormItem label="扩散半径">
                <ElInputNumber
                  :model-value="nodeStyle.shadowSpread || 0"
                  @update:model-value="updateStyle('shadowSpread', $event)"
                  :min="-50"
                  :max="50"
                  controls-position="right"
                />
              </ElFormItem>
            </div>
            <ElFormItem label="阴影颜色">
              <ElColorPicker
                :model-value="nodeStyle.shadowColor || 'rgba(0,0,0,0.15)'"
                @update:model-value="updateStyle('shadowColor', $event)"
                show-alpha
              />
            </ElFormItem>
          </template>
        </ElForm>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<style scoped>
.style-form :deep(.el-form-item) {
  margin-bottom: 12px;
}

.style-form :deep(.el-form-item__label) {
  font-size: 12px;
  color: var(--color-text-secondary);
  padding-bottom: 4px;
}

.style-form :deep(.el-input-number) {
  width: 100%;
}

.style-form :deep(.el-select) {
  width: 100%;
}

.style-form :deep(.el-color-picker) {
  width: 100%;
}

.style-form :deep(.el-color-picker__trigger) {
  width: 100%;
}

.style-collapse {
  --el-collapse-header-bg-color: transparent;
  --el-collapse-content-bg-color: transparent;
  border: none;
}

.style-collapse :deep(.el-collapse-item__header) {
  height: 36px;
  line-height: 36px;
  color: var(--color-text-primary);
  font-size: 13px;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
}

.style-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

.style-collapse :deep(.el-collapse-item__content) {
  padding: 12px 0;
}

.collapse-title {
  font-weight: 500;
}

.style-form :deep(.el-slider) {
  --el-slider-main-bg-color: var(--color-primary);
}

.style-form :deep(.el-radio-group) {
  width: 100%;
  display: flex;
}

.style-form :deep(.el-radio-button) {
  flex: 1;
}

.style-form :deep(.el-radio-button__inner) {
  width: 100%;
}
</style>
