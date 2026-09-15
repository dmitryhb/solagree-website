import { expect, test, type Page } from '@playwright/test'

interface CapturedPageView {
  pageLocation: string
  pagePath: string
  pageTitle: string
  renderedTitle: string
}

const capturePageViews = async (page: Page): Promise<CapturedPageView[]> => {
  return page.evaluate(() => {
    const captureWindow = window as typeof window & {
      __hir607PageViews?: CapturedPageView[]
    }

    return captureWindow.__hir607PageViews ?? []
  })
}

const clearPageViews = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const captureWindow = window as typeof window & {
      __hir607PageViews?: CapturedPageView[]
    }

    captureWindow.__hir607PageViews?.splice(0)
  })
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

    const captureWindow = window as typeof window & {
      __hir607PageViews?: CapturedPageView[]
      dataLayer?: unknown[]
    }

    captureWindow.__hir607PageViews = pageViews
    captureWindow.dataLayer = dataLayer
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

test('keeps only the final settled page view during rapid SPA navigation', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expectPageView(page, '/', 'Virtual Flat-Fee Divorce Without Court | Solagree')
  await clearPageViews(page)

  await page.evaluate(() => {
    const attorneyLink = document.querySelector<HTMLAnchorElement>('a[href="/attorneys"]')
    const cdfaLink = document.querySelector<HTMLAnchorElement>('a[href="/cdfa"]')

    attorneyLink?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    cdfaLink?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  })

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
