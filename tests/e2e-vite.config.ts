import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  root: fileURLToPath(new URL('./fixtures/initial-consult-booking', import.meta.url)),
  publicDir: fileURLToPath(new URL('../public', import.meta.url)),
  plugins: [vue()],
  resolve: {
    alias: {
      '#shared': fileURLToPath(new URL('../shared', import.meta.url)),
      '~': fileURLToPath(new URL('../app', import.meta.url))
    }
  }
})
