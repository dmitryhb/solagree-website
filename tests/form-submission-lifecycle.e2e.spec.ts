import { expect, test, type Page, type Route } from '@playwright/test'

const fillValidForm = async (page: Page) => {
  await page.getByRole('textbox', { name: 'Full name', exact: true }).fill('Fixture Applicant')
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('fixture@example.test')
  await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('415-555-1234')
  await page.getByRole('combobox', { name: 'State', exact: true }).selectOption('CA')
  await page.getByRole('combobox', { name: 'Preferred contact method', exact: true }).selectOption('email')
  await page.getByRole('combobox', { name: 'Best time of day', exact: true }).selectOption('morning')
}

const deferRequest = async (page: Page) => {
  const requests: Route[] = []
  let release!: () => void
  const gate = new Promise<void>((resolve) => { release = resolve })

  await page.route('**/api/consult-requests', async (route) => {
    requests.push(route)
    await gate
  })

  return {
    requests,
    settle: async (status: number, body: object) => {
      await requests[0]!.fulfill({ status, json: body })
      release()
      await expect(page.locator('[data-settled-count]')).toHaveAttribute('data-settled-count', '1')
      // Let the production handler and Vue render finish before checking
      // route/focus/state effects from the now-settled response.
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())))
    }
  }
}

test.beforeEach(async ({ page }) => {
  // Every request stays inside the compiled local fixture.
  await page.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin !== 'http://127.0.0.1:3116') {
      await route.abort()
      return
    }
    await route.continue()
  })
})

for (const outcome of ['success', 'error'] as const) {
  test(`leaving a pending form ignores late ${outcome} without changing the new page`, async ({ page }) => {
    const errors: Error[] = []
    page.on('pageerror', error => errors.push(error))
    const request = await deferRequest(page)
    await page.goto('/consult')
    await fillValidForm(page)
    await page.getByRole('button', { name: 'SEND REQUEST' }).click()
    await expect.poll(() => request.requests.length).toBe(1)
    await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true')

    await page.getByRole('link', { name: 'Leave form', exact: true }).click()
    const notes = page.getByLabel('New page notes')
    await notes.fill('Keep this page intact')
    await expect(notes).toBeFocused()

    await request.settle(outcome === 'success' ? 200 : 503,
      outcome === 'success' ? { requestId: 'fixture-only' } : { message: 'Fixture failure' })

    await expect(page).toHaveURL('/other')
    await expect(notes).toHaveValue('Keep this page intact')
    await expect(notes).toBeFocused()
    await expect(page.getByRole('alert')).toHaveCount(0)
    await expect(page.locator('[data-analytics-count]')).toHaveAttribute('data-analytics-count', '0')
    expect(request.requests).toHaveLength(1)
    expect(errors).toEqual([])

    await page.getByRole('link', { name: 'Open a new form' }).click()
    await expect(page.locator('form')).toHaveAttribute('aria-busy', 'false')
    await expect(page.getByRole('textbox', { name: 'Full name', exact: true })).toHaveValue('')
    await expect(page.getByRole('alert')).toHaveCount(0)
    expect(request.requests).toHaveLength(1)
  })
}

test('an active rapid double submission sends once, navigates once and focuses the success heading', async ({ page }) => {
  const request = await deferRequest(page)
  await page.goto('/consult')
  await fillValidForm(page)
  await page.locator('form').evaluate((form: HTMLFormElement) => {
    form.requestSubmit()
    form.requestSubmit()
  })
  await expect.poll(() => request.requests.length).toBe(1)
  await expect(page.getByRole('button', { name: 'SENDING...' })).toBeDisabled()
  await request.settle(200, { requestId: 'fixture-only' })

  await expect(page).toHaveURL('/book-a-solagree-consult/thank-you')
  await expect(page.getByRole('heading', { name: 'Consult request received' })).toBeFocused()
  await expect(page.locator('[data-analytics-count]')).toHaveAttribute('data-analytics-count', '1')
  expect(request.requests).toHaveLength(1)
})

test('an active failure displays and focuses its error without retrying the POST', async ({ page }) => {
  const request = await deferRequest(page)
  await page.goto('/consult')
  await fillValidForm(page)
  await page.getByRole('button', { name: 'SEND REQUEST' }).click()
  await expect.poll(() => request.requests.length).toBe(1)
  await request.settle(503, { message: 'Fixture failure' })

  await expect(page).toHaveURL('/consult')
  await expect(page.getByRole('alert')).toContainText('Fixture failure')
  await expect(page.getByRole('alert')).toBeFocused()
  await expect(page.getByRole('button', { name: 'SEND REQUEST' })).toBeEnabled()
  await expect(page.locator('form')).toHaveAttribute('aria-busy', 'false')
  expect(request.requests).toHaveLength(1)
})
