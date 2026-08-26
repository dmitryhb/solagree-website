import type { QuizOutcomeId, QuizResultViewModel } from '~/data/quiz-types'

export const solagreeQuizResultContent = {
  'possible-fit': {
    outcome: 'possible-fit',
    gaugeLabel: 'Possible Fit',
    title: 'Possible Fit',
    body:
      'This couple may be a fit for Solagree, but could also benefit from a more open-ended structure. Common reasons include: low likelihood of agreeing on an ADR process, shorter marriages with limited property, strong funding to sustain legal bills, or a high tolerance for a longer process.',
    actionLabel: 'Consider carefully',
    tone: 'possible',
    primaryCta: {
      actionId: 'solagree-consult',
      label: 'Book an Initial Consult',
      href: '/book-a-solagree-consult'
    },
    resetLabel: 'Start Over'
  },
  'good-fit': {
    outcome: 'good-fit',
    gaugeLabel: 'Good Fit',
    title: 'Introduce the Solagree Track',
    body:
      'This client is a good candidate for Solagree. Introduce them to the structured, efficient resolution process during your consultation.',
    actionLabel: 'Good Fit — Move Forward',
    tone: 'good',
    primaryCta: {
      actionId: 'solagree-consult',
      label: 'Book an Initial Consult',
      href: '/book-a-solagree-consult'
    },
    resetLabel: 'Start Over'
  },
  'ideal-fit': {
    outcome: 'ideal-fit',
    gaugeLabel: 'Ideal Fit',
    title: 'Launch the Solagree Process',
    body:
      'This is an ideal Solagree candidate. Move forward with your Solagree package to deliver an efficient, structured resolution for your client.',
    actionLabel: 'Ideal Fit — Priority Case',
    tone: 'ideal',
    primaryCta: {
      actionId: 'solagree-consult',
      label: 'Book an Initial Consult',
      href: '/book-a-solagree-consult'
    },
    resetLabel: 'Start Over'
  }
} as const satisfies Record<QuizOutcomeId, QuizResultViewModel>
