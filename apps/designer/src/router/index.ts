import { createRouter, createWebHistory } from 'vue-router'
import Designer from '@/views/Designer.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'designer',
      component: Designer,
    },
  ],
})

export default router
