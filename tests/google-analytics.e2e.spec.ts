import { expect, test, type Page } from '@playwright/test'

interface CapturedPageView {
  pageLocation: string
  pagePath: string
  pageTitle: string
  renderedTitle: string
}

interface BrowserRouter {
  push: (path: string) => Promise<{ type?: number } | undefined>
}

type AnalyticsCaptureWindow = typeof window & {
  __hir607PageViews?: CapturedPageView[]
  __hir607Router?: BrowserRouter
}

const capturePageViews = async (page: Page): Promise<CapturedPageView[]> => {
  return page.evaluate(() => {
    const captureWindow = window as AnalyticsCaptureWindow

    return captureWindow.__hir607PageViews ?? []
  })
}

const clearPageViews = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const captureWindow = window as AnalyticsCaptureWindow

    captureWindow.__hir607PageViews?.splice(0)
  })
}

const navigateWithRouter = async (page: Page, target: string): Promise<number | undefined> => {
  return page.evaluate(async (targetPath) => {
    const router = (window as AnalyticsCaptureWindow).__hir607Router

    if (!router) {
      throw new Error('Nuxt router is unavailable.')
    }

    return (await router.push(targetPath))?.type
  }, target)
}

const expectPageView = async (
  page: Page,
  expectedPath: string,
  expectedTitle: string
): Promise<void> => {
  await expect.poll(() => capturePageViews(page)).toHaveLength(1)

  const [pageView] = await capturePageViews(page)

  expect(await page.title()).toBe(expectedTitle)
  expect(pageView).toEqual({
    pageLocation: `http://127.0.0.1:3197${expectedPath}`,
    pagePath: expectedPath,
    pageTitle: expectedTitle,
    renderedTitle: expectedTitle
  })
}

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === 'http://127.0.0.1:3197') {
      return route.continue()
    }

    return route.abort()
  })
  await page.addInitScript(() => {
    const pageViews: CapturedPageView[] = []
    const dataLayer: unknown[] = []
    const push = dataLayer.push.bind(dataLayer)

    dataLayer.push = (...entries: unknown[]): number => {
      for (const entry of entries) {
        const [eventType, eventName, params] = Array.from(entry as ArrayLike<unknown>)

        if (eventType === 'event' && eventName === 'page_view' && typeof params === 'object' && params !== null) {
          const pageView = params as Record<string, unknown>

          pageViews.push({
            pageLocation: String(pageView.page_location),
            pagePath: String(pageView.page_path),
            pageTitle: String(pageView.page_title),
            renderedTitle: document.title
          })
        }
      }

      return push(...entries)
    }

    const captureWindow = window as AnalyticsCaptureWindow & {
      dataLayer?: unknown[]
    }

    captureWindow.__hir607PageViews = pageViews
    captureWindow.dataLayer = dataLayer
    Object.defineProperty(captureWindow, '__hir607Router', {
      configurable: true,
      get: () => {
        const link = document.querySelector<HTMLAnchorElement>('a[href="/attorneys"]') as HTMLAnchorElement & {
          __vueParentComponent?: {
            appContext: {
              config: {
                globalProperties: {
                  $router?: BrowserRouter
                }
              }
            }
          }
        }

        return link?.__vueParentComponent?.appContext.config.globalProperties.$router
      }
    })
  })
})

test('records one direct-load page view with the rendered title and full query path', async ({ page }) => {
  await page.goto('/about-us?source=hir607', { waitUntil: 'domcontentloaded' })

  await expectPageView(page, '/about-us?source=hir607', 'About Us | Solagree')
})

test('waits for the SPA head title before recording a navigation', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expectPageView(page, '/', 'Virtual Flat-Fee Divorce Without Court | Solagree')
  await clearPageViews(page)

  await page.locator('a[href="/attorneys"]').first().click()

  await expect(page).toHaveURL('/attorneys')
  await expectPageView(page, '/attorneys', 'Attorney Partners | Solagree')
})

test('records a query-only SPA navigation after the title settles', async ({ page }) => {
  await page.goto('/faq', { waitUntil: 'domcontentloaded' })
  await expectPageView(page, '/faq', 'Frequently Asked Questions | Solagree')
  await clearPageViews(page)

  await navigateWithRouter(page, '/faq?section=professional-partners')

  await expect(page).toHaveURL('/faq?section=professional-partners')
  await expectPageView(page, '/faq?section=professional-partners', 'Frequently Asked Questions | Solagree')
})

test('records a hash-only SPA navigation after the title settles', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expectPageView(page, '/', 'Virtual Flat-Fee Divorce Without Court | Solagree')
  await clearPageViews(page)

  await navigateWithRouter(page, '/#how-it-works')

  await expect(page).toHaveURL('/#how-it-works')
  await expectPageView(page, '/#how-it-works', 'Virtual Flat-Fee Divorce Without Court | Solagree')
})

test('skips cancelled routes and keeps only the final settled rapid navigation', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expectPageView(page, '/', 'Virtual Flat-Fee Divorce Without Court | Solagree')
  await clearPageViews(page)

  const [firstNavigation] = await Promise.all([
    navigateWithRouter(page, '/attorneys'),
    navigateWithRouter(page, '/cdfa')
  ])

  expect(firstNavigation).toBe(8)
  await expect(page).toHaveURL('/cdfa')
  await expectPageView(page, '/cdfa', 'CDFA Partners | Solagree')
})

test('records the rendered title for the local error route', async ({ page }) => {
  await page.goto('/404', { waitUntil: 'domcontentloaded' })

  await expectPageView(page, '/404', 'Page Not Found | Solagree')
})

test('does not emit when the analytics function is unavailable', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expectPageView(page, '/', 'Virtual Flat-Fee Divorce Without Court | Solagree')
  await clearPageViews(page)

  await page.evaluate(() => {
    window.gtag = undefined
  })
  await page.locator('a[href="/attorneys"]').first().click()

  await expect(page).toHaveURL('/attorneys')
  await expect(page).toHaveTitle('Attorney Partners | Solagree')
  await page.waitForTimeout(100)
  expect(await capturePageViews(page)).toHaveLength(0)
})
