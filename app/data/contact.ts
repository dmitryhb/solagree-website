import type { ContactPerson, DirectContactItem } from '~/types/contact'

export const contactPerson: ContactPerson = {
  name: 'Name of Person',
  role: 'Head of Client Services',
  email: 'support@solagree.com',
  phone: '+1 999-999-99',
  imageSrc: '/images/contact-person.png'
}

export const directContactItems: DirectContactItem[] = [
  {
    title: 'Call',
    detail: '+1 (800) 123-4567',
    actionLabel: 'Call Us',
    href: 'tel:+18001234567',
    iconSrc: '/images/faster-resolution.png'
  },
  {
    title: 'Email',
    detail: 'support@solagree.com',
    actionLabel: 'Email Us',
    href: 'mailto:support@solagree.com',
    iconSrc: '/images/flatfree-pricing.png'
  },
  {
    title: 'Open Hours',
    detail: 'Monday-Friday: 9:00 AM - 6:00 PM (Eastern)',
    actionLabel: 'Call Us',
    href: 'tel:+18001234567',
    iconSrc: '/images/binding-commitment.png'
  }
]
