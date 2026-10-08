import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'co-branded-page-layout.e2e.spec.ts',
  outputDir: '/tmp/hir-613-co-branded-layout-results',
  timeout: 120000,
  use: {
    baseURL: 'http://127.0.0.1:3158',
    browserName: 'chromium',
    channel: 'chrome',
    deviceScaleFactor: 2
  },
  webServer: {
    command: 'NUXT_PUBLIC_PORTAL_API_BASE_URL=http://portal.fixture npm exec nuxt dev -- --host 127.0.0.1 --port 3158',
    url: 'http://127.0.0.1:3158/',
    timeout: 60000,
    reuseExistingServer: false
  }
})
