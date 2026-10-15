import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AdminIntakeThankYouPage from '../app/components/admin-intake/AdminIntakeThankYouPage.vue'
import LegalDocument from '../app/components/legal/LegalDocument.vue'
import { contactEmail, contactPerson, directContactItems } from '../app/data/contact'
import { legalPages } from '../app/data/legal-pages'

describe('Public contact email (HIR-659)', () => {
  it('uses the confirmed support inbox for the contact person and direct email action', () => {
    expect(contactEmail).toBe('support@solagree.com')
    expect(contactPerson.email).toBe(contactEmail)
    const emailAction = directContactItems.find(item => item.title === 'Email')
    expect(emailAction?.detail).toBe(contactEmail)
    expect(emailAction?.href).toBe(`mailto:${contactEmail}`)
  })

  it('renders the support inbox for questions after submitting intake', () => {
    const wrapper = mount(AdminIntakeThankYouPage, { global: { stubs: { SiteFooter: true } } })
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe(`mailto:${contactEmail}`)
    expect(link.text()).toBe(contactEmail)
    wrapper.unmount()
  })

  it.each([legalPages['terms-of-service'], legalPages.accessibility])('uses the support inbox in $title contact links', (page) => {
    const wrapper = mount(LegalDocument, { props: { page } })
    const emailLinks = wrapper.findAll('a[href^="mailto:"]')
    expect(emailLinks.length).toBeGreaterThan(0)
    for (const link of emailLinks) {
      expect(link.attributes('href')).toBe(`mailto:${contactEmail}`)
      expect(link.text()).toBe(contactEmail)
    }
    wrapper.unmount()
  })
})
