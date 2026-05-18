import type { AttorneyPartnerPath } from '~/types/attorney-landing'

export const attorneyPartnerPaths = [
  {
    title: 'Receive Client Referrals',
    description: 'Get matched with Solagree clients who need consultation or representation in your state.',
    details: [
      'Act as an Independent advisor',
      'Get a new client pipeline with zero marketing spend.'
    ]
  },
  {
    title: 'Join as a Qualified Neutral',
    description: 'Serve as a certified mediator or arbitrator for Solagree cases.',
    details: [
      'Act as a Neutral professional',
      'Work in structured, high-efficiency blocks.'
    ]
  },
  {
    title: 'Bring Your Own Clients',
    description: 'Guide your clients through the Solagree process as their advisor. Set your own fees.',
    details: [
      'Act as a Strategic advisor',
      'Focus on strategy, not endless discovery.'
    ]
  }
] satisfies AttorneyPartnerPath[]
