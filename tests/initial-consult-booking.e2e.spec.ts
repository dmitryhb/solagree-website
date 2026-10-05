import { expect, test } from '@playwright/test'

const expectedEvents = [
  ['first-available', 'initial-consults/initial-consult'],
  ['taj', 'initial-consults/initial-consult-taj'],
  ['stacie', 'initial-consults/initial-consult-stacie'],
  ['james', 'initial-consults/initial-consult-james']
] as const

test('switches the live booking iframe to each selected Cal.com event', async ({ page }) => {
  await page.route(/https:\/\/.*\.cal\.com\//, route => route.abort())
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('[data-consultant-id="jessica"]')).toHaveCount(0)

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
  const policyRules = page.locator('.initial-consult-booking-policy__rules')
  const policyAgreement = page.locator('.initial-consult-booking-policy__agreement')
  const policyBody = policyRules.locator('p').first()
  const [sidebarBox, calendarBox, policyRulesBox, policyAgreementBox] = await Promise.all([
    sidebar.boundingBox(),
    calendar.boundingBox(),
    policyRules.boundingBox(),
    policyAgreement.boundingBox()
  ])

  expect(sidebarBox?.x).toBeLessThan(calendarBox?.x ?? 0)
  expect(Math.abs((sidebarBox?.y ?? 0) - (calendarBox?.y ?? 0))).toBeLessThan(1)
  expect(await headshot.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  expect(await policyBody.evaluate(element => getComputedStyle(element).fontSize)).toBe('13px')
  expect((policyAgreementBox?.y ?? 0) - ((policyRulesBox?.y ?? 0) + (policyRulesBox?.height ?? 0)))
    .toBeGreaterThanOrEqual(32)
})

test('requires a method choice, supports radio keyboard navigation and switches all eight native paths', async ({ page }) => {
  await page.route(/https:\/\/.*\.cal\.com\//, route => route.abort())
  await page.goto('/?mode=separate', { waitUntil: 'domcontentloaded' })
  const embed = page.locator('.calcom-booking-embed__frame')
  await expect(embed).toHaveCount(0)
  await page.locator('[data-consultant-id="first-available"]').click()
  await expect(embed).toHaveCount(0)
  const phone = page.getByRole('radio', { name: 'Phone call', exact: false })
  const zoom = page.getByRole('radio', { name: 'Zoom', exact: false })
  await expect(phone).toBeFocused()
  await expect(phone).not.toBeChecked()
  await phone.press('Space')
  await expect(phone).toBeChecked()
  await expect(embed).toHaveAttribute('data-calcom-event-path', 'initial-consults/initial-consult-phone')
  await phone.press('ArrowRight')
  await expect(zoom).toBeChecked()
  await expect(zoom).toBeFocused()
  await expect(embed).toHaveAttribute('data-calcom-event-path', 'initial-consults/initial-consult')

  for (const [id, zoomPath] of expectedEvents) {
    if (id !== 'first-available') {
      await page.getByRole('button', { name: 'Change consultant' }).click()
      await page.locator(`[data-consultant-id="${id}"]`).click()
      await expect(zoom).toBeChecked()
    }
    await phone.check()
    await expect(embed).toHaveCount(1)
    await expect(embed).toHaveAttribute('data-calcom-event-path', `${zoomPath}-phone`)
    await expect(page.locator('.consultant-selection-summary__details')).toContainText('Phone call')
    await zoom.check()
    await expect(embed).toHaveCount(1)
    await expect(embed).toHaveAttribute('data-calcom-event-path', zoomPath)
    await expect(page.locator('.consultant-selection-summary__details')).toContainText('Zoom')
  }
})

test('keeps separate meeting choices above the calendar on mobile', async ({ page }) => {
  await page.route(/https:\/\/.*\.cal\.com\//, route => route.abort())
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?mode=separate', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-consultant-id="taj"]').click()
  await expect(page.locator('.calcom-booking-embed__frame')).toHaveCount(0)
  await page.getByRole('radio', { name: 'Phone call', exact: false }).check()
  const [methodBox, calendarBox] = await Promise.all([
    page.locator('.meeting-method-selector').boundingBox(),
    page.locator('.initial-consult-booking-page__calendar').boundingBox()
  ])
  expect((methodBox?.y ?? 0) + (methodBox?.height ?? 0)).toBeLessThanOrEqual(calendarBox?.y ?? 0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})
