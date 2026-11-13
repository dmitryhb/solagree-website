import { expect, test, type Page } from '@playwright/test'

const qualifierPath = '/partner-tools/case-qualifier-7h3m9k'

const selectCriteria = async (page: Page, criterionIds: string[]): Promise<void> => {
  await expect(page.locator('[data-case-qualifier-ready="true"]')).toBeVisible()

  for (const criterionId of criterionIds) {
    await page.locator(`[data-criterion-id="${criterionId}"]`).check()
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
  await selectCriteria(page, ['cost-limitations', 'simple-estate'])

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  await expect(page.getByTestId('case-qualifier-score')).toHaveText('3')
  await expect(page.getByRole('heading', { name: 'Introduce the Solagree Track' })).toBeVisible()
  await expect(page.getByText('Good Fit — Move Forward', { exact: true })).toBeVisible()
})

test('qualifier state uses its own storage key', async ({ page }) => {
  await page.goto(qualifierPath)
  await selectCriteria(page, ['simple-estate'])

  await expect.poll(async () => page.evaluate(() => {
    return window.localStorage.getItem('solagree.case-qualifier.session.v1')
  })).not.toBeNull()
  await expect.poll(async () => page.evaluate(() => {
    return window.localStorage.getItem('solagree.quiz.session.v1')
  })).toBeNull()
})

test('criteria render in the approved order with the renamed labels', async ({ page }) => {
  await page.goto(qualifierPath)
  await expect(page.locator('[data-case-qualifier-ready="true"]')).toBeVisible()

  const ids = await page.getByRole('checkbox').evaluateAll(
    inputs => inputs.map(input => (input as HTMLInputElement).dataset.criterionId)
  )

  expect(ids[0]).toBe('cost-limitations')
  expect(ids[1]).toBe('simple-estate')
  expect(ids[9]).toBe('spouse-participation-potential')
  expect(ids).toHaveLength(12)
  await expect(page.getByText('Cost Limitations', { exact: true })).toBeVisible()
  await expect(page.getByText('Potential for Both Spouses to Participate', { exact: true })).toBeVisible()
  await expect(page.getByText('Integrity Deficit')).toHaveCount(0)
  await expect(page.getByText('Willing Participants')).toHaveCount(0)
})

test('Cost Limitations counts double and a full selection reaches 13 as Ideal Fit', async ({ page }) => {
  await page.goto(qualifierPath)
  await selectCriteria(page, ['cost-limitations'])

  await expect(page.getByTestId('case-qualifier-score')).toHaveText('2')
  await expect(page.getByText('Consider carefully', { exact: true })).toBeVisible()

  const criteria = page.getByRole('checkbox')
  const total = await criteria.count()

  for (let index = 0; index < total; index += 1) {
    await criteria.nth(index).check()
  }

  await expect(page.getByTestId('case-qualifier-score')).toHaveText('13')
  await expect(page.getByText('Ideal Fit — Priority Case', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Book an Initial Consult' })).toHaveAttribute('href', '/book-a-solagree-consult')
})

test('a legacy saved selection is restored under the renamed criteria', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'solagree.case-qualifier.session.v1',
      JSON.stringify({ version: 1, selectedCriterionIds: ['integrity-deficit', 'willing-participants'] })
    )
  })
  await page.goto(qualifierPath)
  await expect(page.locator('[data-case-qualifier-ready="true"]')).toBeVisible()

  await expect(page.locator('[data-criterion-id="cost-limitations"]')).toBeChecked()
  await expect(page.locator('[data-criterion-id="spouse-participation-potential"]')).toBeChecked()
  await expect(page.getByTestId('case-qualifier-score')).toHaveText('3')
})
