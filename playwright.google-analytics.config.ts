import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'google-analytics.e2e.spec.ts',
  outputDir: '/tmp/solagree-google-analytics-playwright-results',
  use: {
    baseURL: 'http://127.0.0.1:3197',
    browserName: 'chromium',
    channel: 'chrome'
  },
  webServer: {
    command: 'NUXT_PUBLIC_GA_MEASUREMENT_ID=G-HIR607LOCAL npm exec nuxt dev -- --host 127.0.0.1 --port 3197',
    url: 'http://127.0.0.1:3197/',
    timeout: 60000,
    reuseExistingServer: true
  }
})
