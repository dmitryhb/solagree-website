import { expect, test, type Page, type TestInfo } from '@playwright/test'

const portalOrigin = 'http://portal.fixture'
const localOrigin = 'http://127.0.0.1:3158'
const viewportWidths = [390, 767, 768, 769, 1023, 1024, 1025, 1100, 1101, 1180, 1200, 1728]
const screenshotWidths = [390, 768, 1025, 1100, 1101, 1728]

const routeCases = [
  { name: 'attorney-page', path: '/go/rivera-mediation', pageType: 'standard' },
  { name: 'attorney-embed', path: '/go/rivera-mediation/embed', pageType: 'standard' },
  { name: 'cdfa-page', path: '/cdfa/go/rivera-mediation', pageType: 'cdfa' },
  { name: 'cdfa-embed', path: '/cdfa/go/rivera-mediation/embed', pageType: 'cdfa' }
] as const

const createPortalFixture = (pageType: 'standard' | 'cdfa') => ({
  slug: 'rivera-mediation',
  templateId: pageType === 'cdfa' ? 'cdfa-basic-v1' : 'solagree-basic-v1',
  companyName: 'Rivera Mediation',
  attorneyName: 'Jamie Rivera',
  firmName: 'Rivera Mediation LLC',
  phoneNumber: '415-555-1234',
  emailAddress: 'jamie@rivera.test',
  logoUrl: `${portalOrigin}/uploads/rivera-mediation.svg`,
  ctaUrl: pageType === 'cdfa'
    ? '/book-a-solagree-consult?ref=rivera-mediation'
    : '/book-an-attorney-consult?ref=rivera-mediation'
})

const installDeterministicPortalFixture = async (page: Page): Promise<void> => {
  await page.route('**/*', async route => {
    const requestUrl = new URL(route.request().url())

    if (requestUrl.origin === portalOrigin && requestUrl.pathname === '/uploads/rivera-mediation.svg') {
      await route.fulfill({
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="84" viewBox="0 0 360 84"><rect width="360" height="84" fill="#3f3154"/><text x="24" y="54" fill="#fff" font-family="Arial, sans-serif" font-size="32" font-weight="700">Rivera Mediation</text></svg>',
        contentType: 'image/svg+xml'
      })
      return
    }

    if (
      requestUrl.origin === portalOrigin
      && /^\/api\/public\/(?:cdfa-)?co-branded-pages\/rivera-mediation$/.test(requestUrl.pathname)
    ) {
      const pageType = requestUrl.pathname.startsWith('/api/public/cdfa-co-branded-pages/')
        ? 'cdfa'
        : 'standard'

      await route.fulfill({
        json: createPortalFixture(pageType),
        headers: { 'access-control-allow-origin': '*' }
      })
      return
    }

    if (requestUrl.origin === localOrigin || ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(requestUrl.origin)) {
      await route.continue()
      return
    }

    await route.abort()
  })
}

const waitForRenderedAssets = async (page: Page): Promise<void> => {
  const loadedFonts = await page.locator('.co-branded-page').evaluate(async renderer => {
    await document.fonts.ready

    await Promise.all(
      [...renderer.querySelectorAll<HTMLImageElement>('img')].map(async image => {
        if (!image.complete) {
          await new Promise<void>(resolve => image.addEventListener('load', () => resolve(), { once: true }))
        }

        await image.decode().catch(() => undefined)
      })
    )

    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

    return [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family.replaceAll('"', ''))
  })

  expect(loadedFonts).toEqual(expect.arrayContaining(['Lora', 'Open Sans', 'DM Sans', 'Poppins']))
}

const getHeroGeometry = async (page: Page) => page.locator('.co-branded-page__hero').evaluate(hero => {
  const bounds = (selector: string) => hero.querySelector<HTMLElement>(selector)?.getBoundingClientRect().toJSON()

  return {
    content: bounds('.co-branded-page__hero-content'),
    copy: bounds('.co-branded-page__hero-copy'),
    heading: bounds('h1'),
    image: bounds('.co-branded-page__hero-image'),
    documentScrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth
  }
})

const getRenderedBounds = async (page: Page) => page.locator('.co-branded-page').evaluate(renderer => {
  const elements = [renderer, ...renderer.querySelectorAll<HTMLElement>('*')]

  return {
    bodyScrollWidth: document.body.scrollWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    bounds: elements
      .filter(element => {
        const style = getComputedStyle(element)

        return style.display !== 'none'
          && style.visibility !== 'hidden'
          && style.contentVisibility !== 'hidden'
          && element.getClientRects().length > 0
      })
      .map(element => {
        const bounds = element.getBoundingClientRect()

        return {
          className: element.getAttribute('class') ?? '',
          id: element.id,
          tagName: element.tagName,
          left: bounds.left,
          right: bounds.right,
          width: bounds.width
        }
      })
  }
})

const expectNoRenderedHorizontalOverflow = async (page: Page): Promise<void> => {
  const geometry = await getRenderedBounds(page)
  const overflowingBounds = geometry.bounds.filter(bounds => {
    return bounds.width > 0 && (bounds.left < -1 || bounds.right > geometry.viewportWidth + 1)
  })

  // body.scrollWidth and descendant bounds expose overflow that the global
  // html/body overflow-x clipping can mask from documentElement.scrollWidth.
  expect(geometry.bodyScrollWidth).toBeLessThanOrEqual(geometry.viewportWidth)
  expect(geometry.documentScrollWidth).toBeLessThanOrEqual(geometry.viewportWidth)
  expect(overflowingBounds).toEqual([])
}

const expectHeroGeometry = async (page: Page, width: number): Promise<void> => {
  const geometry = await getHeroGeometry(page)

  expect(geometry.content).toBeDefined()
  expect(geometry.copy).toBeDefined()
  expect(geometry.heading).toBeDefined()
  expect(geometry.image).toBeDefined()
  if (width <= 1100) {
    expect(geometry.image!.top).toBeGreaterThanOrEqual(geometry.content!.bottom)
    return
  }

  expect(geometry.heading!.right).toBeLessThanOrEqual(geometry.image!.left)
  expect(geometry.copy!.right).toBeLessThanOrEqual(geometry.image!.left)
}

const saveFullPageScreenshot = async (
  page: Page,
  testInfo: TestInfo,
  routeName: string,
  width: number
): Promise<void> => {
  if (!screenshotWidths.includes(width)) {
    return
  }

  const screenshot = await page.screenshot({
    path: testInfo.outputPath(`${routeName}-${width}.png`),
    fullPage: true
  })

  // PNG IHDR stores the physical width as a four-byte big-endian integer.
  expect(screenshot.readUInt32BE(16)).toBe(width * 2)
}

for (const routeCase of routeCases) {
  test(`${routeCase.name} remains readable at responsive boundaries`, async ({ page }, testInfo) => {
    await installDeterministicPortalFixture(page)

    for (const width of viewportWidths) {
      await page.setViewportSize({ width, height: 1024 })
      await page.goto(routeCase.path, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('.co-branded-page')).toBeVisible()
      await waitForRenderedAssets(page)
      await expect(page.locator('.co-branded-page')).toHaveClass(
        routeCase.path.endsWith('/embed')
          ? /co-branded-page--embed/
          : routeCase.pageType === 'cdfa'
            ? /co-branded-page--cdfa/
            : /co-branded-page--standard/
      )
      await expectHeroGeometry(page, width)
      await expectNoRenderedHorizontalOverflow(page)
      await saveFullPageScreenshot(page, testInfo, routeCase.name, width)
    }
  })
}
