import { expect, test, type Locator, type Page } from '@playwright/test'

interface PhoneFieldExpectation {
  selector: string
  required: boolean
  validFormats: string[]
}

const unexpectedSubmissionRequests = (page: Page) => {
  const requests: string[] = []

  page.on('request', (request) => {
    if (['POST', 'PUT', 'PATCH'].includes(request.method())) {
      requests.push(`${request.method()} ${request.url()}`)
    }
  })

  return requests
}

const patternConsoleErrors = (page: Page) => {
  const errors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error' && /pattern|regular expression/i.test(message.text())) {
      errors.push(message.text())
    }
  })

  return errors
}

const waitForHydration = async (page: Page) => {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  }))
}

const expectNativePhoneValidation = async (
  input: Locator,
  expectation: PhoneFieldExpectation,
  label: string
) => {
  for (const phoneNumber of expectation.validFormats) {
    await input.fill(phoneNumber)
    await expect(input).toHaveValue(phoneNumber)

    expect(await input.evaluate((element) => {
      const validity = (element as HTMLInputElement).validity

      return {
        valid: validity.valid,
        patternMismatch: validity.patternMismatch,
        valueMissing: validity.valueMissing
      }
    }), `${label}: ${phoneNumber}`).toEqual({
      valid: true,
      patternMismatch: false,
      valueMissing: false
    })
  }

  await input.fill('abc')
  await expect(input).toHaveValue('abc')
  expect(await input.evaluate((element) => {
    const validity = (element as HTMLInputElement).validity

    return {
      valid: validity.valid,
      patternMismatch: validity.patternMismatch
    }
  }), `${label}: malformed value`).toEqual({
    valid: false,
    patternMismatch: true
  })

  await input.fill('')
  await expect(input).toHaveValue('')
  expect(await input.evaluate((element) => {
    const validity = (element as HTMLInputElement).validity

    return {
      valid: validity.valid,
      patternMismatch: validity.patternMismatch,
      valueMissing: validity.valueMissing
    }
  }), `${label}: empty value`).toEqual({
    valid: !expectation.required,
    patternMismatch: false,
    valueMissing: expectation.required
  })
}

test('application and consult phone inputs enforce their existing formats in Chromium', async ({ page }) => {
  const submissions = unexpectedSubmissionRequests(page)
  const consoleErrors = patternConsoleErrors(page)
  const cases: Array<{ path: string, phone: PhoneFieldExpectation }> = [
    {
      path: '/attorney-application',
      phone: {
        selector: '#attorney-phone',
        required: true,
        validFormats: ['1-415-555-1234', '+1 415.555 1234', '(415) 555-1234']
      }
    },
    {
      path: '/cdfa-application',
      phone: {
        selector: '#cdfa-phone',
        required: true,
        validFormats: ['415-555-1234', '(415) 555-1234']
      }
    },
    {
      path: '/book-an-attorney-consult',
      phone: {
        selector: '#consult-phone',
        required: true,
        validFormats: ['415-555-1234', '(415) 555-1234']
      }
    }
  ]

  for (const { path, phone } of cases) {
    await page.goto(path)
    await waitForHydration(page)
    const input = page.locator(phone.selector)
    await expect(input).toBeVisible()
    await expectNativePhoneValidation(input, phone, path)
  }

  expect(submissions).toEqual([])
  expect(consoleErrors).toEqual([])
})

test('co-branded consult phone inputs preserve optional native validation in Chromium', async ({ page }) => {
  const submissions = unexpectedSubmissionRequests(page)
  const consoleErrors = patternConsoleErrors(page)

  await page.route('**/api/public/*co-branded-pages/*', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        slug: 'phone-qa',
        companyName: 'QA Example',
        attorneyName: 'QA Partner',
        phoneNumber: '415-555-1234'
      })
    })
  })

  for (const path of ['/go/phone-qa', '/cdfa/go/phone-qa']) {
    await page.goto(path)
    await waitForHydration(page)
    await page.locator('.co-branded-page__hero-cta').click()

    const input = page.locator('#co-branded-phone')
    await expect(input).toBeVisible()
    await expectNativePhoneValidation(input, {
      selector: '#co-branded-phone',
      required: false,
      validFormats: ['415-555-1234', '(415) 555-1234']
    }, path)

    await page.locator('.co-branded-consult-modal__close').click()
  }

  expect(submissions).toEqual([])
  expect(consoleErrors).toEqual([])
})
