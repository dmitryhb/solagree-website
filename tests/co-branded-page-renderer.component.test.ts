import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import CoBrandedPageRenderer from '../app/components/co-branded/CoBrandedPageRenderer.vue'
import type { CoBrandedPagePublicConfig } from '../shared/types/co-branded-page'

const ConsultModalStub = defineComponent({
  name: 'CoBrandedConsultModal',
  props: {
    open: { type: Boolean, required: true },
    companyName: { type: String, required: true },
    partnerSlug: { type: String, required: true },
    pageType: { type: String, required: true }
  },
  emits: ['close'],
  template: `
    <div
      class="consult-modal-stub"
      :data-open="String(open)"
      :data-page-type="pageType"
    >
      <button class="consult-modal-close" @click="$emit('close')">Close</button>
    </div>
  `
})

const createConfig = (pageType: 'standard' | 'cdfa' = 'standard'): CoBrandedPagePublicConfig => ({
  pageType,
  slug: 'qa-fixture',
  templateId: pageType === 'cdfa' ? 'cdfa-basic-v1' : 'solagree-basic-v1',
  companyName: 'Rivera Mediation',
  attorneyName: 'Jamie Rivera',
  firmName: 'Rivera Mediation LLC',
  phoneNumber: '415-555-1234',
  emailAddress: 'jamie@rivera.test',
  logoUrl: 'https://portal.solagree.test/uploads/rivera-logo.png',
  ctaUrl: '/book-an-attorney-consult?ref=qa-fixture'
})

const mountRenderer = (
  config: CoBrandedPagePublicConfig,
  mode: 'page' | 'embed' = 'page'
) => mount(CoBrandedPageRenderer, {
  props: { config, mode },
  global: {
    stubs: { CoBrandedConsultModal: ConsultModalStub }
  }
})

describe('CoBrandedPageRenderer', () => {
  it.each([
    ['standard', 'A Better Way Forward', 'A Structured Path to'],
    ['cdfa', 'A Smarter Way to Divorce', 'A Financial-First Path']
  ] as const)('renders approved %s content and the five consultation links', (pageType, eyebrow, title) => {
    const wrapper = mountRenderer(createConfig(pageType))
    const consultationLinks = wrapper.findAll('.co-branded-page__primary-cta')

    expect(wrapper.text()).toContain(eyebrow)
    expect(wrapper.text()).toContain(title)
    expect(consultationLinks).toHaveLength(5)

    for (const link of consultationLinks) {
      expect(link.text()).toContain('Request a Consultation')
      expect(link.attributes('href')).toBe('/book-an-attorney-consult?ref=qa-fixture')
    }
  })

  it('uses pageType when templateId contains a stale cross-variant value', () => {
    const config = {
      ...createConfig('cdfa'),
      templateId: 'solagree-basic-v1'
    } satisfies CoBrandedPagePublicConfig
    const wrapper = mountRenderer(config)

    expect(wrapper.get('.co-branded-page').classes()).toContain('co-branded-page--cdfa')
    expect(wrapper.text()).toContain('A Smarter Way to Divorce')
    expect(wrapper.text()).not.toContain('A Better Way Forward')
  })

  it('preserves page-only partner branding, contact details, legal links, and year', () => {
    const wrapper = mountRenderer(createConfig())
    const footer = wrapper.get('.co-branded-page__footer')

    expect(wrapper.get('.co-branded-page__partner-logo').attributes()).toMatchObject({
      alt: 'Rivera Mediation',
      src: 'https://portal.solagree.test/uploads/rivera-logo.png'
    })
    expect(footer.text()).toContain('Jamie Rivera')
    expect(footer.text()).toContain('Rivera Mediation LLC')
    expect(footer.text()).toContain('Phone: 415-555-1234')
    expect(footer.text()).toContain('Email: jamie@rivera.test')
    expect(footer.text()).toContain(`© ${new Date().getFullYear()} Solagree, LLC. All Rights Reserved.`)
    expect(footer.findAll('.co-branded-page__footer-legal a').map(link => link.attributes('href'))).toEqual([
      '/legal/terms-of-service',
      '/legal/privacy-policy',
      '/legal/accessibility'
    ])
  })

  it('omits partner branding and the footer in embed mode', () => {
    const wrapper = mountRenderer(createConfig(), 'embed')

    expect(wrapper.get('.co-branded-page').classes()).toContain('co-branded-page--embed')
    expect(wrapper.find('.co-branded-page__partner-logo').exists()).toBe(false)
    expect(wrapper.find('.co-branded-page__footer').exists()).toBe(false)
  })

  it('renders partner-controlled text as text', () => {
    const unsafeName = '<script data-partner-payload>window.pwned = true</script>'
    const wrapper = mountRenderer({
      ...createConfig(),
      companyName: unsafeName,
      attorneyName: unsafeName,
      firmName: null
    })

    expect(wrapper.find('script[data-partner-payload]').exists()).toBe(false)
    expect(wrapper.text()).toContain(unsafeName)
    expect(wrapper.get('.co-branded-page__partner-logo').attributes('alt')).toBe(unsafeName)
  })

  it('opens and closes one consult modal through Vue events', async () => {
    const wrapper = mountRenderer(createConfig())
    const modal = () => wrapper.get('.consult-modal-stub')

    expect(modal().attributes('data-open')).toBe('false')

    await wrapper.get('.co-branded-page__hero-cta').trigger('click')

    expect(modal().attributes('data-open')).toBe('true')

    await wrapper.get('.consult-modal-close').trigger('click')

    expect(modal().attributes('data-open')).toBe('false')
  })

  it('keeps only one native FAQ disclosure open', async () => {
    const wrapper = mountRenderer(createConfig())
    const details = wrapper.findAll('details')

    expect(details[0]!.element.open).toBe(true)
    expect(details[1]!.element.open).toBe(false)

    details[1]!.element.open = true
    await details[1]!.trigger('toggle')
    await nextTick()

    expect(details[0]!.element.open).toBe(false)
    expect(details[1]!.element.open).toBe(true)
    expect(details[1]!.get('summary').element.tagName).toBe('SUMMARY')
  })
})
