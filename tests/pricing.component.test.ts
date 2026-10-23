import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PricingCard from '../app/components/PricingCard.vue'
import PricingSection from '../app/components/PricingSection.vue'
import FamilyLandingPage from '../app/components/family/FamilyLandingPage.vue'
import HomePage from '../app/pages/index.vue'
import { militaryPricingPlans, pricingPlans } from '../app/data/pricing-plans'
import { militaryLandingPage, specialNeedsLandingPage } from '../app/data/family-landing-pages'

const regularPrices = ['$3,500', '$4,800', '$5,990']
const militaryPrices = ['$3,150', '$4,320', '$5,390']
const globalOptions = {
  renderStubDefaultSlot: true,
  components: { PricingSection, PricingCard },
  directives: { appear: {} },
  stubs: {
    SiteButton: true,
    NuxtLink: true,
    FeatureStrip: true,
    WebinarVideoFrame: true,
    BaseAccordion: true,
    SiteFooter: true,
    SplashSection: true,
    WhatYouGetSection: true,
    HowItWorksSection: true,
    GetStartedSection: true,
    KidsSection: true,
    HomeQuizSection: true,
    CommonQuestionsSection: true,
    ForProfessionalsSection: true
  }
}

function expectPrices(wrapper: VueWrapper, military = false) {
  const cards = wrapper.findAll('.pricing-card')
  expect(cards).toHaveLength(3)
  expect(cards.map(card => card.get('.pricing-card__amount').text()))
    .toEqual(military ? militaryPrices : regularPrices)
  expect(cards.map(card => card.get('.pricing-card__cadence').text()))
    .toEqual(Array(3).fill('/ per person'))
  expect(cards[2]!.get('.pricing-card__badge').text()).toBe('Save $2,000 Each')
  expect(wrapper.findAll('.pricing-card__regular-price s').map(price => price.text()))
    .toEqual(military ? regularPrices : [])
  expect(wrapper.findAll('.pricing-card__eyebrow').map(label => label.text()))
    .toEqual(military ? Array(3).fill('Military Discount') : [])
}

beforeEach(() => {
  vi.stubGlobal('useSolagreeSeo', vi.fn())
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { siteUrl: 'https://www.solagree.com' } }))
})
afterEach(() => vi.unstubAllGlobals())

describe('Core pricing (HIR-674)', () => {
  it('keeps the approved final Military values explicit, including the extra $1 combined reduction', () => {
    expect(pricingPlans.map(plan => plan.price)).toEqual(regularPrices)
    expect(militaryPricingPlans.map(plan => plan.price)).toEqual(militaryPrices)
    expect(militaryPricingPlans.map(plan => plan.regularPrice)).toEqual(regularPrices)
    militaryPricingPlans.forEach((plan, index) => {
      const ordinary = pricingPlans[index]!
      expect(plan).not.toBe(ordinary)
      expect(plan.features).not.toBe(ordinary.features)
      for (const field of ['name', 'description', 'features', 'note', 'ctaLabel', 'ctaTo', 'featured'] as const) {
        expect(plan[field]).toEqual(ordinary[field])
      }
    })
    expect(militaryLandingPage.pricingIntro.join(' ')).toContain('at least 10%')
    expect(militaryLandingPage.pricingIntro.join(' ')).toContain('additional $1 reduction per person')
  })

  it('renders ordinary home pricing through the shared section default', () => {
    expectPrices(mount(HomePage, { global: globalOptions }))
  })

  it('isolates ordinary and Military instances and resets comparison markup when props change', async () => {
    const ordinary = mount(PricingSection, { global: globalOptions })
    const changing = mount(PricingSection, { props: { plans: militaryPricingPlans, animateCards: false }, global: globalOptions })
    expectPrices(ordinary)
    expectPrices(changing, true)
    changing.findAll('.pricing-card').forEach((card) => {
      expect(card.get('.pricing-card__regular-price').text()).toContain('Regular price:')
      expect(card.get('.pricing-card__regular-price').text()).toContain('/ per person.')
      expect(card.get('.pricing-card__current-price').text()).toContain('Military price:')
    })
    await changing.setProps({ plans: pricingPlans })
    expectPrices(changing)
    expectPrices(ordinary)
    await ordinary.setProps({ plans: militaryPricingPlans })
    expectPrices(ordinary, true)
    expectPrices(changing)
    expect(pricingPlans.every(plan => !plan.regularPrice && !plan.eyebrow)).toBe(true)
  })

  it('selects prices reactively for Military and special-needs family pages', async () => {
    const wrapper = mount(FamilyLandingPage, { props: { page: specialNeedsLandingPage }, global: globalOptions })
    expectPrices(wrapper)
    await wrapper.setProps({ page: militaryLandingPage })
    expectPrices(wrapper, true)
    await wrapper.setProps({ page: specialNeedsLandingPage })
    expectPrices(wrapper)
    expect(wrapper.text()).not.toContain('Military price:')
  })

  it('retains a supplied card CTA, benefits, description and Best for content', () => {
    const plan = { ...militaryPricingPlans[0]!, ctaLabel: 'Take the Quiz', ctaTo: '/quiz' }
    const wrapper = mount(PricingCard, { props: { plan }, global: globalOptions })
    expect(wrapper.get('.pricing-card__description').text()).toBe(plan.description)
    expect(wrapper.findAll('.pricing-card__feature').map(feature => feature.text())).toEqual(plan.features)
    expect(wrapper.get('.pricing-card__note p').text()).toBe(plan.note)
    expect(wrapper.getComponent({ name: 'SiteButton' }).attributes('to')).toBe('/quiz')
    expect(wrapper.getComponent({ name: 'SiteButton' }).text()).toBe('Take the Quiz')
  })
})
