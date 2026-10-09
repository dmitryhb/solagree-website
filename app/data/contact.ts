import type { ContactPerson, DirectContactItem } from '~/types/contact'

export const contactEmail = 'support@solagree.com'

export const contactPerson: ContactPerson = {
  name: 'Courtney Lutz-McLellan',
  role: 'Co-Founder & CDFA®',
  email: contactEmail,
  phone: '',
  imageSrc: '/images/lutz-mclellan.jpg'
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
    detail: contactEmail,
    actionLabel: 'Email Us',
    href: `mailto:${contactEmail}`,
    iconSrc: '/images/flatfree-pricing.webp'
  },
  {
    title: 'Open Hours',
    detail: 'Monday-Friday: 9:00 AM - 6:00 PM (Eastern)',
    actionLabel: 'Contact us',
    href: '#contact-form',
    iconSrc: '/images/binding-commitment.webp'
  }
]
