import { expect, test } from '@playwright/test'

const expectedEvents = [
  ['first-available', 'initial-consults/initial-consult'],
  ['taj', 'initial-consults/initial-consult-taj'],
  ['stacie', 'initial-consults/initial-consult-stacie'],
  ['jessica', 'initial-consults/initial-consult-jessica'],
  ['james', 'initial-consults/initial-consult-james']
] as const

test('switches the live booking iframe to each selected Cal.com event', async ({ page }) => {
  await page.route(/https:\/\/.*\.cal\.com\//, route => route.abort())
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const embed = page.locator('.calcom-booking-embed__frame')
  await expect(embed).toHaveCount(1)

  for (const [id, eventPath] of expectedEvents) {
    await page.locator(`[data-consultant-id="${id}"]`).click()
    await expect(embed).toHaveCount(1)
    await expect(embed).toHaveAttribute('data-calcom-event-path', eventPath)
  }
})
