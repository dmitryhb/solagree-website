import { expect, test, type Page } from '@playwright/test'

const fillValidForm = async (page: Page) => {
  await page.getByRole('textbox', { name: 'Full name', exact: true }).fill('Transport Fixture')
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('fixture@example.test')
  await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('415-555-1234')
  await page.getByRole('combobox', { name: 'State', exact: true }).selectOption('CA')
  await page.getByRole('combobox', { name: 'Preferred contact method', exact: true }).selectOption('email')
  await page.getByRole('combobox', { name: 'Best time of day', exact: true }).selectOption('morning')
}

test.beforeEach(async ({ page }) => {
  // All requests are local fixture requests, including this intercepted POST.
  await page.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin !== 'http://127.0.0.1:3116') await route.abort()
    else await route.continue()
  })
})

test('a hanging POST leaves pending after its deadline without retrying or claiming rejection', async ({ page }) => {
  let requests = 0
  await page.route('**/api/consult-requests', () => { requests += 1 })
  await page.clock.install()
  await page.goto('/consult?abort-fetch=1')
  await fillValidForm(page)
  await page.getByRole('button', { name: 'SEND REQUEST' }).click()
  await expect.poll(() => requests).toBe(1)
  await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true')
  await page.clock.fastForward(15_001)
  await expect(page.locator('form')).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByRole('alert')).toContainText('could not confirm whether it was received')
  await expect(page.getByRole('alert')).toBeFocused()
  await expect(page.locator('[data-abort-count]')).toHaveAttribute('data-abort-count', '1')
  await expect(page.locator('[data-settled-count]')).toHaveAttribute('data-settled-count', '1')
  await page.clock.fastForward(60_000)
  await expect(page).toHaveURL('/consult?abort-fetch=1')
  expect(requests).toBe(1)
  await expect(page.locator('[data-analytics-count]')).toHaveAttribute('data-analytics-count', '0')
})

test('disposing a pending form aborts transport and preserves the new page and focus', async ({ page }) => {
  let requests = 0
  await page.route('**/api/consult-requests', () => { requests += 1 })
  await page.goto('/consult?abort-fetch=1')
  await fillValidForm(page)
  await page.getByRole('button', { name: 'SEND REQUEST' }).click()
  await expect.poll(() => requests).toBe(1)
  await page.getByRole('link', { name: 'Leave form', exact: true }).click()
  const notes = page.getByLabel('New page notes')
  await notes.fill('Preserve this page')
  await expect(page.locator('[data-abort-count]')).toHaveAttribute('data-abort-count', '1')
  await expect(page.locator('[data-settled-count]')).toHaveAttribute('data-settled-count', '1')
  await expect(page).toHaveURL('/other')
  await expect(notes).toHaveValue('Preserve this page')
  await expect(notes).toBeFocused()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.locator('[data-analytics-count]')).toHaveAttribute('data-analytics-count', '0')
  expect(requests).toBe(1)
})

test('an active network failure shows a readable ambiguous outcome and sends no retry', async ({ page }) => {
  let requests = 0
  await page.route('**/api/consult-requests', async route => {
    requests += 1
    await route.abort('connectionfailed')
  })
  await page.goto('/consult')
  await fillValidForm(page)
  await page.getByRole('button', { name: 'SEND REQUEST' }).click()
  await expect(page.getByRole('alert')).toContainText('could not confirm whether your request was received')
  await expect(page.locator('form')).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByRole('alert')).toBeFocused()
  await expect(page).toHaveURL('/consult')
  expect(requests).toBe(1)
})
