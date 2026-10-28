import { effectScope } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useApplicationSubmission } from '../app/composables/useApplicationSubmission'
import { usePortalFormSubmissionOptions } from '../app/composables/usePortalFormSubmissionOptions'
import { fetchCoBrandedPageConfig } from '../app/services/co-branded-page-api'
import { verifyAdminIntakeSlug } from '../app/services/admin-intake-api'
import { getPublicWebinar, getPublicWebinars } from '../app/services/webinar-catalog-api'
import { prepareWebsiteMarketingSubmission } from '../app/services/marketing-origin'
import {
  DEFAULT_PORTAL_REQUEST_TIMEOUT_MS,
  fetchFromPortal,
  getPortalRouteErrorDetails,
  getPortalSubmissionErrorMessage,
  normalizePortalApiBaseUrl,
  PortalApiConfigurationError,
  PortalRequestError,
  submitToPortal,
  websitePortalFetcher,
  type PortalFetchOptions,
  type PortalGetFetchOptions,
  type PortalRequestOptions
} from '../app/services/portal-api'

vi.mock('../app/services/marketing-origin', () => ({ prepareWebsiteMarketingSubmission: vi.fn(async (_endpoint, body) => ({ body, complete: vi.fn() })) }))

const origin = 'https://portal.solagree.test'
const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}
const post = (fetcher: <T>(request: string, options: PortalFetchOptions<unknown>) => Promise<T>, options: PortalRequestOptions = {}) => submitToPortal({
  ...options, portalApiBaseUrl: origin, fetcher,
  endpoint: '/api/contact-submissions', payload: { name: 'Fixture Applicant' },
  parseSuccess: response => 'submissionId' in response ? response : null
})
const waitForAttempt = async () => { await Promise.resolve(); await Promise.resolve() }

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Portal origin configuration', () => {
  it.each([
    ['https://portal.example', 'https://portal.example'],
    [' https://portal.example/ ', 'https://portal.example'],
    ['HTTPS://PORTAL.EXAMPLE:443/', 'https://portal.example'],
    ['http://localhost:3000/', 'http://localhost:3000'],
    ['http://[::1]:3000', 'http://[::1]:3000']
  ])('normalizes %s to the origin', (value, expected) => {
    expect(normalizePortalApiBaseUrl(value)).toBe(expected)
  })

  it.each([
    '', '   ', 'portal.example', '//portal.example', '/api', 'not a url',
    'ftp://portal.example', 'javascript:alert(1)', 'https://',
    'https://portal.example/api', 'https://portal.example/api/',
    'https://portal.example//', 'https://portal.example/.', 'https://portal.example/%2e',
    'https://portal.example?foo=bar', 'https://portal.example/?foo=bar', 'https://portal.example?',
    'https://portal.example#fragment', 'https://portal.example/#fragment', 'https://portal.example#',
    'https://user@portal.example', 'https://user:password@portal.example/', 'https://@portal.example',
    'https://portal.example\\api', 'https:\\portal.example', 'https://portal.example:bad'
  ])('rejects %s with a clear configuration error', (value) => {
    expect(() => normalizePortalApiBaseUrl(value)).toThrow(PortalApiConfigurationError)
    expect(() => normalizePortalApiBaseUrl(value)).toThrow(/NUXT_PUBLIC_PORTAL_API_BASE_URL/)
  })

  it('rejects a configured API path before sending any request', async () => {
    const fetcher = vi.fn()
    await expect(submitToPortal({
      portalApiBaseUrl: `${origin}/api`, fetcher, endpoint: '/api/contact-submissions', payload: {}, parseSuccess: () => ({})
    })).rejects.toBeInstanceOf(PortalApiConfigurationError)
    expect(fetcher).not.toHaveBeenCalled()
  })
})

describe('one-attempt Portal lifecycle', () => {
  it('rejects a pre-aborted signal before invoking a GET fetcher', async () => {
    const controller = new AbortController()
    controller.abort('fixture cancellation')
    const fetcher = vi.fn()
    await expect(fetchFromPortal(origin, { fetcher, signal: controller.signal })).rejects.toMatchObject({ kind: 'aborted' })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('aborts an in-flight request even if the injected fetcher ignores its signal', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const remove = vi.spyOn(controller.signal, 'removeEventListener')
    const pending = deferred<never>()
    const fetcher = vi.fn((_request: string, _options?: PortalGetFetchOptions) => pending.promise)
    const outcome = fetchFromPortal(origin, { fetcher, signal: controller.signal }).catch(error => error)
    await waitForAttempt()
    controller.abort()
    const error = await outcome
    expect(error).toBeInstanceOf(PortalRequestError)
    expect(error.kind).toBe('aborted')
    expect(fetcher.mock.calls[0]?.[1]?.signal?.aborted).toBe(true)
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function))
    expect(vi.getTimerCount()).toBe(0)
    // A late rejection remains observed and cannot replace the settled result.
    pending.reject(new Error('late failure'))
    await waitForAttempt()
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('bounds the default deadline and keeps a timed-out POST outcome ambiguous', async () => {
    vi.useFakeTimers()
    const pending = deferred<never>()
    const fetcher = vi.fn((_request: string, _options: PortalFetchOptions<unknown>) => pending.promise)
    const outcome = post(fetcher).catch(error => error)
    await vi.advanceTimersByTimeAsync(DEFAULT_PORTAL_REQUEST_TIMEOUT_MS - 1)
    expect(fetcher.mock.calls[0]?.[1].signal?.aborted).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    const error = await outcome
    expect(error).toMatchObject({ kind: 'timeout' })
    expect(error).not.toHaveProperty('accepted')
    expect(getPortalSubmissionErrorMessage(error)).toContain('could not confirm whether it was received')
    expect(fetcher.mock.calls[0]?.[1]).toMatchObject({ method: 'POST', retry: 0 })
    expect(fetcher.mock.calls[0]?.[1].signal?.aborted).toBe(true)
    await vi.advanceTimersByTimeAsync(60_000)
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
    pending.reject(new Error('late network failure'))
    await waitForAttempt()
  })

  it.each([0, -1, NaN, Infinity, 60_001])('rejects an unbounded/invalid timeout %s before fetching', async (timeoutMs) => {
    const fetcher = vi.fn()
    await expect(post(fetcher, { timeoutMs })).rejects.toBeInstanceOf(PortalApiConfigurationError)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it.each(['resolve', 'reject'] as const)('cleans the caller listener and timer after %s', async (outcome) => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const add = vi.spyOn(controller.signal, 'addEventListener')
    const remove = vi.spyOn(controller.signal, 'removeEventListener')
    const error = Object.assign(new Error('Upstream failure'), { statusCode: 503 })
    const fetcher = vi.fn(async () => {
      if (outcome === 'reject') throw error
      return { submissionId: 'fixture' } as never
    })
    const result = await post(fetcher, { signal: controller.signal }).catch(value => value)
    expect(result).toEqual(outcome === 'resolve' ? { submissionId: 'fixture' } : error)
    expect(add).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledWith('abort', add.mock.calls[0]?.[1])
    expect(vi.getTimerCount()).toBe(0)
    controller.abort()
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['network', new TypeError('fetch failed')],
    ['aborted', new DOMException('Aborted', 'AbortError')],
    ['aborted', Object.assign(new Error('ofetch failure'), { cause: new DOMException('Aborted', 'AbortError') })]
  ])('classifies %s while preserving the native cause', async (kind, cause) => {
    const fetcher = vi.fn(async () => { throw cause })
    const error = await post(fetcher).catch(value => value)
    expect(error).toMatchObject({ kind, cause })
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(getPortalRouteErrorDetails(error, { fallbackStatusCode: 502, unavailableStatusMessage: 'Unavailable' }))
      .toEqual({ statusCode: 502, statusMessage: 'Unavailable' })
  })

  it('settles an active form after timeout without success or automatic resubmission', async () => {
    vi.useFakeTimers()
    const onSuccess = vi.fn()
    const fetcher = vi.fn(() => new Promise<never>(() => {}))
    const scope = effectScope()
    const submission = scope.run(() => useApplicationSubmission({
      getFormState: () => ({}), submit: () => post(fetcher, { timeoutMs: 20 }), onSuccess, getErrorMessage: getPortalSubmissionErrorMessage
    }))!
    const completed = submission.handleSubmit()
    expect(submission.submitting.value).toBe(true)
    await vi.advanceTimersByTimeAsync(20)
    await completed
    expect(submission.submitting.value).toBe(false)
    expect(submission.submissionResult.value?.message).toContain('could not confirm')
    expect(onSuccess).not.toHaveBeenCalled()
    expect(fetcher).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('composes scope cancellation with HIR-621 without publishing late UI effects', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('useRuntimeConfig', () => ({ public: { portalApiBaseUrl: origin } }))
    const scope = effectScope()
    const onSuccess = vi.fn()
    const getErrorMessage = vi.fn(getPortalSubmissionErrorMessage)
    const pending = deferred<never>()
    const fetcher = vi.fn(() => pending.promise)
    const { submission, options } = scope.run(() => {
      const options = usePortalFormSubmissionOptions()
      return {
        options,
        submission: useApplicationSubmission({
          getFormState: () => ({}), submit: () => post(fetcher, options), onSuccess, getErrorMessage
        })
      }
    })!
    const completed = submission.handleSubmit()
    await waitForAttempt()
    scope.stop()
    await completed
    expect(options.signal.aborted).toBe(true)
    expect(submission.submitting.value).toBe(true) // Retired refs keep HIR-621 semantics.
    expect(submission.submissionResult.value).toBeNull()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(getErrorMessage).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
    pending.reject(new Error('late failure'))
    await waitForAttempt()
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})

describe('Portal lookup injection', () => {
  const lookups = [
    (fetcher: typeof websitePortalFetcher, options: PortalRequestOptions) => fetchCoBrandedPageConfig({ portalApiBaseUrl: origin, slug: 'a partner', pageType: 'cdfa', fetcher, ...options }),
    (fetcher: typeof websitePortalFetcher, options: PortalRequestOptions) => verifyAdminIntakeSlug('partner', { portalApiBaseUrl: origin, fetcher, ...options }),
    (fetcher: typeof websitePortalFetcher, options: PortalRequestOptions) => getPublicWebinars(origin, fetcher, options),
    (fetcher: typeof websitePortalFetcher, options: PortalRequestOptions) => getPublicWebinar(origin, 'event', fetcher, options)
  ]

  it('co-branded configuration uses the injected fetcher and keeps the parser', async () => {
    const globalFetch = vi.fn()
    vi.stubGlobal('$fetch', globalFetch)
    const fetcher = vi.fn(async () => ({ companyName: 'Fixture Partner' } as never))
    const result = await lookups[0]!(fetcher, {})
    expect(result).toMatchObject({ companyName: 'Fixture Partner', slug: 'a partner', pageType: 'cdfa' })
    expect(fetcher).toHaveBeenCalledWith(`${origin}/api/public/cdfa-co-branded-pages/a%20partner`, { retry: 0, signal: expect.any(AbortSignal) })
    expect(globalFetch).not.toHaveBeenCalled()
  })

  it.each(lookups.map((lookup, index) => [index, lookup] as const))('lookup %s supports a bounded injected request', async (_index, lookup) => {
    vi.useFakeTimers()
    const fetcher = vi.fn(() => new Promise<never>(() => {}))
    const outcome = lookup(fetcher, { timeoutMs: 20 }).catch(error => error)
    await vi.advanceTimersByTimeAsync(20)
    expect(await outcome).toMatchObject({ kind: 'timeout' })
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('Nuxt Portal adapter', () => {
  it('passes signal and retry: 0 to both GET and POST', async () => {
    const rawFetch = vi.fn(async () => ({ ok: true, submissionId: 'fixture' }))
    vi.stubGlobal('$fetch', rawFetch)
    const controller = new AbortController()
    await websitePortalFetcher(origin, { signal: controller.signal })
    await websitePortalFetcher(`${origin}/api/contact-submissions`, { method: 'POST', body: { name: 'Fixture' }, signal: controller.signal })
    expect(rawFetch.mock.calls).toEqual([
      [origin, { signal: controller.signal, retry: 0 }],
      [`${origin}/api/contact-submissions`, { method: 'POST', body: { name: 'Fixture' }, signal: controller.signal, retry: 0 }]
    ])
  })

  it.each(['abort', 'timeout'] as const)('does not start a delayed POST after %s during attribution preparation', async (outcome) => {
    vi.useFakeTimers()
    const preparation = deferred<{ body: unknown, complete: () => void }>()
    vi.mocked(prepareWebsiteMarketingSubmission).mockReturnValueOnce(preparation.promise)
    const rawFetch = vi.fn()
    vi.stubGlobal('$fetch', rawFetch)
    const controller = new AbortController()
    const result = post(websitePortalFetcher, { timeoutMs: 20, signal: controller.signal }).catch(error => error)
    await waitForAttempt()
    if (outcome === 'abort') controller.abort()
    else await vi.advanceTimersByTimeAsync(20)
    expect(await result).toMatchObject({ kind: outcome === 'abort' ? 'aborted' : 'timeout' })
    preparation.resolve({ body: {}, complete: vi.fn() })
    await waitForAttempt()
    expect(rawFetch).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})
