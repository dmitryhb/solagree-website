import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'phone-validation.e2e.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:3116',
    browserName: 'chromium',
    channel: 'chrome'
  },
  webServer: {
    command: 'NUXT_PUBLIC_PORTAL_API_BASE_URL=http://127.0.0.1:3116 npm exec nuxt dev -- --host 127.0.0.1 --port 3116',
    url: 'http://127.0.0.1:3116',
    timeout: 30000,
    reuseExistingServer: false
  }
})
