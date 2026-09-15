import { expect, test, type Page } from '@playwright/test'

interface NuxtBrowserWindow extends Window {
  useNuxtApp: () => {
    $router: {
      currentRoute: {
        value: { path: string }
      }
      push: (path: string) => Promise<unknown>
    }
  }
}

const expectShell = async (page: Page, appShell: 'home' | 'internal' | 'bare'): Promise<void> => {
  const shell = page.locator('.app-shell')

  await expect(shell).toHaveClass(appShell === 'internal' ? /app-shell--internal/ : /^app-shell$/)
  await expect(page.locator('#main-content')).toHaveCount(1)
  await expect(page.locator('header.site-header')).toHaveCount(appShell === 'bare' ? 0 : 1)
}

const expectSettledRoute = async (
  page: Page,
  path: string,
  appShell: 'home' | 'internal' | 'bare'
): Promise<void> => {
  await expect(page).toHaveURL(path)
  await expect.poll(() => page.evaluate(() => {
    return (window as unknown as NuxtBrowserWindow).useNuxtApp().$router.currentRoute.value.path
  })).toBe(path)

  const destinationContent = {
    '/': '.splash-section',
    '/attorneys': '.attorney-hero-section',
    '/quiz': '.quiz-section',
    '/quiz/embed': '.quiz-section'
  }[path]

  if (destinationContent) {
    await expect(page.locator(destinationContent)).toBeVisible()
  }

  await expect(page.locator('.page-appear-enter-active, .page-appear-leave-active')).toHaveCount(0)
  await expectShell(page, appShell)
}

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === 'http://127.0.0.1:3198') {
      return route.continue()
    }

    return route.abort()
  })
})

test('keeps shell chrome synchronized across repeated SPA and history navigation', async ({ page }) => {
  await page.goto('/attorneys', { waitUntil: 'networkidle' })
  await expectSettledRoute(page, '/attorneys', 'internal')

  for (let iteration = 0; iteration < 3; iteration += 1) {
    await page.locator('a[href="/"]').first().click()
    await expectSettledRoute(page, '/', 'home')

    await page.locator('a[href="/quiz"]').first().click()
    await expectSettledRoute(page, '/quiz', 'bare')

    await page.goBack()
    await expectSettledRoute(page, '/', 'home')

    await page.goBack()
    await expectSettledRoute(page, '/attorneys', 'internal')

    await page.goForward()
    await expectSettledRoute(page, '/', 'home')

    await page.goForward()
    await expectSettledRoute(page, '/quiz', 'bare')

    await page.goBack()
    await expectSettledRoute(page, '/', 'home')

    await page.goBack()
    await expectSettledRoute(page, '/attorneys', 'internal')
  }
})

test('does not apply shell metadata from a cancelled navigation', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expectSettledRoute(page, '/', 'home')

  await page.evaluate(async () => {
    const router = (window as unknown as NuxtBrowserWindow).useNuxtApp().$router
    const cancelledNavigation = router.push('/quiz')
    const committedNavigation = router.push('/attorneys')

    await Promise.allSettled([cancelledNavigation, committedNavigation])
  })

  await expectSettledRoute(page, '/attorneys', 'internal')
})

test('renders the quiz embed with bare chrome on direct entry', async ({ page }) => {
  await page.goto('/quiz/embed', { waitUntil: 'networkidle' })

  await expectSettledRoute(page, '/quiz/embed', 'bare')
})
