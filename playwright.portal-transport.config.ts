import { defineConfig } from '@playwright/test'
import formSubmission from './playwright.form-submission.config'

export default defineConfig({
  ...formSubmission,
  testMatch: ['form-submission-lifecycle.e2e.spec.ts', 'portal-api-transport.e2e.spec.ts'],
  use: { ...formSubmission.use, channel: undefined }
})
