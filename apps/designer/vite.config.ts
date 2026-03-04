import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@screen/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
      '@screen/components': fileURLToPath(new URL('../../packages/components/src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
