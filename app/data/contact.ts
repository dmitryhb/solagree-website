import type { ContactPerson, DirectContactItem } from '~/types/contact'

export const contactPerson: ContactPerson = {
  name: 'Name of Person',
  role: 'Head of Client Services',
  email: 'support@solagree.com',
  phone: '',
  imageSrc: '/images/contact-person.webp'
}

export const directContactItems: DirectContactItem[] = [
  {
    title: 'Schedule a Consult',
    detail: '',
    actionLabel: 'Book',
    href: '/book-a-solagree-consult',
    iconSrc: '/images/faster-resolution.webp'
  },
  {
    title: 'Email',
    detail: 'support@solagree.com',
    actionLabel: 'Email Us',
    href: 'mailto:support@solagree.com',
    iconSrc: '/images/flatfree-pricing.webp'
  },
  {
    title: 'Open Hours',
    detail: 'Monday-Friday: 9:00 AM - 6:00 PM (Eastern)',
    actionLabel: 'Call Us',
    href: 'tel:+18001234567',
    iconSrc: '/images/binding-commitment.webp'
  }
]
