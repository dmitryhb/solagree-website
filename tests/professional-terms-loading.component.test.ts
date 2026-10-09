import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, onMounted, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useProfessionalTerms } from '../app/composables/useProfessionalTerms'

const ready = { available: true, current: { documentId: 'solagree-partner-terms', version: '2026-10-06', url: 'https://solagree.com/legal/partner-terms/2026-10-06/' } }
const Harness = defineComponent({
  setup: useProfessionalTerms,
  template: `<div><p role="status">{{ status }}</p><a v-if="terms.current" :href="terms.current.url">Terms</a><button v-if="status === 'error'" @click="refresh">Retry</button></div>`
})
const setup = (fetcher: unknown) => {
  vi.stubGlobal('ref', ref)
  vi.stubGlobal('onMounted', onMounted)
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { portalApiBaseUrl: 'https://portal.example.com' } }))
  vi.stubGlobal('$fetch', fetcher)
  return mount(Harness)
}
afterEach(() => vi.unstubAllGlobals())

describe('approved terms loading', () => {
  it('starts loading, offers Retry after 503, and recovers to ready', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce({ statusCode: 503 }).mockResolvedValueOnce(ready)
    const wrapper = setup(fetcher)
    expect(wrapper.get('[role="status"]').text()).toBe('loading')
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toBe('error')
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toBe('ready')
    expect(wrapper.get('a').attributes('href')).toBe(ready.current.url)
  })
  it('uses unavailable only when the Portal explicitly says so', async () => {
    const wrapper = setup(vi.fn().mockResolvedValue({ available: false, current: null }))
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toBe('unavailable')
    expect(wrapper.find('button').exists()).toBe(false)
  })
  it.each(['javascript:alert(1)', 'http://example.com/terms'])('rejects unsafe terms URL %s', async url => {
    const wrapper = setup(vi.fn().mockResolvedValue({ ...ready, current: { ...ready.current, url } }))
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toBe('error')
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
