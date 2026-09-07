import { expect, test, type Page } from '@playwright/test'

const qualifierPath = '/partner-tools/case-qualifier-7h3m9k'

const selectCriteria = async (page: Page, count: number): Promise<void> => {
  await expect(page.locator('[data-case-qualifier-ready="true"]')).toBeVisible()
  const criteria = page.getByRole('checkbox')

  for (let index = 0; index < count; index += 1) {
    await criteria.nth(index).check()
  }
}

test('homepage keeps the consumer quiz and does not expose the partner qualifier', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'See if Solagree is right for you.' })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Where will your divorce be filed?' })).toBeVisible()
  await expect(page.getByText('The Case Qualifier', { exact: true })).toHaveCount(0)
})

test('the public /quiz route keeps the consumer questionnaire', async ({ page }) => {
  await page.goto('/quiz')

  await expect(page.getByRole('group', { name: 'Where will your divorce be filed?' })).toBeVisible()
  await expect(page.getByRole('checkbox')).toHaveCount(0)
})

test('the unlisted partner route renders the live qualifier and is noindex', async ({ page }) => {
  await page.goto(qualifierPath)
  await selectCriteria(page, 3)

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  await expect(page.getByTestId('case-qualifier-score')).toHaveText('3')
  await expect(page.getByRole('heading', { name: 'Introduce the Solagree Track' })).toBeVisible()
  await expect(page.getByText('Good Fit — Move Forward', { exact: true })).toBeVisible()
})

test('qualifier state uses its own storage key', async ({ page }) => {
  await page.goto(qualifierPath)
  await selectCriteria(page, 1)

  await expect.poll(async () => page.evaluate(() => {
    return window.localStorage.getItem('solagree.case-qualifier.session.v1')
  })).not.toBeNull()
  await expect.poll(async () => page.evaluate(() => {
    return window.localStorage.getItem('solagree.quiz.session.v1')
  })).toBeNull()
})
