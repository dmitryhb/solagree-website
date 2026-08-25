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
    await expect(page.locator('.consultant-selection-summary')).toContainText('30 minutes · $60')
    await expect(embed).toHaveCount(1)
    await expect(embed).toHaveAttribute('data-calcom-event-path', eventPath)
  }
})
