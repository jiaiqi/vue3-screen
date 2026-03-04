import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@screen/core': resolve(__dirname, '../../packages/core/src'),
      '@screen/components': resolve(__dirname, '../../packages/components/src'),
      '@screen/graph-nodes': resolve(__dirname, '../../packages/graph-nodes/src'),
      '@screen/edge-animations': resolve(__dirname, '../../packages/edge-animations/src'),
    },
  },
  build: {
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          echarts: ['echarts', 'vue-echarts'],
          vueflow: ['@vue-flow/core', '@vue-flow/background'],
        },
      },
    },
  },
})
