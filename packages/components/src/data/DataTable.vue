<script setup lang="ts">
interface Props {
  showHeader?: boolean
  striped?: boolean
  columns?: { key: string; title: string; width?: number }[]
  data?: Record<string, unknown>[]
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  striped: true,
  columns: () => [
    { key: 'id', title: 'ID', width: 80 },
    { key: 'name', title: '名称' },
    { key: 'value', title: '数值', width: 100 },
  ],
  data: () => [
    { id: 1, name: '项目A', value: 1234 },
    { id: 2, name: '项目B', value: 2345 },
    { id: 3, name: '项目C', value: 3456 },
    { id: 4, name: '项目D', value: 4567 },
  ],
})
</script>

<template>
  <div class="data-table h-full w-full overflow-auto">
    <table class="w-full border-collapse text-sm">
      <thead v-if="showHeader" class="bg-surface-elevated sticky top-0">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="border-b border-border px-4 py-2 text-left text-text-secondary font-medium"
            :style="{ width: col.width ? `${col.width}px` : 'auto' }"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="index"
          :class="{ 'bg-surface-elevated/50': striped && index % 2 === 1 }"
          class="hover:bg-surface-elevated transition-colors"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="border-b border-border/50 px-4 py-2 text-text-primary"
          >
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
