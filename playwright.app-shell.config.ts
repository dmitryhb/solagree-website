import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'app-shell.e2e.spec.ts',
  outputDir: '/tmp/solagree-app-shell-playwright-results',
  use: {
    baseURL: 'http://127.0.0.1:3198',
    browserName: 'chromium',
    channel: 'chrome'
  },
  webServer: {
    command: 'npm exec nuxt dev -- --host 127.0.0.1 --port 3198',
    url: 'http://127.0.0.1:3198/',
    timeout: 60000,
    reuseExistingServer: false
  }
})
