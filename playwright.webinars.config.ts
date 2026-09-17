import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests', testMatch: 'webinar-catalog.e2e.spec.ts',
  outputDir: '/tmp/solagree-webinars-playwright-results',
  use: { baseURL: 'http://127.0.0.1:3025', browserName: 'chromium', channel: 'chrome' },
  webServer: {
    command: 'npm exec nuxt dev -- --host 127.0.0.1 --port 3025',
    url: 'http://127.0.0.1:3025/', timeout: 60000, reuseExistingServer: true
  }
})
