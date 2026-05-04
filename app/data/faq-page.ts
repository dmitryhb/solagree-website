import type { FaqPageContent } from '~/types/faq'

/**
 * Standalone FAQ page content kept out of the route component so navigation,
 * SEO, sitemap generation, and future content edits can reuse one source.
 */
export const faqPageContent = {
  title: 'FAQs',
  intro: 'Find answers to common questions about the Solagree process, pricing, professionals, and whether it may fit your situation.',
  documentTitle: 'Frequently Asked Questions',
  sourceLabel: 'SOLAGREE.COM',
  metaTitle: 'Frequently Asked Questions',
  metaDescription:
    'Review frequently asked questions about Solagree, including process, pricing, professionals, children, and next steps.',
  items: [
    {
      label: 'What is Solagree?',
      value: 'what-is-solagree',
      content:
        'Solagree is a structured divorce process designed to reduce conflict, cost, and uncertainty by combining guided mediation, professional support, and binding arbitration when needed.'
    },
    {
      label: 'How is Solagree different from traditional divorce?',
      value: 'different-from-traditional-divorce',
      content:
        'Traditional divorce can leave couples waiting on court timelines and repeated negotiation cycles. Solagree uses a defined process with clear phases, flat-fee pricing, and a resolution path that keeps cases moving.'
    },
    {
      label: 'Do we need to agree on everything before starting?',
      value: 'need-to-agree-before-starting',
      content:
        'No. Solagree is built for couples who may not agree on every issue but want a more structured way to reach resolution without letting the process stall.'
    },
    {
      label: 'Can Solagree help when children are involved?',
      value: 'children-involved',
      content:
        'Yes. Solagree can address child-related matters such as custody arrangements, parenting time schedules, decision-making authority, and child support, with professional support when needed.'
    },
    {
      label: 'How does flat-fee pricing work?',
      value: 'flat-fee-pricing',
      content:
        'Solagree offers transparent flat-fee pricing so couples understand the expected cost up front. The right plan depends on complexity, conflict level, and the type of support required.'
    },
    {
      label: 'Are attorneys involved?',
      value: 'attorneys-involved',
      content:
        'Attorneys may be involved depending on the path and the needs of the case. Solagree also connects clients with independent professionals for guidance and support.'
    },
    {
      label: 'Is the process online?',
      value: 'online-process',
      content:
        'Much of the Solagree process is designed to happen online, including document collection, coordination, and guided support. This helps reduce scheduling friction and unnecessary in-person steps.'
    },
    {
      label: 'How do we know if Solagree is right for us?',
      value: 'right-fit',
      content:
        'The quiz is the fastest way to understand whether Solagree may fit your situation. It asks about your goals, agreement level, complexity, and support needs.'
    }
  ]
} satisfies FaqPageContent
