<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElInput, ElTree, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElButton } from 'element-plus'
import { Lock, Unlock, View, Hide, Delete, MoreFilled, FolderOpened, Document } from '@element-plus/icons-vue'
import { useDesignerStore } from '@/stores/designer'
import { useSelectionStore } from '@/stores/selection'
import type { ComponentNode, GraphNodeSchema } from '@screen/core'

interface TreeNode {
  id: string
  label: string
  nodeKind: 'widget' | 'graph'
  locked?: boolean
  visible?: boolean
  children?: TreeNode[]
}

const designerStore = useDesignerStore()
const selectionStore = useSelectionStore()

const searchText = ref('')

const treeData = computed<TreeNode[]>(() => {
  const widgetNodes: TreeNode[] = designerStore.nodes
    .filter(n => !searchText.value || n.label.toLowerCase().includes(searchText.value.toLowerCase()))
    .map(n => ({
      id: n.id,
      label: n.label,
      nodeKind: 'widget' as const,
      locked: n.locked,
      visible: n.visible !== false,
    }))

  const graphNodes: TreeNode[] = designerStore.graphNodes
    .filter(n => !searchText.value || n.label.toLowerCase().includes(searchText.value.toLowerCase()))
    .map(n => ({
      id: n.id,
      label: n.label,
      nodeKind: 'graph' as const,
    }))

  return [
    {
      id: 'widget-group',
      label: '组件',
      nodeKind: 'widget',
      children: widgetNodes,
    },
    {
      id: 'graph-group',
      label: '图元',
      nodeKind: 'graph',
      children: graphNodes,
    },
  ]
})

const selectedKeys = computed(() => Array.from(selectionStore.selectedIds))

function handleNodeClick(data: TreeNode) {
  if (data.children) return
  selectionStore.select(data.id)
}

function handleCheckChange(data: TreeNode, checked: boolean) {
  if (data.children) return
  if (checked) {
    selectionStore.addToSelection(data.id)
  } else {
    selectionStore.removeFromSelection(data.id)
  }
}

function toggleLock(node: ComponentNode | GraphNodeSchema) {
  designerStore.updateNodeProp(node.id, 'locked', !node.locked)
}

function toggleVisible(node: ComponentNode | GraphNodeSchema) {
  designerStore.updateNodeProp(node.id, 'visible', node.visible === false ? true : false)
}

function deleteNode(id: string) {
  designerStore.removeNode(id)
  selectionStore.removeFromSelection(id)
}

function getNodeById(id: string) {
  return designerStore.getNodeById(id)
}
</script>

<template>
  <div class="layer-panel flex h-full flex-col bg-surface">
    <div class="border-b border-border p-4">
      <h3 class="text-lg font-semibold text-text-primary">图层</h3>
    </div>

    <div class="p-2">
      <ElInput
        v-model="searchText"
        placeholder="搜索图层..."
        size="small"
        clearable
      />
    </div>

    <div class="flex-1 overflow-auto">
      <ElTree
        :data="treeData"
        :props="{ label: 'label', children: 'children' }"
        :default-expanded-keys="['widget-group', 'graph-group']"
        :checked-keys="selectedKeys"
        show-checkbox
        node-key="id"
        highlight-current
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
      >
        <template #default="{ node, data }">
          <div class="layer-node flex flex-1 items-center justify-between pr-2">
            <div class="flex items-center gap-2">
              <ElIcon v-if="data.nodeKind === 'widget'" class="text-primary">
                <Document />
              </ElIcon>
              <ElIcon v-else class="text-secondary">
                <FolderOpened />
              </ElIcon>
              <span class="text-sm">{{ data.label }}</span>
            </div>

            <div v-if="!data.children" class="flex items-center gap-1">
              <ElButton
                v-if="data.locked"
                link
                size="small"
                @click.stop="toggleLock(getNodeById(data.id)!)"
              >
                <ElIcon class="text-warning"><Lock /></ElIcon>
              </ElButton>
              <ElButton
                v-if="data.visible === false"
                link
                size="small"
                @click.stop="toggleVisible(getNodeById(data.id)!)"
              >
                <ElIcon class="text-text-muted"><Hide /></ElIcon>
              </ElButton>

              <ElDropdown trigger="click" @command="(cmd: string) => {
                if (cmd === 'lock') toggleLock(getNodeById(data.id)!)
                if (cmd === 'hide') toggleVisible(getNodeById(data.id)!)
                if (cmd === 'delete') deleteNode(data.id)
              }">
                <ElButton link size="small" @click.stop>
                  <ElIcon><MoreFilled /></ElIcon>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="lock">
                      <ElIcon><Lock /></ElIcon>
                      {{ data.locked ? '解锁' : '锁定' }}
                    </ElDropdownItem>
                    <ElDropdownItem command="hide">
                      <ElIcon><View /></ElIcon>
                      {{ data.visible === false ? '显示' : '隐藏' }}
                    </ElDropdownItem>
                    <ElDropdownItem command="delete" divided>
                      <ElIcon><Delete /></ElIcon>
                      删除
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </div>
          </div>
        </template>
      </ElTree>
    </div>
  </div>
</template>

<style scoped>
.layer-panel :deep(.el-tree-node__content) {
  height: 32px;
}

.layer-node {
  width: 100%;
}
</style>
