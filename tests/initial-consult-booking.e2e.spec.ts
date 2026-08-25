import { expect, test } from '@playwright/test'

const expectedEvents = [
  ['first-available', 'initial-consults/initial-consult'],
  ['taj', 'initial-consults/initial-consult-taj'],
  ['stacie', 'initial-consults/initial-consult-stacie'],
  ['james', 'initial-consults/initial-consult-james'],
  ['jessica', 'initial-consults/initial-consult-jessica']
] as const

test('switches the live booking iframe to each selected Cal.com event', async ({ page }) => {
  await page.route(/https:\/\/.*\.cal\.com\//, route => route.abort())
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const embed = page.locator('.calcom-booking-embed__frame')
  await expect(embed).toHaveCount(1)
  await expect(page.locator('.calcom-booking-embed__header')).toHaveCount(0)
  await expect(page.locator('.calcom-booking-embed')).toHaveAttribute('aria-label', 'Secure booking calendar')

  for (const [id, eventPath] of expectedEvents) {
    if (await page.locator('.consultant-selection-summary').count()) {
      await page.getByRole('button', { name: 'Change consultant' }).click()
    }

    await page.locator(`[data-consultant-id="${id}"]`).click()
    await expect(page.locator('.consultant-selector')).toHaveCount(0)
    await expect(page.locator('.consultant-selection-summary__details')).toContainText('30 min')
    await expect(page.locator('.consultant-selection-summary__details')).toContainText('Phone Call or Zoom')
    await expect(page.locator('.consultant-selection-summary__details')).toContainText('$60')
    await expect(embed).toHaveCount(1)
    await expect(embed).toHaveAttribute('data-calcom-event-path', eventPath)
  }
})

test('stacks the Solagree booking sidebar above the Cal.com embed on mobile', async ({ page }) => {
  await page.route(/https:\/\/.*\.cal\.com\//, route => route.abort())
  await page.setViewportSize({ width: 600, height: 900 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-consultant-id="taj"]').click()

  const sidebar = page.locator('.initial-consult-booking-page__selection')
  const calendar = page.locator('.initial-consult-booking-page__calendar')
  const [sidebarBox, calendarBox] = await Promise.all([sidebar.boundingBox(), calendar.boundingBox()])

  expect(sidebarBox?.y).toBeLessThan(calendarBox?.y ?? 0)
})

test('keeps the Solagree booking sidebar beside the Cal.com embed on desktop', async ({ page }) => {
  await page.route(/https:\/\/.*\.cal\.com\//, route => route.abort())
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-consultant-id="taj"]').click()

  const sidebar = page.locator('.initial-consult-booking-page__selection')
  const calendar = page.locator('.initial-consult-booking-page__calendar')
  const headshot = page.locator('.consultant-selection-summary__headshot')
  const [sidebarBox, calendarBox] = await Promise.all([sidebar.boundingBox(), calendar.boundingBox()])

  expect(sidebarBox?.x).toBeLessThan(calendarBox?.x ?? 0)
  expect(Math.abs((sidebarBox?.y ?? 0) - (calendarBox?.y ?? 0))).toBeLessThan(1)
  expect(await headshot.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
})
