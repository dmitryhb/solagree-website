import type { ChoosePathOption } from '~/types/choose-path'

export const choosePathOptions: ChoosePathOption[] = [
  {
    title: 'Expedited',
    description:
      'Navigate the process with expert support at each phase. Designed for couples who want to move efficiently without attorney representation.',
    features: [
      'Lowest conflict situations',
      'Expert support included',
      'Most affordable option'
    ],
    ctaLabel: 'Get Started',
    ctaTo: '/quiz'
  },
  {
    title: 'Traditional',
    description:
      'For more complex situations or higher conflict. Extended mediation blocks, certified support professionals, and optional attorney representation.',
    features: [
      'Best for complex finances',
      'Extended mediation & support',
      'Optional attorney representation'
    ],
    ctaLabel: 'Get Started',
    ctaTo: '/quiz'
  }
]
