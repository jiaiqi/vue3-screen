<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import {
  ElInput,
  ElTree,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
  ElButton,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import {
  Lock,
  Unlock,
  View,
  Hide,
  Delete,
  MoreFilled,
  Document,
  Share,
  Search,
  Rank,
  CopyDocument,
} from '@element-plus/icons-vue'
import { useDesignerStore } from '@/stores/designer'
import { useSelectionStore } from '@/stores/selection'
import type { ComponentNode, GraphNodeSchema } from '@screen/core'

interface TreeNode {
  id: string
  label: string
  nodeKind: 'widget' | 'graph'
  type?: string
  locked?: boolean
  visible?: boolean
  children?: TreeNode[]
  isGroup?: boolean
}

const designerStore = useDesignerStore()
const selectionStore = useSelectionStore()

const searchText = ref('')
const editingId = ref<string | null>(null)
const editingLabel = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const treeData = computed<TreeNode[]>(() => {
  const filterText = searchText.value.toLowerCase()
  
  const widgetNodes: TreeNode[] = designerStore.nodes
    .filter(n => !filterText || n.label.toLowerCase().includes(filterText))
    .map(n => ({
      id: n.id,
      label: n.label,
      nodeKind: 'widget' as const,
      type: n.type,
      locked: n.locked,
      visible: n.visible !== false,
    }))

  const graphNodes: TreeNode[] = designerStore.graphNodes
    .filter(n => !filterText || n.label.toLowerCase().includes(filterText))
    .map(n => ({
      id: n.id,
      label: n.label,
      nodeKind: 'graph' as const,
      type: n.graphType,
    }))

  const result: TreeNode[] = []

  if (widgetNodes.length > 0 || !filterText) {
    result.push({
      id: 'widget-group',
      label: `组件 (${widgetNodes.length})`,
      nodeKind: 'widget',
      isGroup: true,
      children: widgetNodes,
    })
  }

  if (graphNodes.length > 0 || !filterText) {
    result.push({
      id: 'graph-group',
      label: `图元 (${graphNodes.length})`,
      nodeKind: 'graph',
      isGroup: true,
      children: graphNodes,
    })
  }

  return result
})

const selectedKeys = computed(() => Array.from(selectionStore.selectedIds))

function handleNodeClick(data: TreeNode) {
  if (data.isGroup) return
  selectionStore.select(data.id)
}

function handleCheckChange(data: TreeNode, checked: boolean) {
  if (data.isGroup) return
  if (checked) {
    selectionStore.addToSelection(data.id)
  } else {
    selectionStore.removeFromSelection(data.id)
  }
}

function handleNodeDoubleClick(data: TreeNode) {
  if (data.isGroup) return
  startEditing(data)
}

function startEditing(data: TreeNode) {
  editingId.value = data.id
  editingLabel.value = data.label
  nextTick(() => {
    const input = document.querySelector('.edit-input') as HTMLInputElement
    if (input) {
      input.focus()
      input.select()
    }
  })
}

function finishEditing() {
  if (editingId.value && editingLabel.value.trim()) {
    designerStore.updateNodeProp(editingId.value, 'label', editingLabel.value.trim())
    ElMessage.success('名称已更新')
  }
  editingId.value = null
  editingLabel.value = ''
}

function cancelEditing() {
  editingId.value = null
  editingLabel.value = ''
}

function toggleLock(node: ComponentNode | GraphNodeSchema) {
  designerStore.updateNodeProp(node.id, 'locked', !node.locked)
}

function toggleVisible(node: ComponentNode | GraphNodeSchema) {
  const newVisible = node.visible === false ? true : false
  designerStore.updateNodeProp(node.id, 'visible', newVisible)
}

async function deleteNode(id: string) {
  try {
    await ElMessageBox.confirm('确定要删除该组件吗？', '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    designerStore.removeNode(id)
    selectionStore.removeFromSelection(id)
    ElMessage.success('组件已删除')
  } catch {
    // 用户取消
  }
}

function duplicateNode(id: string) {
  const node = designerStore.getNodeById(id)
  if (!node) return
  
  const newNode: ComponentNode = {
    ...node as ComponentNode,
    id: `${node.id}-copy-${Date.now()}`,
    label: `${node.label} (副本)`,
    layout: {
      ...node.layout,
      x: (node.layout?.x || 0) + 20,
      y: (node.layout?.y || 0) + 20,
    },
  }
  
  designerStore.addNode(newNode)
  selectionStore.select(newNode.id)
  ElMessage.success('组件已复制')
}

function getNodeById(id: string) {
  return designerStore.getNodeById(id)
}

function handleDragEnd(draggingNode: any, dropNode: any, dropType: any) {
  if (dropType === 'inner' || dropNode.data.isGroup) {
    return false
  }
  return true
}

function allowDrag(draggingNode: any) {
  return !draggingNode.data.isGroup
}

function allowDrop(draggingNode: any, dropNode: any, type: any) {
  return !dropNode.data.isGroup && type !== 'inner'
}

function handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {
  // 这里可以实现节点排序逻辑
}

function expandAll() {
  const nodeKeys = ['widget-group', 'graph-group']
  nodeKeys.forEach(key => {
    treeRef.value?.store.nodesMap[key]?.expand()
  })
}

function collapseAll() {
  const nodeKeys = ['widget-group', 'graph-group']
  nodeKeys.forEach(key => {
    treeRef.value?.store.nodesMap[key]?.collapse()
  })
}
</script>

<template>
  <div class="layer-panel tech-panel flex h-full flex-col">
    <div class="header border-b border-border p-4">
      <h3 class="title flex items-center gap-2">
        <ElIcon><Rank /></ElIcon>
        图层
      </h3>
      <p class="header-desc">
        管理画布中的所有组件和图元
      </p>
    </div>

    <div class="toolbar p-2 border-b border-border flex items-center gap-2">
      <ElInput
        v-model="searchText"
        placeholder="搜索图层..."
        size="small"
        clearable
        class="flex-1 search-input"
      >
        <template #prefix>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>
      <ElButton size="small" link class="action-btn" @click="expandAll">
        <ElIcon><View /></ElIcon>
      </ElButton>
      <ElButton size="small" link class="action-btn" @click="collapseAll">
        <ElIcon><Hide /></ElIcon>
      </ElButton>
    </div>

    <div class="flex-1 overflow-auto">
      <ElTree
        ref="treeRef"
        :data="treeData"
        :props="{ label: 'label', children: 'children' }"
        :default-expanded-keys="['widget-group', 'graph-group']"
        :checked-keys="selectedKeys"
        :expand-on-click-node="false"
        show-checkbox
        node-key="id"
        highlight-current
        draggable
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        @node-click="handleNodeClick"
        @node-dblclick="handleNodeDoubleClick"
        @check-change="handleCheckChange"
        @node-drop="handleDrop"
      >
        <template #default="{ node, data }">
          <div
            class="layer-node flex flex-1 items-center justify-between pr-2"
            :class="{ 'is-group': data.isGroup, 'is-locked': data.locked, 'is-hidden': data.visible === false }"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <ElIcon v-if="data.isGroup" class="text-text-muted">
                <Share />
              </ElIcon>
              <ElIcon v-else-if="data.nodeKind === 'widget'" class="text-primary">
                <Document />
              </ElIcon>
              <ElIcon v-else class="text-secondary">
                <Share />
              </ElIcon>
              
              <template v-if="editingId === data.id">
                <ElInput
                  v-model="editingLabel"
                  size="small"
                  class="edit-input flex-1"
                  @blur="finishEditing"
                  @keyup.enter="finishEditing"
                  @keyup.escape="cancelEditing"
                />
              </template>
              <template v-else>
                <span class="text-sm truncate" :title="data.label">
                  {{ data.label }}
                </span>
                <ElTag
                  v-if="data.type && !data.isGroup"
                  size="small"
                  type="info"
                  class="type-tag"
                >
                  {{ data.type }}
                </ElTag>
              </template>
            </div>

            <div v-if="!data.isGroup" class="flex items-center gap-1">
              <ElButton
                v-if="data.locked"
                link
                size="small"
                class="status-btn"
                @click.stop="toggleLock(getNodeById(data.id)!)"
              >
                <ElIcon class="text-warning"><Lock /></ElIcon>
              </ElButton>
              <ElButton
                v-if="data.visible === false"
                link
                size="small"
                class="status-btn"
                @click.stop="toggleVisible(getNodeById(data.id)!)"
              >
                <ElIcon class="text-text-muted"><Hide /></ElIcon>
              </ElButton>

              <ElDropdown
                trigger="click"
                @command="(cmd: string) => {
                  if (cmd === 'lock') toggleLock(getNodeById(data.id)!)
                  if (cmd === 'hide') toggleVisible(getNodeById(data.id)!)
                  if (cmd === 'delete') deleteNode(data.id)
                  if (cmd === 'rename') startEditing(data)
                  if (cmd === 'duplicate') duplicateNode(data.id)
                }"
              >
                <ElButton link size="small" class="more-btn" @click.stop>
                  <ElIcon><MoreFilled /></ElIcon>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="rename">
                      <ElIcon><Document /></ElIcon>
                      重命名
                    </ElDropdownItem>
                    <ElDropdownItem command="duplicate">
                      <ElIcon><CopyDocument /></ElIcon>
                      复制
                    </ElDropdownItem>
                    <ElDropdownItem command="lock" divided>
                      <ElIcon><Lock /></ElIcon>
                      {{ data.locked ? '解锁' : '锁定' }}
                    </ElDropdownItem>
                    <ElDropdownItem command="hide">
                      <ElIcon><View /></ElIcon>
                      {{ data.visible === false ? '显示' : '隐藏' }}
                    </ElDropdownItem>
                    <ElDropdownItem command="delete" divided>
                      <ElIcon class="text-danger"><Delete /></ElIcon>
                      <span class="text-danger">删除</span>
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </div>
          </div>
        </template>
      </ElTree>

      <div
        v-if="designerStore.nodes.length === 0 && designerStore.graphNodes.length === 0"
        class="empty-state flex flex-col items-center justify-center py-12 text-text-muted"
      >
        <ElIcon :size="48" class="mb-4 opacity-30">
          <Document />
        </ElIcon>
        <p class="text-sm">暂无图层</p>
        <p class="text-xs mt-1 opacity-60">从组件库拖拽添加组件</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layer-panel {
  --el-bg-color: var(--color-bg-surface);
  background: var(--color-bg-surface);
}

.layer-panel .header {
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.05) 0%, transparent 100%);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 16px;
  background: var(--gradient-primary);
  border-radius: 2px;
  margin-right: 8px;
}

.header-desc {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.search-input :deep(.el-input__wrapper) {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  box-shadow: none;
  transition: all 0.2s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: var(--color-border-light);
}

.search-input :deep(.el-input__wrapper:focus-within) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.search-input :deep(.el-input__inner) {
  color: var(--color-text-primary);
}

.search-input :deep(.el-input__inner::placeholder) {
  color: var(--color-text-muted);
}

.action-btn {
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: var(--color-primary);
}

.layer-panel :deep(.el-tree-node__content) {
  height: 36px;
  border-radius: 4px;
  margin: 2px 0;
  transition: all 0.2s ease;
}

.layer-panel :deep(.el-tree-node__content:hover) {
  background: rgba(0, 212, 255, 0.1);
}

.layer-panel :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: rgba(0, 212, 255, 0.15);
  border-left: 2px solid var(--color-primary);
}

.layer-node {
  width: 100%;
}

.layer-node.is-group {
  font-weight: 500;
}

.layer-node.is-locked {
  opacity: 0.7;
}

.layer-node.is-hidden {
  opacity: 0.5;
}

.type-tag {
  font-size: 10px;
  padding: 0 4px;
  height: 16px;
  line-height: 16px;
}

.status-btn {
  opacity: 0.8;
}

.more-btn {
  opacity: 0;
  transition: opacity 0.2s;
}

.layer-node:hover .more-btn {
  opacity: 1;
}

.edit-input {
  max-width: 120px;
}

.empty-state {
  background: radial-gradient(ellipse at center, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
}

.layer-panel :deep(.el-tree-node__expand-icon) {
  color: var(--color-text-muted);
}

.layer-panel :deep(.el-checkbox) {
  --el-checkbox-checked-bg-color: var(--color-primary);
  --el-checkbox-checked-input-border-color: var(--color-primary);
}

.layer-panel :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.text-danger {
  color: var(--el-color-danger);
}
</style>
