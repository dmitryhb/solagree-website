import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'resources-layout.e2e.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:3105',
    browserName: 'chromium',
    channel: 'chrome'
  },
  webServer: {
    command: 'npm exec nuxt dev -- --host 127.0.0.1 --port 3105',
    url: 'http://127.0.0.1:3105',
    timeout: 30000,
    reuseExistingServer: false
  }
})
