import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'form-submission-lifecycle.e2e.spec.ts',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3116',
    browserName: 'chromium',
    channel: 'chrome'
  },
  webServer: {
    // Build once and serve the compiled fixture without a Nuxt/Vite watcher.
    command: 'npm exec vite -- build --config tests/form-submission-vite.config.ts && npm exec vite -- preview --config tests/form-submission-vite.config.ts --host 127.0.0.1 --port 3116 --strictPort',
    url: 'http://127.0.0.1:3116',
    timeout: 30000,
    reuseExistingServer: false
  }
})
