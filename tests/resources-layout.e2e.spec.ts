import { expect, test } from '@playwright/test'

const blogPath = '/blog'

test('keeps the desktop featured image inside its card without overlapping the copy', async ({ page }) => {
  for (const width of [1440, 1051, 901]) {
    await page.setViewportSize({ height: 1000, width })
    await page.goto(blogPath, { waitUntil: 'domcontentloaded' })

    const geometry = await page.locator('.blog-featured').evaluate(card => {
      const featuredImage = card.querySelector<HTMLElement>('.blog-featured__media-link')
      const media = card.querySelector<HTMLElement>('.blog-featured__media-link .blog-media')
      const content = card.querySelector<HTMLElement>('.blog-featured__content')
      const cardBounds = card.getBoundingClientRect()
      const imageBounds = featuredImage?.getBoundingClientRect()
      const mediaBounds = media?.getBoundingClientRect()
      const contentBounds = content?.getBoundingClientRect()

      return {
        card: cardBounds.toJSON(),
        content: contentBounds?.toJSON(),
        image: imageBounds?.toJSON(),
        media: mediaBounds?.toJSON(),
        scrollWidth: card.scrollWidth
      }
    })

    expect(geometry.image).toBeDefined()
    expect(geometry.media).toBeDefined()
    expect(geometry.content).toBeDefined()
    expect(geometry.image?.x).toBeGreaterThanOrEqual(geometry.card.x)
    expect(geometry.image?.right).toBeLessThanOrEqual(geometry.content?.x ?? 0)
    expect(geometry.media?.bottom).toBeCloseTo(geometry.card.bottom, 0)
    expect(geometry.content?.right).toBeLessThanOrEqual(geometry.card.right)
    expect(geometry.scrollWidth).toBeLessThanOrEqual(Math.ceil(geometry.card.width))
  }
})

test('stacks Blog media at tablet and mobile widths without horizontal overflow', async ({ page }) => {
  for (const width of [768, 390]) {
    await page.setViewportSize({ height: 1000, width })
    await page.goto(blogPath, { waitUntil: 'domcontentloaded' })

    const geometry = await page.locator('.blog-featured').evaluate(card => {
      const image = card.querySelector<HTMLElement>('.blog-featured__media-link')?.getBoundingClientRect()
      const content = card.querySelector<HTMLElement>('.blog-featured__content')?.getBoundingClientRect()

      return {
        content: content?.toJSON(),
        image: image?.toJSON(),
        scrollWidth: card.scrollWidth,
        width: card.clientWidth
      }
    })

    expect(geometry.image?.y).toBeLessThan(geometry.content?.y ?? 0)
    expect(Math.abs((geometry.image?.x ?? 0) - (geometry.content?.x ?? 0))).toBeLessThanOrEqual(1)
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width)
  }
})

test('matches the Figma Latest Article cards and exposes resource links in the footer', async ({ page }) => {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ height: 1000, width })
    await page.goto(blogPath, { waitUntil: 'domcontentloaded' })

    const cards = page.locator('.blog-card')
    await expect(cards).toHaveCount(4)
    await expect(cards.locator('.blog-card__date')).toHaveCount(0)
    await expect(cards.locator('.blog-card__category')).toHaveCount(4)

    const cardStyles = await cards.evaluateAll(items => items.map(card => {
      const media = card.querySelector<HTMLElement>('.blog-media')
      const mediaBounds = media?.getBoundingClientRect()
      const style = getComputedStyle(card)

      return {
        gap: style.gap,
        mediaAspect: mediaBounds ? mediaBounds.width / mediaBounds.height : 0,
        padding: style.padding,
        scrollWidth: card.scrollWidth,
        width: card.clientWidth
      }
    }))

    for (const card of cardStyles) {
      expect(card.padding).toBe('12px 12px 24px')
      expect(card.gap).toBe('24px')
      expect(card.mediaAspect).toBeCloseTo(608 / 358, 2)
      expect(card.scrollWidth).toBeLessThanOrEqual(card.width)
    }

    const resourcesColumn = page.locator('.site-footer__column', { hasText: 'Resources' })
    await expect(resourcesColumn.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('href', '/blog')
    await expect(resourcesColumn.getByRole('link', { name: 'News & Press', exact: true })).toHaveAttribute('href', '/news')
    await expect(resourcesColumn.getByRole('link', { name: 'Webinars & Events', exact: true })).toHaveAttribute('href', '/webinar')

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
})

test('contains decorative News publisher logos and preserves keyboard focus for long titles', async ({ page }) => {
  await page.setViewportSize({ height: 1000, width: 1440 })
  await page.goto('/news', { waitUntil: 'domcontentloaded' })

  const cards = page.locator('.news-card')
  await expect(cards).toHaveCount(4)
  await expect(cards.locator('.blog-media--contain img')).toHaveCount(4)
  await expect(cards.locator('.blog-media__fallback')).toHaveCount(0)

  expect(await cards.locator('.blog-media--contain img').evaluateAll(images => images.every(image => image.getAttribute('alt') === ''))).toBe(true)
  expect(await cards.locator('.blog-media--contain img').evaluateAll(images => images.every(image => getComputedStyle(image).objectFit === 'contain'))).toBe(true)
  expect(await cards.locator('.blog-media--contain').evaluateAll(media => media.every(item => item.scrollWidth <= item.clientWidth))).toBe(true)

  const longTitle = cards.filter({ hasText: 'Family Court Is Broken' }).locator('.news-card__title a')
  await expect(longTitle).toHaveText(/Family Court Is Broken/)
  await expect(longTitle).toHaveAttribute('href', /^https:\/\//)
  await longTitle.focus()
  await expect(longTitle).toBeFocused()
})
