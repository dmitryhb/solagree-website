import { defineComponent, h, nextTick, reactive, ref, Suspense } from 'vue'
import * as Vue from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WebinarCatalogItem } from '../app/types/webinar-catalog'

const resolveWebinarAccess = vi.fn()
vi.mock('~/services/webinar-catalog-api', async (importOriginal) => ({
  ...await importOriginal<typeof import('../app/services/webinar-catalog-api')>(),
  getPublicWebinar: vi.fn(async () => recordedWebinar),
  resolveWebinarAccess: (...args: unknown[]) => resolveWebinarAccess(...args)
}))

const recordedWebinar: WebinarCatalogItem = {
  id: 'event-1',
  title: 'Mediation basics',
  description: 'A recorded session.',
  host: 'Solagree',
  startsAt: '2026-01-15T18:00:00Z',
  timeZone: 'America/New_York',
  format: 'on_demand',
  audience: 'public',
  state: 'on_demand'
}

const route = reactive({ params: { id: 'event-1' }, fullPath: '/webinars/event-1' })
const config = { public: { portalApiBaseUrl: 'https://portal.example.test/' } }

Object.assign(globalThis, {
  ...Vue,
  useRoute: () => route,
  useRuntimeConfig: () => config,
  useSolagreeSeo: vi.fn(),
  useHead: vi.fn(),
  // Minimal Nuxt stand-in: resolves once the loader settles so the page's top-level await completes.
  useAsyncData: async (_key: unknown, loader: () => Promise<unknown>) => {
    const data = ref<unknown>(null)
    const error = ref<unknown>(null)
    const status = ref('pending')
    try { data.value = await loader(); status.value = 'success' } catch (caught) { error.value = caught; status.value = 'error' }
    return { data, error, status, refresh: vi.fn() }
  }
})

const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}
const accessFor = (token: string) => ({ ok: true, accessPath: `/api/public/webinars/event-1/recording?token=${token}`, expiresAt: '2026-12-01T00:00:00Z' })

const mountPage = async () => {
  const { default: WebinarPage } = await import('../app/pages/webinars/[id].vue')
  const wrapper = mount(defineComponent({ render: () => h(Suspense, null, { default: () => h(WebinarPage) }) }), {
    global: {
      stubs: {
        NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
        SiteFooter: { template: '<footer />' },
        WatchWebinarForm: { template: '<form data-test="watch-form" />' },
        WebinarVideoFrame: { props: ['videoSrc', 'videoTitle'], template: '<iframe data-test="frame" :src="videoSrc" />' }
      }
    }
  })
  await flushPromises()
  return wrapper
}
const navigateToHash = (hash: string) => {
  window.history.replaceState(null, '', `/webinars/event-1${hash}`)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}
const frameSrc = (wrapper: Awaited<ReturnType<typeof mountPage>>) => wrapper.find('[data-test="frame"]').attributes('src')
const recoveryMessage = (wrapper: Awaited<ReturnType<typeof mountPage>>) => wrapper.find('[role="status"]').text()

beforeEach(() => {
  route.params.id = 'event-1'
  route.fullPath = '/webinars/event-1'
  resolveWebinarAccess.mockReset()
  window.history.replaceState(null, '', '/webinars/event-1')
})
afterEach(() => { vi.restoreAllMocks() })

describe('webinar page fragment access', () => {
  it('shows the unlock form and does not call the portal when there is no fragment token', async () => {
    window.history.replaceState(null, '', '/webinars/event-1#section')
    const wrapper = await mountPage()
    expect(resolveWebinarAccess).not.toHaveBeenCalled()
    expect(wrapper.find('[data-test="watch-form"]').exists()).toBe(true)
    expect(window.location.hash).toBe('#section')
    wrapper.unmount()
  })

  it('consumes the access_token fragment, strips it with replaceState and unlocks the recording', async () => {
    window.history.replaceState({ keep: true }, '', '/webinars/event-1?source=email#access_token=opaque-token')
    const replaceState = vi.spyOn(window.history, 'replaceState')
    resolveWebinarAccess.mockResolvedValue(accessFor('opaque-token'))
    const wrapper = await mountPage()
    expect(replaceState).toHaveBeenCalledWith({ keep: true }, '', '/webinars/event-1?source=email')
    expect(window.location.hash).toBe('')
    expect(window.location.search).toBe('?source=email')
    expect(resolveWebinarAccess).toHaveBeenCalledWith('event-1', 'opaque-token', expect.objectContaining({ portalApiBaseUrl: 'https://portal.example.test/' }))
    expect(frameSrc(wrapper)).toBe('https://portal.example.test/api/public/webinars/event-1/recording?token=opaque-token')
    expect(wrapper.find('[data-test="watch-form"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows the expired-link text for a 410 response and keeps the form', async () => {
    window.history.replaceState(null, '', '/webinars/event-1#access_token=old')
    resolveWebinarAccess.mockRejectedValue({ statusCode: 410 })
    const wrapper = await mountPage()
    expect(recoveryMessage(wrapper)).toBe('This access link has expired. Submit the form below to request another viewing link.')
    expect(wrapper.find('[data-test="frame"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="watch-form"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('shows the generic verification text for other failures and for an empty token', async () => {
    const generic = 'We could not verify this access link. Submit the form below to request a new one.'
    window.history.replaceState(null, '', '/webinars/event-1#access_token=bad')
    resolveWebinarAccess.mockRejectedValue({ statusCode: 403 })
    const wrapper = await mountPage()
    expect(recoveryMessage(wrapper)).toBe(generic)

    resolveWebinarAccess.mockClear()
    navigateToHash('#access_token=')
    await flushPromises()
    expect(resolveWebinarAccess).not.toHaveBeenCalled()
    expect(recoveryMessage(wrapper)).toBe(generic)
    expect(window.location.hash).toBe('')
    wrapper.unmount()
  })

  it('ignores a stale response when a newer fragment arrives while the first request is in flight', async () => {
    const first = deferred<ReturnType<typeof accessFor>>()
    const second = deferred<ReturnType<typeof accessFor>>()
    resolveWebinarAccess.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    const wrapper = await mountPage()
    navigateToHash('#access_token=one')
    navigateToHash('#access_token=two')
    expect(resolveWebinarAccess.mock.calls.map(call => call[1])).toEqual(['one', 'two'])

    second.resolve(accessFor('two'))
    await flushPromises()
    expect(frameSrc(wrapper)).toContain('token=two')

    first.resolve(accessFor('one'))
    await flushPromises()
    expect(frameSrc(wrapper)).toContain('token=two')
    wrapper.unmount()
  })

  it('ignores a stale failure while a newer request is still in flight', async () => {
    const first = deferred<ReturnType<typeof accessFor>>()
    const second = deferred<ReturnType<typeof accessFor>>()
    resolveWebinarAccess.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    const wrapper = await mountPage()
    navigateToHash('#access_token=one')
    navigateToHash('#access_token=two')
    first.reject({ statusCode: 410 })
    await flushPromises()
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    second.resolve(accessFor('two'))
    await flushPromises()
    expect(frameSrc(wrapper)).toContain('token=two')
    wrapper.unmount()
  })

  it('ignores a response that arrives after the route moved to another webinar', async () => {
    const pending = deferred<ReturnType<typeof accessFor>>()
    resolveWebinarAccess.mockReturnValueOnce(pending.promise)
    const wrapper = await mountPage()
    navigateToHash('#access_token=one')
    route.params.id = 'event-2'
    await nextTick()
    pending.resolve(accessFor('one'))
    await flushPromises()
    expect(wrapper.find('[data-test="frame"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('does not unlock anything for a response that arrives after the page was unmounted', async () => {
    const pending = deferred<ReturnType<typeof accessFor>>()
    resolveWebinarAccess.mockReturnValueOnce(pending.promise)
    const wrapper = await mountPage()
    navigateToHash('#access_token=one')
    wrapper.unmount()
    pending.resolve(accessFor('one'))
    await flushPromises()
    expect(resolveWebinarAccess).toHaveBeenCalledTimes(1)
    expect(document.body.innerHTML).not.toContain('token=one')
  })
})
