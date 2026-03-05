import type { ComponentMeta, ComponentInstance } from './types'
import { ref, computed } from 'vue'

const components = ref<Map<string, ComponentInstance>>(new Map())

export function registerComponent(meta: ComponentMeta, component: any) {
  components.value.set(meta.type, {
    id: meta.type,
    type: meta.type,
    meta,
    component,
  })
}

export function unregisterComponent(type: string) {
  components.value.delete(type)
}

export function getComponent(type: string): ComponentInstance | undefined {
  return components.value.get(type)
}

export function getComponentsByCategory(category: string): ComponentInstance[] {
  return Array.from(components.value.values()).filter(
    (c: ComponentInstance) => c.meta.category === category
  )
}

export function getAllComponents(): ComponentInstance[] {
  return Array.from(components.value.values())
}

export function searchComponents(keyword: string): ComponentInstance[] {
  const lower = keyword.toLowerCase()
  return Array.from(components.value.values()).filter(
    (c: ComponentInstance) => 
      c.meta.name.toLowerCase().includes(lower) ||
      c.meta.type.toLowerCase().includes(lower)
  )
}

export const componentCategories = computed(() => {
  const cats = new Set<string>()
  components.value.forEach((c: ComponentInstance) => cats.add(c.meta.category))
  return Array.from(cats)
})

export function initializeComponents() {
  import('./charts').then(({ 
    BarChart, LineChart, PieChart, GaugeChart,
    barChartMeta, lineChartMeta, pieChartMeta, gaugeChartMeta
  }) => {
    registerComponent(barChartMeta, BarChart)
    registerComponent(lineChartMeta, LineChart)
    registerComponent(pieChartMeta, PieChart)
    registerComponent(gaugeChartMeta, GaugeChart)
  })
  
  import('./data').then(({
    NumberCard, DataTable, Progress,
    BaseNumberCard, TrendNumberCard, TargetNumberCard,
    ProgressNumberCard, MultiDimensionNumberCard,
    numberCardMeta, dataTableMeta, progressMeta,
    baseNumberCardMeta, trendNumberCardMeta, targetNumberCardMeta,
    progressNumberCardMeta, multiDimensionNumberCardMeta
  }) => {
    registerComponent(numberCardMeta, NumberCard)
    registerComponent(dataTableMeta, DataTable)
    registerComponent(progressMeta, Progress)
    registerComponent(baseNumberCardMeta, BaseNumberCard)
    registerComponent(trendNumberCardMeta, TrendNumberCard)
    registerComponent(targetNumberCardMeta, TargetNumberCard)
    registerComponent(progressNumberCardMeta, ProgressNumberCard)
    registerComponent(multiDimensionNumberCardMeta, MultiDimensionNumberCard)
  })
  
  import('./decorations').then(({
    TechBorder, TitleBox, Divider,
    techBorderMeta, titleBoxMeta, dividerMeta
  }) => {
    registerComponent(techBorderMeta, TechBorder)
    registerComponent(titleBoxMeta, TitleBox)
    registerComponent(dividerMeta, Divider)
  })
  
  import('./containers').then(({
    GroupContainer, TabsContainer,
    groupContainerMeta, tabsContainerMeta
  }) => {
    registerComponent(groupContainerMeta, GroupContainer)
    registerComponent(tabsContainerMeta, TabsContainer)
  })
}
