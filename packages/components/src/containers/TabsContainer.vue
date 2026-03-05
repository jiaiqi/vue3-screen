<script setup lang="ts">
import { ref, computed } from 'vue'

interface Tab {
  id: string
  label: string
}

interface Props {
  tabs?: Tab[]
  activeTab?: string
  tabPosition?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
  ],
  activeTab: 'tab1',
  tabPosition: 'top',
})

const currentTab = ref(props.activeTab)

const isVertical = computed(() => props.tabPosition === 'left' || props.tabPosition === 'right')

function selectTab(tabId: string) {
  currentTab.value = tabId
}
</script>

<template>
  <div 
    class="tabs-container h-full w-full rounded-lg border border-border overflow-hidden flex"
    :class="{
      'flex-col': tabPosition === 'top',
      'flex-col-reverse': tabPosition === 'bottom',
      'flex-row': tabPosition === 'left',
      'flex-row-reverse': tabPosition === 'right',
    }"
  >
    <div 
      class="tabs-header flex bg-surface-elevated"
      :class="{
        'flex-row': !isVertical,
        'flex-col': isVertical,
      }"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item px-4 py-2 text-sm transition-colors"
        :class="[
          currentTab === tab.id 
            ? 'bg-primary text-white' 
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
        ]"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content flex-1 bg-surface p-3 overflow-auto">
      <slot :active-tab="currentTab" />
    </div>
  </div>
</template>

<style scoped>
.tabs-container {
  background: var(--color-surface);
}

.tab-item {
  border: none;
  cursor: pointer;
  outline: none;
}
</style>
