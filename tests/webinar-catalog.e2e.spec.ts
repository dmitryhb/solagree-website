import { expect, test } from '@playwright/test'

const events = [
  { id: 'public-live', title: 'Planning your next chapter', description: 'Join Anne for a practical conversation about the Solagree process.', host: 'Anne', startsAt: '2026-11-01T18:00:00Z', timeZone: 'America/New_York', format: 'live', audience: 'public', state: 'upcoming' },
  { id: 'public-recorded', title: 'A guide to structured divorce', description: 'Explore the choices available to you and your family.', host: 'Amanda', startsAt: null, timeZone: null, format: 'on_demand', audience: 'public', state: 'on_demand' },
  { id: 'public-past', title: 'Working together', description: 'Our recent session.', host: 'Anne', startsAt: '2026-01-01T18:00:00Z', timeZone: 'America/New_York', format: 'live', audience: 'public', state: 'recording_coming_soon' }
]

test('catalogue states, mobile layout, branded gate and legacy routes', async ({ page }) => {
  await page.route(/\/api\/public\/webinars(?:\/|$)/, async route => {
    const path = new URL(route.request().url()).pathname
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type' } })
      return
    }
    if (path.endsWith('/access')) {
      expect(route.request().postDataJSON()).toMatchObject({ businessEmail: 'avery@example.com', firstName: 'Avery', lastName: 'Quinn' })
      await route.fulfill({ json: { ok: true, accessPath: '/api/public/webinars/public-recorded/recording?token=fixture', expiresAt: '2026-11-01T18:15:00Z' }, headers: { 'access-control-allow-origin': '*' } })
      return
    }
    if (path.endsWith('/recording')) {
      await route.fulfill({ contentType: 'text/html', body: '<h1>Fixture recording</h1>' })
      return
    }
    const id = path.split('/').at(-1)
    await route.fulfill({ json: id === 'webinars' ? { webinars: events } : { webinar: events.find(e => e.id === id) }, headers: { 'access-control-allow-origin': '*' } })
  })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/webinars')
  await expect(page.locator('article')).toHaveCount(3)
  await expect(page.getByRole('link', { name: 'Register on Zoom' })).toHaveAttribute('href', /\/public-live\/register$/)
  await expect(page.getByText('Recording coming soon')).toBeVisible()
  await page.screenshot({ path: '/tmp/hir255-catalog-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: '/tmp/hir255-catalog-mobile.png', fullPage: true })
  await page.getByRole('link', { name: 'Watch webinar', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'A guide to structured divorce', level: 1 })).toBeVisible()
  await expect(page.locator('iframe')).toHaveCount(0)
  await page.screenshot({ path: '/tmp/hir255-detail-mobile.png', fullPage: true })
  await page.getByLabel('Business email').fill('avery@example.com')
  await page.getByLabel('First name', { exact: true }).fill('Avery')
  await page.getByLabel('Last name', { exact: true }).fill('Quinn')
  await page.getByLabel('State', { exact: true }).selectOption({ label: 'New York' })
  await page.getByRole('button', { name: 'Watch Now' }).click()
  await expect(page.locator('iframe')).toHaveAttribute('src', /\/public-recorded\/recording\?token=fixture$/)
  await expect(page.getByRole('link', { name: 'open the recording in a new tab' })).toBeVisible()
  for (const path of ['/webinar', '/webinar/cdfa']) {
    await page.goto(path)
    await expect(page.getByRole('button', { name: 'Watch Now' })).toBeVisible()
  }
})
