import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  root: fileURLToPath(new URL('./fixtures/form-submission', import.meta.url)),
  publicDir: false,
  plugins: [vue()],
  resolve: {
    alias: {
      '/icons/send.svg': fileURLToPath(new URL('../public/icons/send.svg', import.meta.url)),
      '#shared': fileURLToPath(new URL('../shared', import.meta.url)),
      '~': fileURLToPath(new URL('../app', import.meta.url))
    }
  }
})
