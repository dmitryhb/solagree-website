import type { CoBrandedPageVariantContent } from '~/types/co-branded-page'

export const attorneyCoBrandedPageContent = {
  hero: {
    eyebrow: 'A Better Way Forward',
    titleLines: ['A Structured Path to', 'Divorce Resolution'],
    description: 'We partner with Solagree to give you a virtual alternative to court litigation – with predictable platform fees and expert guidance at every phase.'
  },
  whatIsDescription: 'A flat-fee, virtual alternative to traditional divorce litigation with a structured path to resolution – even when you don\'t agree on everything.',
  guideLede: 'We work alongside the Solagree process at every phase:',
  guideItems: [
    { title: 'Before you start', description: 'Ensuring you understand the process and answering your questions' },
    { title: 'Before mediation', description: 'Reviewing expert summaries and helping prepare your strategy' },
    { title: 'Before arbitration', description: 'Helping you present your position and advising on what matters most' },
    { title: 'After resolution', description: 'Reviewing the final award and handling all court filing' }
  ],
  trackFeatures: [
    {
      features: [
        'Standard financial matters',
        'Cooperative parenting plans',
        'Lower-conflict situations',
        'Flat-fee attorney structure'
      ],
      note: 'Best for couples ready to move efficiently through the process.'
    },
    {
      features: [
        'Complex financial or business assets',
        'Challenging custody or co-parenting needs',
        'Higher-conflict situations',
        'Hourly attorney support'
      ],
      note: 'Best for cases requiring extended support and specialized expertise.'
    }
  ],
  tracksClosing: 'Solagree platform fees are separate from attorney fees. We\'ll discuss both during your consultation.',
  questionsIntro: [
    'Solagree offers a structured alternative to traditional divorce litigation - combining expert financial guidance, mediation, and binding arbitration.',
    'Our process is designed for couples who can\'t agree on everything but want to avoid lengthy court battles and reach resolution efficiently.'
  ],
  faqs: [
    {
      question: 'How do I get my spouse to agree to Solagree?',
      paragraphs: ['Here are a few approaches:'],
      bullets: [
        'Share this page so they can explore Solagree on their own',
        'Focus on the benefits - faster resolution, less conflict, predictable costs',
        'Connect them with their own advisor - We can help both spouses find appropriate professional support',
        'Schedule a consultation to discuss the best strategy for your situation, and we\'ll help you navigate next steps.'
      ],
      grouped: true
    },
    {
      question: 'Do we need attorneys?',
      paragraphs: ['While not required, we recommend both parties work with independent attorneys who can provide legal guidance throughout the process. We can refer you to network attorneys who work with Solagree.']
    },
    {
      question: 'Is the arbitration binding?',
      paragraphs: ['Yes, in most states. The arbitration award becomes a legally binding resolution that can be filed with the court without appearing.']
    },
    {
      question: 'Are payment plans available?',
      paragraphs: ['Yes. Payment plan options are available. Schedule a consultation to discuss the best payment structure for your situation.']
    },
    {
      question: 'What happens after the Solagree process?',
      paragraphs: ['The final agreement or arbitration award is filed with the court to make it legally binding. In most cases, no courtroom appearance is required.']
    }
  ]
} as const satisfies CoBrandedPageVariantContent
