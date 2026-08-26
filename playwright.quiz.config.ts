import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'quiz.e2e.spec.ts',
  outputDir: '/tmp/solagree-quiz-playwright-results',
  use: {
    baseURL: 'http://127.0.0.1:3106',
    browserName: 'chromium',
    channel: 'chrome'
  },
  webServer: {
    command: 'pnpm exec nuxt dev --host 127.0.0.1 --port 3106',
    url: 'http://127.0.0.1:3106/quiz',
    timeout: 60000,
    reuseExistingServer: false
  }
})
