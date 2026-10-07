import { expect, test } from '@playwright/test'

test('disabled staging omits GA scripts and suppresses events even when a host supplies gtag', async ({ page }) => {
  const externalRequests: string[] = []
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === 'http://127.0.0.1:3199') return route.continue()
    externalRequests.push(route.request().url())
    return route.abort()
  })
  await page.addInitScript(() => {
    const captureWindow = window as typeof window & { __analyticsEvents: unknown[][] }
    captureWindow.__analyticsEvents = []
    captureWindow.gtag = (...args) => captureWindow.__analyticsEvents.push(args)
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0)
  await page.locator('a[href="/attorneys"]').first().click()
  await expect(page).toHaveURL('/attorneys')
  await expect(page).toHaveTitle('Attorney Partners | Solagree')
  await page.waitForTimeout(100)
  expect(await page.evaluate(() => (window as typeof window & { __analyticsEvents: unknown[] }).__analyticsEvents)).toEqual([])
  expect(externalRequests.filter(url => /google-analytics|googletagmanager/.test(url))).toEqual([])
})
