<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElButton, ElButtonGroup, ElSelect, ElOption, ElTooltip, ElIcon, ElMessage, ElDialog, ElTable, ElTableColumn } from 'element-plus'
import {
  Document,
  FolderOpened,
  DocumentCopy,
  Download,
  RefreshLeft,
  RefreshRight,
  FullScreen,
  Aim,
  Delete,
  CopyDocument,
  Grid,
} from '@element-plus/icons-vue'
import { useDesignerStore, type SavedScreen } from '@/stores/designer'
import { useCanvasStore } from '@/stores/canvas'
import { useSelectionStore } from '@/stores/selection'
import { useAlign } from '@/composables/useAlign'
import NewScreenDialog from '@/components/dialogs/NewScreenDialog.vue'
import SaveAsDialog from '@/components/dialogs/SaveAsDialog.vue'

const designerStore = useDesignerStore()
const canvasStore = useCanvasStore()
const selectionStore = useSelectionStore()
const { alignLeft, alignCenter, alignRight, alignTop, alignMiddle, alignBottom, distributeHorizontally, distributeVertically, equalWidth, equalHeight } = useAlign()

const scaleValue = computed({
  get: () => canvasStore.scalePercent,
  set: (val: number) => canvasStore.setScalePercent(val),
})

const selectedCount = computed(() => selectionStore.selectedCount)
const showAlignTools = computed(() => selectedCount.value >= 2)

const showNewDialog = ref(false)
const showSaveAsDialog = ref(false)
const showOpenDialog = ref(false)

const savedScreens = computed<SavedScreen[]>(() => designerStore.getSavedScreens())
const selectedScreenId = ref<string | null>(null)

const canPaste = computed(() => true)

function handleNew() {
  showNewDialog.value = true
}

function handleNewConfirm(name: string, width: number, height: number) {
  designerStore.createNewScreen(name, width, height)
  ElMessage.success(`已创建大屏: ${name}`)
}

function handleOpen() {
  showOpenDialog.value = true
  selectedScreenId.value = null
}

function handleOpenConfirm() {
  if (!selectedScreenId.value) {
    ElMessage.warning('请选择要打开的大屏')
    return
  }

  if (designerStore.loadScreen(selectedScreenId.value)) {
    const screen = savedScreens.value.find(s => s.id === selectedScreenId.value)
    ElMessage.success(`已打开: ${screen?.name}`)
    showOpenDialog.value = false
  } else {
    ElMessage.error('打开失败')
  }
}

function handleDeleteScreen() {
  if (!selectedScreenId.value) return
  
  const screen = savedScreens.value.find(s => s.id === selectedScreenId.value)
  designerStore.deleteSavedScreen(selectedScreenId.value)
  selectedScreenId.value = null
  ElMessage.success(`已删除: ${screen?.name}`)
}

function handleSave() {
  if (designerStore.saveScreen()) {
    ElMessage.success('保存成功')
  } else {
    ElMessage.error('保存失败')
  }
}

function handleSaveAs() {
  showSaveAsDialog.value = true
}

function handleSaveAsConfirm(name: string) {
  if (designerStore.saveAs(name)) {
    ElMessage.success(`已另存为: ${name}`)
  } else {
    ElMessage.error('另存为失败')
  }
}

function handleUndo() {
  designerStore.undo()
}

function handleRedo() {
  designerStore.redo()
}

function handleDelete() {
  designerStore.deleteSelected()
}

function handleCopy() {
  designerStore.copy()
  ElMessage.success('已复制')
}

function handlePaste() {
  designerStore.paste()
}

function handleFitScreen() {
  const container = document.querySelector('.canvas-viewport')
  if (container) {
    const rect = container.getBoundingClientRect()
    canvasStore.fitToScreen(rect.width, rect.height)
  }
}

function handleResetScale() {
  canvasStore.resetScale()
}

function handleAlign(type: string) {
  const selectedIds = Array.from(selectionStore.selectedIds)
  const nodes = selectedIds
    .map(id => designerStore.getNodeById(id))
    .filter((n): n is NonNullable<ReturnType<typeof designerStore.getNodeById>> => n !== undefined)

  if (nodes.length < 2) return

  let layouts: Array<{ id: string; layout: ReturnType<typeof alignLeft>[0] }> = []

  switch (type) {
    case 'left':
      layouts = alignLeft(nodes).map((layout, i) => ({ id: selectedIds[i], layout }))
      break
    case 'center-h':
      layouts = alignCenter(nodes).map((layout, i) => ({ id: selectedIds[i], layout }))
      break
    case 'right':
      layouts = alignRight(nodes).map((layout, i) => ({ id: selectedIds[i], layout }))
      break
    case 'top':
      layouts = alignTop(nodes).map((layout, i) => ({ id: selectedIds[i], layout }))
      break
    case 'center-v':
      layouts = alignMiddle(nodes).map((layout, i) => ({ id: selectedIds[i], layout }))
      break
    case 'bottom':
      layouts = alignBottom(nodes).map((layout, i) => ({ id: selectedIds[i], layout }))
      break
    case 'distribute-h':
      if (nodes.length < 3) {
        ElMessage.warning('水平等间距至少需要 3 个元素')
        return
      }
      const sortedH = [...selectedIds].sort((a, b) => {
        const nodeA = designerStore.getNodeById(a)
        const nodeB = designerStore.getNodeById(b)
        return (nodeA?.layout.x || 0) - (nodeB?.layout.x || 0)
      })
      const nodesH = sortedH.map(id => designerStore.getNodeById(id)).filter((n): n is NonNullable<ReturnType<typeof designerStore.getNodeById>> => n !== undefined)
      layouts = distributeHorizontally(nodesH).map((layout, i) => ({ id: sortedH[i], layout }))
      break
    case 'distribute-v':
      if (nodes.length < 3) {
        ElMessage.warning('垂直等间距至少需要 3 个元素')
        return
      }
      const sortedV = [...selectedIds].sort((a, b) => {
        const nodeA = designerStore.getNodeById(a)
        const nodeB = designerStore.getNodeById(b)
        return (nodeA?.layout.y || 0) - (nodeB?.layout.y || 0)
      })
      const nodesV = sortedV.map(id => designerStore.getNodeById(id)).filter((n): n is NonNullable<ReturnType<typeof designerStore.getNodeById>> => n !== undefined)
      layouts = distributeVertically(nodesV).map((layout, i) => ({ id: sortedV[i], layout }))
      break
    case 'equal-width':
      layouts = equalWidth(nodes).map((layout, i) => ({ id: selectedIds[i], layout }))
      break
    case 'equal-height':
      layouts = equalHeight(nodes).map((layout, i) => ({ id: selectedIds[i], layout }))
      break
  }

  if (layouts.length > 0) {
    designerStore.updateNodesLayout(layouts)
  }
}
</script>

<template>
  <div class="top-toolbar flex h-12 items-center justify-between border-b border-border bg-surface px-4">
    <div class="toolbar-left flex items-center gap-2">
      <div class="file-operations flex items-center gap-1">
        <ElTooltip content="新建" placement="bottom">
          <ElButton size="small" @click="handleNew">
            <ElIcon><Document /></ElIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip content="打开" placement="bottom">
          <ElButton size="small" @click="handleOpen">
            <ElIcon><FolderOpened /></ElIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip content="保存" placement="bottom">
          <ElButton size="small" @click="handleSave">
            <ElIcon><Download /></ElIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip content="另存为" placement="bottom">
          <ElButton size="small" @click="handleSaveAs">
            <ElIcon><DocumentCopy /></ElIcon>
          </ElButton>
        </ElTooltip>
      </div>

      <div class="divider mx-2 h-6 w-px bg-border"></div>

      <div class="edit-operations flex items-center gap-1">
        <ElTooltip content="撤销 (Ctrl+Z)" placement="bottom">
          <ElButton size="small" :disabled="!designerStore.canUndo" @click="handleUndo">
            <ElIcon><RefreshLeft /></ElIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip content="重做 (Ctrl+Shift+Z)" placement="bottom">
          <ElButton size="small" :disabled="!designerStore.canRedo" @click="handleRedo">
            <ElIcon><RefreshRight /></ElIcon>
          </ElButton>
        </ElTooltip>

        <div class="divider mx-1 h-6 w-px bg-border"></div>

        <ElTooltip content="复制 (Ctrl+C)" placement="bottom">
          <ElButton size="small" :disabled="selectedCount === 0" @click="handleCopy">
            <ElIcon><CopyDocument /></ElIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip content="粘贴 (Ctrl+V)" placement="bottom">
          <ElButton size="small" :disabled="!canPaste" @click="handlePaste">
            <ElIcon><DocumentCopy /></ElIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip content="删除 (Delete)" placement="bottom">
          <ElButton size="small" :disabled="selectedCount === 0" @click="handleDelete">
            <ElIcon><Delete /></ElIcon>
          </ElButton>
        </ElTooltip>
      </div>
    </div>

    <div class="toolbar-center flex items-center gap-2">
      <div class="project-name text-sm font-medium text-text-primary">
        {{ designerStore.schema.name }}
      </div>
    </div>

    <div class="toolbar-right flex items-center gap-2">
      <div class="view-controls flex items-center gap-2">
        <ElSelect
          v-model="scaleValue"
          size="small"
          style="width: 100px"
        >
          <ElOption
            v-for="option in canvasStore.scaleOptions"
            :key="option"
            :label="`${option}%`"
            :value="option"
          />
        </ElSelect>
        <ElTooltip content="适应屏幕" placement="bottom">
          <ElButton size="small" @click="handleFitScreen">
            <ElIcon><FullScreen /></ElIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip content="100%" placement="bottom">
          <ElButton size="small" @click="handleResetScale">
            <ElIcon><Aim /></ElIcon>
          </ElButton>
        </ElTooltip>
      </div>

      <template v-if="showAlignTools">
        <div class="divider mx-2 h-6 w-px bg-border"></div>

        <div class="align-tools flex items-center gap-1">
          <ElButtonGroup size="small">
            <ElTooltip content="左对齐" placement="bottom">
              <ElButton @click="handleAlign('left')">
                <span class="i-carbon-align-horizontal-left text-sm"></span>
              </ElButton>
            </ElTooltip>
            <ElTooltip content="水平居中" placement="bottom">
              <ElButton @click="handleAlign('center-h')">
                <span class="i-carbon-align-horizontal-center text-sm"></span>
              </ElButton>
            </ElTooltip>
            <ElTooltip content="右对齐" placement="bottom">
              <ElButton @click="handleAlign('right')">
                <span class="i-carbon-align-horizontal-right text-sm"></span>
              </ElButton>
            </ElTooltip>
          </ElButtonGroup>

          <ElButtonGroup size="small">
            <ElTooltip content="顶对齐" placement="bottom">
              <ElButton @click="handleAlign('top')">
                <span class="i-carbon-align-vertical-top text-sm"></span>
              </ElButton>
            </ElTooltip>
            <ElTooltip content="垂直居中" placement="bottom">
              <ElButton @click="handleAlign('center-v')">
                <span class="i-carbon-align-vertical-center text-sm"></span>
              </ElButton>
            </ElTooltip>
            <ElTooltip content="底对齐" placement="bottom">
              <ElButton @click="handleAlign('bottom')">
                <span class="i-carbon-align-vertical-bottom text-sm"></span>
              </ElButton>
            </ElTooltip>
          </ElButtonGroup>

          <ElButtonGroup size="small">
            <ElTooltip content="水平等间距" placement="bottom">
              <ElButton @click="handleAlign('distribute-h')">
                <span class="i-carbon-split text-sm"></span>
              </ElButton>
            </ElTooltip>
            <ElTooltip content="垂直等间距" placement="bottom">
              <ElButton @click="handleAlign('distribute-v')">
                <span class="i-carbon-split text-sm rotate-90"></span>
              </ElButton>
            </ElTooltip>
          </ElButtonGroup>

          <ElButtonGroup size="small">
            <ElTooltip content="等宽" placement="bottom">
              <ElButton @click="handleAlign('equal-width')">
                <ElIcon><Grid /></ElIcon>
              </ElButton>
            </ElTooltip>
            <ElTooltip content="等高" placement="bottom">
              <ElButton @click="handleAlign('equal-height')">
                <ElIcon class="rotate-90"><Grid /></ElIcon>
              </ElButton>
            </ElTooltip>
          </ElButtonGroup>
        </div>
      </template>
    </div>
  </div>

  <NewScreenDialog v-model:visible="showNewDialog" @confirm="handleNewConfirm" />

  <SaveAsDialog v-model:visible="showSaveAsDialog" :schema="designerStore.schema" @confirm="handleSaveAsConfirm" />

  <ElDialog
    v-model="showOpenDialog"
    title="打开大屏"
    width="600px"
    :close-on-click-modal="false"
  >
    <div v-if="savedScreens.length === 0" class="py-8 text-center text-text-secondary">
      暂无已保存的大屏
    </div>
    <ElTable
      v-else
      :data="savedScreens"
      highlight-current-row
      @current-change="(row: any) => selectedScreenId = row?.id"
    >
      <ElTableColumn prop="name" label="名称" />
      <ElTableColumn label="尺寸" width="150">
        <template #default="{ row }">
          {{ row.schema.canvas.width }} x {{ row.schema.canvas.height }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="savedAt" label="保存时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.savedAt).toLocaleString() }}
        </template>
      </ElTableColumn>
    </ElTable>

    <template #footer>
      <div class="flex justify-between">
        <ElButton type="danger" :disabled="!selectedScreenId" @click="handleDeleteScreen">
          删除
        </ElButton>
        <div>
          <ElButton @click="showOpenDialog = false">取消</ElButton>
          <ElButton type="primary" :disabled="!selectedScreenId" @click="handleOpenConfirm">
            打开
          </ElButton>
        </div>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
.top-toolbar {
  background: linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%);
  border-bottom: 1px solid var(--color-border);
}

.top-toolbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--color-primary-500) 50%, 
    transparent 100%
  );
  opacity: 0.3;
}

.divider {
  opacity: 0.5;
}

:deep(.el-button) {
  background: transparent;
  border-color: transparent;
}

:deep(.el-button:hover:not(:disabled)) {
  background: var(--color-surface-overlay);
  border-color: var(--color-border);
}

:deep(.el-button:disabled) {
  opacity: 0.4;
}

:deep(.el-select .el-input__wrapper) {
  background: var(--color-surface-elevated);
  border-color: var(--color-border);
}
</style>
