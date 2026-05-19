import type { WebinarFeature, WebinarRegistrationContent } from '~/types/webinar'

export const webinarFeatures = [
  {
    label: 'See how much attorneys are earning - and how it works'
  },
  {
    label: 'Get referrals that are ready to move forward'
  },
  {
    label: 'Serve clients virtually across your state'
  },
  {
    label: 'Work a streamlined process that takes less of your time'
  }
] as const satisfies readonly WebinarFeature[]

export const attorneyWebinarRegistrationContent = {
  title: 'What Could Solagree Add to Your Practice?',
  summaryLabel: 'Attorney Network Overview:',
  summary:
    'More cases, more referrals, and new revenue opportunities - without adding overhead or complexity.',
  features: webinarFeatures,
  presenter: {
    imageSrc: '/images/amanda.webp',
    imageAlt: 'Amanda, Solagree co-founder',
    imageWidth: 762,
    imageHeight: 562,
    name: 'Amanda Mason',
    title: 'Co-Founder & CEO'
  },
  formSubtitle: 'Less than 10 minutes to see how it works for you.',
  formRedirectPath: '/webinar/view',
  submissionType: 'attorney_webinar'
} as const satisfies WebinarRegistrationContent

export const cdfaWebinarFeatures = [
  {
    label: 'See how much CDFAs are earning - and how the flat-rate model works'
  },
  {
    label: 'Get referrals that are ready for financial analysis'
  },
  {
    label: 'Lead the financial foundation of every case'
  },
  {
    label: 'Work a structured process with clear deliverables'
  }
] as const satisfies readonly WebinarFeature[]

export const cdfaWebinarRegistrationContent = {
  title: 'What Could Solagree Add to Your Practice?',
  summaryLabel: 'CDFA® Network Overview:',
  summary:
    'More cases, steady referrals, and predictable revenue – without adding overhead or marketing spend.',
  features: cdfaWebinarFeatures,
  presenter: {
    imageSrc: '/images/for-professionals.webp',
    imageAlt: 'Courtney Lutz-McLellan, CDFA, Solagree co-founder',
    imageWidth: 1056,
    imageHeight: 1086,
    name: 'Courtney Lutz-McLellan, CDFA®',
    title: 'Co-Founder Solagree',
    captionSeparator: '–'
  },
  formSubtitle: 'Less than 5 minutes to see how it works for you.',
  formRedirectPath: '/webinar/cdfa/view',
  submissionType: 'cdfa_webinar'
} as const satisfies WebinarRegistrationContent
