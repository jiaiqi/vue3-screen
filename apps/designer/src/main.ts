import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@unocss/reset/tailwind.css'
import './styles/theme.css'
import 'virtual:uno.css'

// 导入 ECharts 和渲染器
import * as echarts from 'echarts'
// 导入 Canvas 渲染器（必需）
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
// 导入常用图表（按需导入）
import {
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
} from 'echarts/charts'
// 导入常用组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'

import App from './App.vue'
import router from './router'
import { initializeComponents } from '@screen/components'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

initializeComponents()

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
