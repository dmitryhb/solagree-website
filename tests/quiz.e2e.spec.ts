import { expect, test, type Page } from '@playwright/test'

const selectCriteria = async (page: Page, count: number): Promise<void> => {
  await expect(page.locator('[data-quiz-ready="true"]')).toBeVisible()
  const criteria = page.getByRole('checkbox')

  for (let index = 0; index < count; index += 1) {
    await criteria.nth(index).check()
  }
}

test('two selected criteria produce the approved Possible Fit result', async ({ page }) => {
  await page.goto('/quiz')
  await selectCriteria(page, 2)

  await expect(page.getByTestId('quiz-score')).toHaveText('2')
  await expect(page.getByRole('heading', { name: 'Possible Fit' })).toBeVisible()
  await expect(page.getByText('Consider carefully', { exact: true })).toBeVisible()
})

test('three selected criteria produce the approved Good Fit result', async ({ page }) => {
  await page.goto('/quiz')
  await expect(page.locator('[data-quiz-ready="true"]')).toBeVisible()
  await selectCriteria(page, 3)

  await expect(page.getByTestId('quiz-score')).toHaveText('3')
  await expect(page.getByRole('heading', { name: 'Introduce the Solagree Track' })).toBeVisible()
  await expect(page.getByText('Good Fit — Move Forward', { exact: true })).toBeVisible()
})

test('six selected criteria produce the approved Ideal Fit result', async ({ page }) => {
  await page.goto('/quiz?ref=review-partner')
  await selectCriteria(page, 6)

  await expect(page.getByTestId('quiz-score')).toHaveText('6')
  await expect(page.getByRole('heading', { name: 'Launch the Solagree Process' })).toBeVisible()
  await expect(page.getByText('Ideal Fit — Priority Case', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Book an Initial Consult' }))
    .toHaveAttribute('href', '/book-a-solagree-consult?ref=review-partner')
})

test('homepage keeps the qualifier heading hierarchy', async ({ page }) => {
  await page.goto('/')
  const qualifier = page.locator('#quiz .quiz-qualifier')
  await expect(qualifier.locator('h3', { hasText: 'The Case Qualifier' })).toBeVisible()
  await expect(qualifier.locator('h4', { hasText: 'Case Assessment' })).toBeVisible()

  await selectCriteria(page, 1)
  await expect(qualifier.locator('h5', { hasText: 'Possible Fit' })).toBeVisible()
})

test('standalone and embed routes restore the same current-schema session', async ({ page }) => {
  await page.goto('/quiz')
  await selectCriteria(page, 3)
  await page.reload()

  await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(3)
  await expect(page.getByTestId('quiz-score')).toHaveText('3')

  await page.goto('/quiz/embed')
  await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(3)
  await expect(page.getByRole('heading', { name: 'Introduce the Solagree Track' })).toBeVisible()

  await page.getByRole('button', { name: 'Start Over' }).click()
  const firstCriterion = page.getByRole('checkbox').first()
  await expect(firstCriterion).toBeFocused()
  await expect(page.getByTestId('quiz-score')).toHaveText('0')
  await expect.poll(async () => page.evaluate(() => {
    return window.localStorage.getItem('solagree.quiz.session.v3')
  })).toBeNull()

  await firstCriterion.press('Space')
  await expect(firstCriterion).toBeChecked()
  await expect(page.getByTestId('quiz-score')).toHaveText('1')
})
