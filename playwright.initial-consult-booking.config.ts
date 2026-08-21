import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'initial-consult-booking.e2e.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:3104',
    browserName: 'chromium',
    channel: 'chrome'
  },
  webServer: {
    command: 'pnpm exec vite --config tests/e2e-vite.config.ts --host 127.0.0.1 --port 3104',
    url: 'http://127.0.0.1:3104',
    timeout: 30000,
    reuseExistingServer: false
  }
})
