import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'deployment-analytics.e2e.spec.ts',
  outputDir: '/tmp/solagree-deployment-analytics-results',
  use: {
    baseURL: 'http://127.0.0.1:3199',
    browserName: 'chromium',
    channel: 'chrome'
  },
  webServer: {
    command: 'NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT=staging NUXT_PUBLIC_GA_MEASUREMENT_ID= npm exec nuxt dev -- --host 127.0.0.1 --port 3199',
    url: 'http://127.0.0.1:3199/',
    timeout: 60000,
    reuseExistingServer: false
  }
})
