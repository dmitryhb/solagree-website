import type { WebinarFeature } from '~/types/webinar'

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
