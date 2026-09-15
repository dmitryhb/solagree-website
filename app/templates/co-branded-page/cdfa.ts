import type { CoBrandedPageVariantContent } from '~/types/co-branded-page'

export const cdfaCoBrandedPageContent = {
  hero: {
    eyebrow: 'A Smarter Way to Divorce',
    titleLines: ['A Financial-First Path', 'Divorce Resolution'],
    description: 'We partner with Solagree to offer you a complete divorce resolution process – starting with financial clarity, supported by expert mediation, and finalized through binding arbitration.'
  },
  whatIsDescription: 'A virtual alternative to traditional court litigation that puts financial clarity first – even when you don\'t agree on everything.',
  guideLede: 'We lead the financial foundation and work alongside you through every phase of the Solagree process:',
  guideItems: [
    { title: 'Before you start', description: 'Ensuring you understand the process and answering your questions' },
    { title: 'Before mediation', description: 'Leading the financial analysis, organizing your documents, and building a clear picture of your finances and options' },
    { title: 'Before arbitration', description: 'Reviewing what we\'ve gathered, identifying key issues, and helping you prepare for productive conversations' },
    { title: 'After resolution', description: 'Continuing to provide financial guidance to help you implement your settlement and plan for your future' }
  ],
  trackFeatures: [
    {
      features: [
        'Standard financial matters',
        'Cooperative parenting plans',
        'Lower-conflict situations',
        'Efficient timelines',
        'Clear next-step recommendations'
      ]
    },
    {
      features: [
        'Complex financial or business assets',
        'Challenging custody or co-parenting needs',
        'Higher-conflict situations',
        'Specialized expertise',
        'Frameworks for ongoing decision-making'
      ]
    }
  ],
  tracksClosing: 'We\'ll discuss Solagree platform fees and any additional services during your consultation.',
  questionsIntro: [
    'Solagree offers a structured alternative to traditional divorce litigation – combining expert guidance, mediation, and binding arbitration.',
    'Our process is designed for couples who want to avoid lengthy, costly court battles and reach resolution efficiently, even when you don\'t agree on everything.'
  ],
  faqs: [
    {
      question: 'How do I get my spouse to agree to Solagree?',
      paragraphs: ['Schedule a consultation to discuss the best strategy for your situation, and we’ll help you navigate next steps. Common approaches include focusing on the benefits of faster resolution and predictable costs, or connecting your spouse with their own advisor.'],
      grouped: true
    },
    {
      question: 'What if we can’t agree on everything?',
      paragraphs: ['That’s exactly why binding arbitration is built into the process. You don’t have to agree on everything to move forward. If you get stuck after mediation, a neutral arbitrator makes the final decisions. You still reach resolution—you’re not starting over with court litigation.']
    },
    {
      question: 'Why start with a CDFA® instead of going straight to mediation?',
      paragraphs: ['When couples have financial clarity from day one, they make better decisions and reach resolution faster. We organize your finances, identify areas of agreement, and prepare you for productive mediation. Financial understanding drives the entire process and leads to better outcomes.']
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
      question: 'What happens after the Solagree process?',
      paragraphs: ['The final agreement or arbitration award is filed with the court to make it legally binding. In most cases, no courtroom appearance is required. Your financial advisor can help you implement your post-divorce financial plan.']
    }
  ]
} as const satisfies CoBrandedPageVariantContent
