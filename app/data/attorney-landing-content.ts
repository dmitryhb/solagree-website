import { attorneyFaqItems } from '~/data/attorney-faq'
import { attorneyOnePlaceBenefits } from '~/data/attorney-benefits'
import { attorneyPartnerPaths } from '~/data/attorney-partner-paths'
import { attorneyValueCards } from '~/data/attorney-value-cards'
import { solagreeVimeoVideos } from '~/data/video-embeds'
import type {
  AttorneyFaqContent,
  AttorneyFitsPracticeContent,
  AttorneyHeroContent,
  AttorneyHowItWorksContent,
  AttorneyMoreCasesContent,
  AttorneyOnePlaceContent,
  AttorneyPartnerPathsContent,
  AttorneyValueContent
} from '~/types/attorney-landing'
import type { AccordionItem } from '~/types/accordion'

const attorneyWebinarPath = '/webinar/'
const cdfaWebinarPath = '/webinar/cdfa'

export const attorneyHeroContent = {
  eyebrow: 'A Better Way to Practice Family Law',
  titleLines: ['Expand Your Practice.', 'Reclaim Your Time.'],
  intro:
    'Receive qualified referrals in your state, explore neutral opportunities, and bring your own divorce cases - all while earning predictable revenue without adding overhead.',
  primaryCtaLabel: 'Watch the Partner Briefing',
  primaryCtaTo: attorneyWebinarPath,
  secondaryCtaLabel: 'Join the free Network',
  secondaryCtaTo: '/attorney-application',
  image: {
    src: '/images/attorney-hero.webp',
    alt: 'A professional blonde woman wearing glasses, a pinstripe blazer, and a pearl necklace smiling confidently while working on a laptop at an executive office desk.',
    width: 968,
    height: 772
  }
} satisfies AttorneyHeroContent

export const cdfaHeroContent = {
  eyebrow: 'Where Divorce Starts with the Numbers',
  titleLines: ['Financials First.', 'Build Your Practice.'],
  intro:
    'Help divorcing couples make better financial decisions from day one – with a structured process that puts your CDFA® expertise at the foundation, not fighting your way into the legal process.',
  primaryCtaLabel: 'Watch the Partner Briefing',
  primaryCtaTo: cdfaWebinarPath,
  secondaryCtaLabel: 'Join the Partner Network',
  secondaryCtaTo: '/cdfa-application',
  image: {
    src: '/images/cdfa-hero.webp',
    alt: 'A confident female professional in a grey suit jacket and glasses smiling in a brightly lit, open-concept office background.',
    width: 968,
    height: 772
  }
} satisfies AttorneyHeroContent

export const attorneyPartnerPathsContent = {
  title: 'Three Ways to Partner',
  intro: 'Choose what fits your practice - or do all three.',
  ctaLabel: 'Watch the Partner Briefing',
  ctaTo: attorneyWebinarPath,
  paths: attorneyPartnerPaths
} satisfies AttorneyPartnerPathsContent

export const cdfaPartnerPathsContent = {
  title: 'Three Ways to Partner',
  intro: 'Your financial expertise is essential, not extra.',
  ctaLabel: 'Watch the Partner Briefing',
  ctaTo: cdfaWebinarPath,
  paths: [
    {
      title: 'Receive Client Referrals',
      description:
        'Get referrals from Solagree and local attorneys for Solagree Compass cases - clients who need CDFA® expertise from day one.',
      details: ['Build your practice with qualified referrals, zero marketing spend.']
    },
    {
      title: 'Join as a Neutral Professional',
      description:
        'Work as a certified neutral for Solagree cases. Lead Phase 1 financial intake in a structured, predictable process.',
      details: ['Work is high-integrity, flat fee, clear scope.']
    },
    {
      title: 'Bring Your Own Clients',
      description:
        'Guide your existing clients through the Solagree process. We hire you at a flat rate built into the client fee structure.',
      details: ['Expand on earnings, not endless scope creep.']
    }
  ]
} satisfies AttorneyPartnerPathsContent

export const attorneyHowItWorksContent = {
  title: 'See How It Works',
  intro: 'Watch how the partnership works and what makes this different - in 90 seconds.',
  videoSrc: solagreeVimeoVideos.attorneyIntro.src,
  videoTitle: solagreeVimeoVideos.attorneyIntro.title,
  ctaLabel: 'Watch the full Partner Briefing',
  ctaTo: attorneyWebinarPath,
  quote: 'I can finally offer my clients a better path without sacrificing my own quality of life.'
} satisfies AttorneyHowItWorksContent

export const cdfaHowItWorksContent = {
  title: 'See How It Works',
  intro: 'Watch how the partnership works and what makes this different – in 90 seconds.',
  videoSrc: solagreeVimeoVideos.cdfaIntro.src,
  videoTitle: solagreeVimeoVideos.cdfaIntro.title,
  videoImageSrc: '/images/for-professionals.webp',
  videoImageAlt: 'CDFA webinar video preview with Courtney speaking.',
  ctaLabel: 'Watch the full Partner Briefing',
  ctaTo: cdfaWebinarPath,
  quote: 'Financial professionals are not extra in divorce cases, they are essential.'
} satisfies AttorneyHowItWorksContent

export const attorneyValueContent = {
  title: "What's In It For You",
  intro: 'Beyond the courtroom - a smarter way to serve clients.',
  cards: attorneyValueCards
} satisfies AttorneyValueContent

export const cdfaValueContent = {
  title: "What's In It For You",
  intro: 'Beyond the numbers – a process that values your expertise.',
  cards: [
    {
      iconSrc: '/icons/expand-capacity.svg',
      title: 'Your Expertise Is Essential',
      description:
        "Stop trying to convince attorneys or clients that financial analysis matters. At Solagree, you're not extra – you're essential. You lead Phase 1 because we know financial understanding drives resolution."
    },
    {
      iconSrc: '/icons/revenue-stream.svg',
      title: 'Steady Referral Stream',
      description:
        "Solagree actively refers Compass cases to panel CDFAs. Cases we can't take are sent to our panel, too. Stop marketing, start working."
    },
    {
      iconSrc: '/icons/predictable-scope.svg',
      title: 'Predictable Scope',
      description:
        'Work within a structured, uniform process with clear deliverables. Phase 1 financial intake with defined timelines – not endless back-and-forth or scope creep.'
    }
  ]
} satisfies AttorneyValueContent

export const attorneyOnePlaceContent = {
  title: 'Everything You Need in One Place',
  intro: 'Track cases, access marketing materials, and manage your partnership in one place.',
  benefitsTitle: 'What you get:',
  benefits: attorneyOnePlaceBenefits,
  ctaLabel: 'Watch the Partner Briefing',
  ctaTo: attorneyWebinarPath,
  image: {
    src: '/images/attorney-everything-one-place.webp',
    alt: 'Attorney reviewing Solagree case materials.',
    width: 1188,
    height: 1266
  }
} satisfies AttorneyOnePlaceContent

export const cdfaOnePlaceContent = {
  title: 'Everything You Need in One Place',
  intro: 'Track cases, access marketing assets, and manage your partnership in one secure portal.',
  benefitsTitle: 'What you get:',
  benefits: [
    {
      title: 'Solagree marketing hub',
      description:
        'Share custom web pages, email templates, and marketing assets with your clients. Advertise that you help clients through flat-fee divorce options powered by Solagree.'
    },
    {
      title: 'Secure document portal',
      description:
        'Clients upload financial documents directly. No more chasing bank statements, tax returns, or pay stubs.'
    },
    {
      title: 'Onboarding + resources',
      description:
        'Access financial analysis templates, Phase 1 workflow guides, and materials to educate clients and attorneys in your market.'
    }
  ],
  ctaLabel: 'Watch the Partner Briefing',
  ctaTo: cdfaWebinarPath,
  image: {
    src: '/images/attorney-everything-one-place.webp',
    alt: 'Solagree portal and marketing assets.',
    width: 1188,
    height: 1266
  }
} satisfies AttorneyOnePlaceContent

export const attorneyMoreCasesContent = {
  title: 'Handle More Cases - Without More Staff',
  body:
    'Use our trained case coordinators and paralegals to handle document collection and logistics while you focus on strategic legal work. No hiring. No training.',
  linkPrefix: 'Learn more in ',
  linkLabel: 'the briefing',
  linkSuffix: '.',
  linkTo: attorneyWebinarPath,
  image: {
    src: '/images/attorney-handle-more-cases.webp',
    alt: 'A smiling professional man with glasses sitting at an office desk, holding a white document and looking forward in a modern office with a potted plant.',
    width: 1012,
    height: 766
  }
} satisfies AttorneyMoreCasesContent

export const cdfaMoreCasesContent = {
  title: 'Get Qualified Referrals - Not Just Any Clients',
  body:
    'Skip the marketing headache and chasing dead ends. Solagree delivers pre-screened client referrals who understand the value of a CDFA® and are ready to move forward.',
  linkPrefix: 'Learn more in ',
  linkLabel: 'the briefing',
  linkSuffix: '.',
  linkTo: cdfaWebinarPath,
  image: {
    src: '/images/cdfa-qualified-referrals.webp',
    alt: 'An approachable male professional in a dark long-sleeve shirt smiling and waving during a video conference call from his office desk.',
    width: 1012,
    height: 766
  }
} satisfies AttorneyMoreCasesContent

export const attorneyFaqContent = {
  title: 'Common Attorney Partner Questions',
  intro:
    'As a partner attorney, you provide strategic counsel, receive referrals, or serve as a neutral - without the administrative burden. Cases resolve faster, fees are predictable, and you can serve more clients without adding staff.',
  items: attorneyFaqItems,
  defaultValue: 'bring-own-cases'
} satisfies AttorneyFaqContent

export const cdfaFaqItems: AccordionItem[] = [
  {
    label: 'How do I become a Solagree CDFA® partner?',
    value: 'become-cdfa-partner',
    content:
      "We're looking for experienced CDFA® professionals and financial advisors with a background in marital asset analysis. Apply to join our network, and we'll schedule a conversation to discuss fit and next steps."
  },
  {
    label: 'How does Solagree refer cases to me?',
    value: 'referral-flow',
    content:
      "When couples select Solagree Compass, we match them with CDFA® partners in our network based on location and availability. You'll receive referrals directly from Solagree as well as overflow cases we can't accommodate."
  },
  {
    label: "What's my relationship with the divorcing couple?",
    value: 'couple-relationship',
    content:
      "You work as a neutral professional in the Solagree process - gathering financial information, providing analysis, and building the financial foundation for mediation. You're not representing either party; you're providing clarity to both."
  },
  {
    label: 'Can I continue working with clients after the Solagree process?',
    value: 'post-divorce-planning',
    content:
      'Absolutely. Many CDFA® partners provide post-divorce financial planning to help clients implement their settlement and build their financial future. This ongoing relationship is encouraged.'
  },
  {
    label: "What if I'm a financial advisor but not a CDFA®?",
    value: 'financial-advisor-not-cdfa',
    content:
      "We work with both CDFA® professionals and experienced financial advisors who specialize in divorce financial planning. If you have expertise in marital asset analysis and helping clients through financial transitions, we'd love to talk."
  },
  {
    label: 'What if my client already started working with me before Solagree?',
    value: 'existing-client',
    content:
      "Perfect! Even if you've already done substantial work with a client, we intentionally keep you involved within the Solagree framework. We hire you at a flat rate built into the client fee structure so the client continues working with the financial professional they already trust - and your work conforms to the Solagree structure for uniformity through mediation and arbitration."
  }
]

export const cdfaFaqContent = {
  title: 'Common CDFA Partner Questions',
  items: cdfaFaqItems,
  defaultValue: 'become-cdfa-partner'
} satisfies AttorneyFaqContent

export const attorneyFitsPracticeContent = {
  title: 'See If Solagree Fits Your Practice',
  body: 'Watch the briefing to understand the revenue model and decide if this partnership makes sense for you.',
  ctaLabel: 'Watch Now',
  ctaTo: attorneyWebinarPath,
  image: {
    src: '/images/attorney-see-if-fits.webp',
    alt: 'A close-up cropped view of a professional wearing a geometric patterned blouse sitting at a light wooden desk, with their hand resting on a silver laptop trackpad next to an open notebook.',
    width: 1218,
    height: 545
  }
} satisfies AttorneyFitsPracticeContent

export const cdfaFitsPracticeContent = {
  title: 'See if Solagree Fits Your Practice',
  body:
    'Watch the briefing to understand how the CDFA® role works, how referrals flow, and whether this partnership makes sense for your practice.',
  ctaLabel: 'Watch Now',
  ctaTo: cdfaWebinarPath,
  image: {
    src: '/images/cdfa-practice-integration.webp',
    alt: 'A close-up cropped view of a professional wearing a geometric patterned blouse sitting at a light wooden desk, with their hand resting on a silver laptop trackpad next to an open notebook.',
    width: 1218,
    height: 545
  }
} satisfies AttorneyFitsPracticeContent
