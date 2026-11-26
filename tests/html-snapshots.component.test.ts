import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { computed, defineComponent, h, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BaseAccordion from '../app/components/BaseAccordion.vue'
import CommonQuestionsSection from '../app/components/CommonQuestionsSection.vue'
import CoBrandedConsultModal from '../app/components/co-branded/CoBrandedConsultModal.vue'
import CoBrandedPageRenderer from '../app/components/co-branded/CoBrandedPageRenderer.vue'
import FormResultMessage from '../app/components/FormResultMessage.vue'
import SiteFooter from '../app/components/SiteFooter.vue'
import SiteFormSubmit from '../app/components/SiteFormSubmit.vue'
import { useApplicationSubmission } from '../app/composables/useApplicationSubmission'
import { useGoogleAnalytics } from '../app/composables/useGoogleAnalytics'
import { useSourceUrl } from '../app/composables/useSourceUrl'
import { submitCoBrandedConsultRequest } from '../app/services/consult-request-api'
import type { CoBrandedPagePublicConfig } from '../shared/types/co-branded-page'

// Characterization snapshots for the components later refactor waves will split (HIR-735).
// A snapshot diff means rendered markup changed: review it as a behavior change, not as noise.

vi.mock('~/services/consult-request-api', async () => {
  const actual = await vi.importActual<typeof import('../app/services/consult-request-api')>('~/services/consult-request-api')
  return {
    getConsultRequestSubmissionErrorMessage: actual.getConsultRequestSubmissionErrorMessage,
    submitCoBrandedConsultRequest: vi.fn()
  }
})
const submitConsultMock = vi.mocked(submitCoBrandedConsultRequest)

Object.assign(globalThis, {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  useApplicationSubmission,
  useGoogleAnalytics,
  useRuntimeConfig: () => ({ public: { portalApiBaseUrl: 'https://portal.solagree.test', gaMeasurementId: 'G-TEST' } }),
  useSourceUrl,
  usePortalLoginHref: () => 'https://portal.example.com',
  watch
})

const linkStub = { props: ['to'], template: '<a :href="to"><slot /></a>' }
const appear = { mounted: () => undefined }

const createConfig = (pageType: 'standard' | 'cdfa'): CoBrandedPagePublicConfig => ({
  pageType,
  slug: 'qa-fixture',
  templateId: pageType === 'cdfa' ? 'cdfa-basic-v1' : 'solagree-basic-v1',
  companyName: 'Rivera Mediation',
  attorneyName: 'Jamie Rivera',
  firmName: 'Rivera Mediation LLC',
  phoneNumber: '415-555-1234',
  emailAddress: 'jamie@rivera.test',
  logoUrl: 'https://portal.solagree.test/uploads/rivera-logo.png',
  ctaUrl: '/go/qa-fixture?consult=1'
})

const ConsultModalStub = defineComponent({
  name: 'CoBrandedConsultModal',
  props: { open: Boolean, companyName: String, partnerSlug: String, pageType: String },
  render() { return h('div', { class: 'consult-modal-stub', 'data-open': String(this.open), 'data-page-type': this.pageType }) }
})

/** Renders every accordion item with its slots, which is all BaseAccordion's own markup depends on. */
const AccordionStub = defineComponent({
  props: { items: { type: Array, required: true }, defaultValue: String },
  setup(props, { slots }) {
    return () => h('div', { class: 'u-accordion-stub', 'data-default-value': props.defaultValue },
      (props.items as Array<{ value: string }>).map((item, index) => h('section', { 'data-value': item.value }, [
        h('header', [slots.default?.({ item, index }), slots.trailing?.({ open: item.value === props.defaultValue })]),
        h('div', slots.body?.({ item }))
      ])))
  }
})

describe('CoBrandedPageRenderer HTML', () => {
  it.each([
    ['standard', 'page'],
    ['standard', 'embed'],
    ['cdfa', 'page'],
    ['cdfa', 'embed']
  ] as const)('pageType %s in %s mode', (pageType, mode) => {
    const wrapper = mount(CoBrandedPageRenderer, {
      props: { config: createConfig(pageType), mode },
      global: { stubs: { CoBrandedConsultModal: ConsultModalStub, NuxtLink: linkStub, SiteButton: linkStub } }
    })
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

describe('CoBrandedConsultModal HTML', () => {
  const mountModal = (open: boolean) => mount(CoBrandedConsultModal, {
    attachTo: document.body,
    props: { open, companyName: 'Rivera Mediation', partnerSlug: 'rivera-mediation', pageType: 'standard' },
    global: { components: { FormResultMessage, SiteFormSubmit }, stubs: { FormSmsOptInField: true } }
  })
  const modalHtml = () => {
    const root = document.querySelector('.co-branded-consult-modal')
    if (!root) throw new Error('Modal is not rendered')
    return new DOMWrapper(root).html()
  }

  beforeEach(() => { submitConsultMock.mockReset(); window.gtag = vi.fn() })
  afterEach(() => { delete window.gtag; document.body.style.overflow = ''; document.body.innerHTML = '' })

  it('open form', async () => {
    const wrapper = mountModal(false)
    await wrapper.setProps({ open: true })
    await flushPromises()
    expect(modalHtml()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('success state', async () => {
    submitConsultMock.mockResolvedValueOnce({} as Awaited<ReturnType<typeof submitCoBrandedConsultRequest>>)
    const wrapper = mountModal(false)
    await wrapper.setProps({ open: true })
    await flushPromises()
    for (const [selector, value] of [
      ['#co-branded-first-name', 'Avery'], ['#co-branded-last-name', 'Quinn'], ['#co-branded-email', 'avery@example.com'],
      ['#co-branded-spouse-first-name', 'Rowan'], ['#co-branded-spouse-last-name', 'Quinn']
    ] as const) {
      await new DOMWrapper(document.querySelector<HTMLInputElement>(selector)!).setValue(value)
    }
    await new DOMWrapper(document.querySelector('form')!).trigger('submit')
    await flushPromises()
    expect(modalHtml()).toMatchSnapshot()
    wrapper.unmount()
  })
})

describe('SiteFooter HTML', () => {
  it('with the network chooser dialog open', async () => {
    const wrapper = mount(SiteFooter, {
      attachTo: document.body,
      global: { stubs: { NuxtLink: linkStub, SiteButton: linkStub, Teleport: true, Transition: false } }
    })
    await wrapper.get('.site-footer__link-button').trigger('click')
    await flushPromises()
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
    document.body.style.overflow = ''
  })
})

describe('CommonQuestionsSection', () => {
  const mountSection = () => mount(CommonQuestionsSection, {
    global: {
      components: { BaseAccordion },
      directives: { appear },
      stubs: { SiteButton: linkStub, UAccordion: AccordionStub }
    }
  })

  it('HTML', () => {
    const wrapper = mountSection()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('keeps its copy and both consultation links', () => {
    const wrapper = mountSection()
    expect(wrapper.get('#common-questions-title').text()).toBe('Common Questions')
    expect(wrapper.findAll('.base-accordion__label').map(label => label.text().replace(/\s+/g, ' '))).toEqual([
      '1. How do I get my spouse to agree?',
      '2. How is Solagree Different?',
      '3. Do we both need attorneys?',
      '4. Is the arbitration binding?'
    ])
    const links = wrapper.findAll('.base-accordion__text a')
    expect(links.map(link => [link.text(), link.attributes('href')])).toEqual([
      ['Schedule a consultation', '/book-a-solagree-consult'],
      ['request one here', '/book-a-solagree-consult']
    ])
    expect(wrapper.get('.common-questions-section__cta').attributes('href')).toBe('#quiz')
  })
})
