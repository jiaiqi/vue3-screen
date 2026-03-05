<script setup lang="ts">
import { computed, h } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSwitch,
  ElSelect,
  ElOption,
  ElColorPicker,
  ElSlider,
  ElDivider,
  ElIcon,
} from 'element-plus'
import { Setting, Lock, View } from '@element-plus/icons-vue'
import { useDesignerStore } from '@/stores/designer'
import { getComponent } from '@screen/components'
import type { JSONSchema7 } from 'json-schema'
import type { ComponentNode, GraphNodeSchema } from '@screen/core'

interface Props {
  nodeId: string | null
}

const props = defineProps<Props>()

const designerStore = useDesignerStore()

const node = computed(() => {
  if (!props.nodeId) return null
  return designerStore.getNodeById(props.nodeId)
})

const componentMeta = computed(() => {
  if (!node.value || node.value.nodeKind === 'graph') return null
  const instance = getComponent(node.value.type)
  return instance?.meta || null
})

const propsSchema = computed(() => componentMeta.value?.propsSchema || null)

const nodeProps = computed(() => node.value?.props || {})

function updateProp(key: string, value: unknown) {
  if (props.nodeId) {
    designerStore.updateNodeProp(props.nodeId, key, value)
  }
}

function updateNodeField(key: string, value: unknown) {
  if (props.nodeId) {
    designerStore.updateNodeProp(props.nodeId, key, value)
  }
}

interface SchemaField {
  key: string
  schema: JSONSchema7
}

const schemaFields = computed<SchemaField[]>(() => {
  if (!propsSchema.value?.properties) return []
  const properties = propsSchema.value.properties
  return Object.entries(properties)
    .filter(([, schema]) => typeof schema !== 'boolean')
    .map(([key, schema]) => ({
      key,
      schema: schema as JSONSchema7,
    }))
})

function getSchemaTitle(schema: JSONSchema7, key: string): string {
  return schema.title || key
}

function getSchemaDefault(schema: JSONSchema7): unknown {
  return schema.default
}

function getEnumOptions(schema: JSONSchema7): { label: string; value: unknown }[] {
  if (!schema.enum) return []
  return schema.enum.map((val) => ({
    label: String(val),
    value: val,
  }))
}

function renderFormControl(field: SchemaField) {
  const { key, schema } = field
  const value = nodeProps.value[key] ?? getSchemaDefault(schema) ?? null

  if (schema.enum && schema.enum.length > 0) {
    return h(ElSelect, {
      modelValue: value,
      'onUpdate:modelValue': (v: unknown) => updateProp(key, v),
      size: 'small',
      clearable: true,
      placeholder: `请选择${getSchemaTitle(schema, key)}`,
    }, () => getEnumOptions(schema).map(opt =>
      h(ElOption, { key: String(opt.value), label: opt.label, value: opt.value })
    ))
  }

  switch (schema.type) {
    case 'boolean':
      return h(ElSwitch, {
        modelValue: value,
        'onUpdate:modelValue': (v: unknown) => updateProp(key, v),
        size: 'small',
      })

    case 'number':
    case 'integer':
      return h(ElInputNumber, {
        modelValue: value,
        'onUpdate:modelValue': (v: unknown) => updateProp(key, v),
        size: 'small',
        min: schema.minimum ?? schema.exclusiveMinimum,
        max: schema.maximum ?? schema.exclusiveMaximum,
        step: schema.type === 'integer' ? 1 : 0.1,
        controlsPosition: 'right',
        placeholder: `请输入${getSchemaTitle(schema, key)}`,
      })

    case 'string':
      if (schema.format === 'color' || key.toLowerCase().includes('color')) {
        return h(ElColorPicker, {
          modelValue: value,
          'onUpdate:modelValue': (v: unknown) => updateProp(key, v),
          size: 'small',
          showAlpha: true,
        })
      }
      return h(ElInput, {
        modelValue: value,
        'onUpdate:modelValue': (v: unknown) => updateProp(key, v),
        size: 'small',
        placeholder: `请输入${getSchemaTitle(schema, key)}`,
        clearable: true,
      })

    default:
      return h(ElInput, {
        modelValue: value,
        'onUpdate:modelValue': (v: unknown) => updateProp(key, v),
        size: 'small',
        placeholder: `请输入${getSchemaTitle(schema, key)}`,
        clearable: true,
      })
  }
}
</script>

<template>
  <div class="props-form">
    <ElForm label-position="top" size="small">
      <div class="section-title flex items-center gap-2 mb-3 text-text-secondary">
        <ElIcon><Setting /></ElIcon>
        <span class="text-xs font-medium uppercase tracking-wider">基础属性</span>
      </div>

      <ElFormItem label="名称">
        <ElInput
          :model-value="node?.label"
          @update:model-value="updateNodeField('label', $event)"
          placeholder="组件名称"
          clearable
        />
      </ElFormItem>

      <ElFormItem label="锁定状态">
        <ElSwitch
          :model-value="node?.locked"
          @update:model-value="updateNodeField('locked', $event)"
          active-text="已锁定"
          inactive-text="未锁定"
        />
      </ElFormItem>

      <ElFormItem label="可见性">
        <ElSwitch
          :model-value="node?.visible !== false"
          @update:model-value="updateNodeField('visible', $event)"
          active-text="可见"
          inactive-text="隐藏"
        />
      </ElFormItem>

      <ElDivider />

      <div class="section-title flex items-center gap-2 mb-3 text-text-secondary">
        <ElIcon><Setting /></ElIcon>
        <span class="text-xs font-medium uppercase tracking-wider">组件属性</span>
      </div>

      <template v-if="schemaFields.length > 0">
        <ElFormItem
          v-for="field in schemaFields"
          :key="field.key"
          :label="getSchemaTitle(field.schema, field.key)"
        >
          <component :is="renderFormControl(field)" />
        </ElFormItem>
      </template>

      <div v-else-if="node?.nodeKind !== 'graph'" class="text-text-muted text-sm py-4 text-center">
        该组件暂无可配置属性
      </div>

      <template v-if="node?.nodeKind === 'graph'">
        <ElDivider />
        <div class="section-title flex items-center gap-2 mb-3 text-text-secondary">
          <ElIcon><Setting /></ElIcon>
          <span class="text-xs font-medium uppercase tracking-wider">图元属性</span>
        </div>
        <ElFormItem label="图元类型">
          <ElInput :model-value="(node as GraphNodeSchema).graphType" disabled />
        </ElFormItem>
      </template>
    </ElForm>
  </div>
</template>

<style scoped>
.props-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.props-form :deep(.el-form-item__label) {
  font-size: 12px;
  color: var(--color-text-secondary);
  padding-bottom: 4px;
}

.props-form :deep(.el-divider) {
  margin: 16px 0;
  border-color: var(--color-border);
}

.props-form :deep(.el-input-number) {
  width: 100%;
}

.props-form :deep(.el-select) {
  width: 100%;
}

.props-form :deep(.el-color-picker) {
  width: 100%;
}

.props-form :deep(.el-color-picker__trigger) {
  width: 100%;
}

.section-title {
  opacity: 0.7;
}
</style>
