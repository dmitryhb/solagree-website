import type { AccordionItem } from '~/types/accordion'

export interface FamilyLandingPage {
  theme: 'military' | 'special-needs'
  title: string
  path: string
  eyebrow: string
  headline: string
  description: string
  hero: { src: string, alt: string }
  concerns: { question: string, answer: string }[]
  specialists: { title: string, description: string, iconSrc: string }[]
  assessment: string[]
  why: { text: string, src: string, alt: string }
  pricingIntro: string[]
  faqIntro: string
  faqTitle: string
  faqs: AccordionItem[]
  closing: { title: string, src: string, alt: string }
}

// Figma copy with the September 4 Google Doc overrides for SEO and FAQs.
export const militaryLandingPage: FamilyLandingPage = {
  "theme": "military",
  "title": "Military Divorce",
  "path": "/military-divorce",
  "eyebrow": "Solagree for Servicemembers",
  "headline": "Your Service Shouldn't Complicate Your Divorce.",
  "description": "A virtual, flat-fee process built for the realities of military life – deployments, relocations, and everything that comes with them.",
  "hero": {
    "src": "/images/family-pages/military-divorce-hero.webp",
    "alt": "Parent embracing child, representing a military family navigating divorce with Solagree"
  },
  "concerns": [
    {
      "question": "How do we handle custody around deployments and PCS orders?",
      "answer": "We build this directly into your parenting plan from the start."
    },
    {
      "question": "Which state actually has jurisdiction, when we've lived in three?",
      "answer": "We help clarify this early, before it becomes a bigger issue."
    },
    {
      "question": "How do we divide a military pension or Thrift Savings Plan account?",
      "answer": "Our CDFA® professionals guide this as part of your financial track."
    },
    {
      "question": "What happens to BAH, and to TRICARE coverage?",
      "answer": "We factor these into your support and benefits planning."
    }
  ],
  "specialists": [
    {
      "title": "Child Custody  Intake Specialists",
      "description": "Trained specifically in military family dynamics – deployment cycles, PCS timing, custody continuity.",
      "iconSrc": "/images/faster-resolution.webp"
    },
    {
      "title": "CDFA® Financial Professionals",
      "description": "Fluent in military-specific finances most divorce processes aren't built to handle.",
      "iconSrc": "/images/flatfree-pricing.webp"
    },
    {
      "title": "A Structured, Predictable Process",
      "description": "The same three-phase path every case follows – built to work wherever the next assignment takes you.",
      "iconSrc": "/images/binding-commitment.webp"
    }
  ],
  "assessment": [
    "For our financial track, your CDFA® helps you organize military-specific finances — pensions, TSP, and benefits — and clarify where you already agree.",
    "For our parenting track, your Custody Intake Specialist helps build a plan around deployments and relocations, and identify where you already agree."
  ],
  "why": {
    "src": "/images/family-pages/military-family-divorce-reflection.webp",
    "alt": "Military family member reflecting on the divorce process at home",
    "text": "Military life already asks a lot of your family. Your divorce process shouldn't ask you to navigate it alone, or to re-explain your situation to someone unfamiliar with it.\n\nA structured, predictable process means fewer surprises during an already unpredictable chapter — and a resolution that holds up regardless of where the next assignment takes you."
  },
  "pricingIntro": [
    "Most servicemember cases without children fit Core Financial. If you have children, Solagree Core Parenting + Financial typically applies.",
    "Military families receive a 10% discount on Solagree Core pricing."
  ],
  "faqTitle": "Military Divorce FAQs",
  "faqIntro": "Military life brings its own set of questions to divorce. Here are the ones we hear most.",
  "faqs": [
    {
      "label": "Does deployment affect how Solagree handles our case?",
      "content": "Yes. Our Child Custody Intake Specialists work directly with deployment schedules, PCS timelines, and Family Care Plans as part of the process."
    },
    {
      "label": "Which state handles our divorce if we've been stationed in more than one?",
      "content": "Jurisdiction under the UCCJEA depends on factors like your children's residency history. We help clarify this early, before it becomes a bigger issue."
    },
    {
      "label": "Can Solagree help divide a military pension or TSP account?",
      "content": "Yes. Our CDFA® professionals guide military pension and Thrift Savings Plan division as part of your financial track."
    }
  ],
  "closing": {
    "src": "/images/family-pages/military-parent-child-getting-started.webp",
    "alt": "Servicemember parent and child at home, getting started with Solagree's military divorce process",
    "title": "A Process That Understands What Your Family Has Already Navigated."
  }
}

export const specialNeedsLandingPage: FamilyLandingPage = {
  "theme": "special-needs",
  "title": "Divorce and Children with Special Needs",
  "path": "/divorce-special-needs-children",
  "eyebrow": "Solagree for Families with Special Needs",
  "headline": "Your Child's Future Deserves More Than a Quick Compromise.",
  "description": "A virtual, flat-fee process built to protect what matters most — your child's long-term care, stability, and security.",
  "hero": {
    "src": "/images/family-pages/special-needs-divorce-hero.webp",
    "alt": "Father holding his young child, representing a family navigating divorce with a child who has special needs"
  },
  "concerns": [
    {
      "question": "How will we keep paying for therapies, medical care, and education?",
      "answer": "This is built into your financial planning from day one."
    },
    {
      "question": "How do we protect our SSI, Medicaid, or other benefits?",
      "answer": "Experienced in long-term planning, including whether a Special Needs Trust makes sense for your family."
    },
    {
      "question": "How do we build a parenting plan around our child's actual routines and needs?",
      "answer": "We work from your child's real schedule, not a generic custody template."
    },
    {
      "question": "How will we keep making big decisions together, going forward?",
      "answer": "We help you build a durable framework for ongoing shared decisions."
    }
  ],
  "specialists": [
    {
      "title": "Parenting Specialists",
      "description": "Trained specifically in coordinating care, schedules, and decision-making for children with complex needs.",
      "iconSrc": "/images/faster-resolution.webp"
    },
    {
      "title": "CDFA® Financial Professionals",
      "description": "Certified specifically in divorce finance, with experience in benefit-eligibility planning and Special Needs Trusts.",
      "iconSrc": "/images/flatfree-pricing.webp"
    },
    {
      "title": "A Process Built for the Long Term",
      "description": "Designed to hold up as your child's needs change, not just resolve today's disagreement.",
      "iconSrc": "/images/binding-commitment.webp"
    }
  ],
  "assessment": [
    "For our financial track, your CDFA® helps you organize finances with your child's long-term needs in mind, and clarify where you already agree.",
    "For our parenting track, your Custody Intake Specialist helps build a plan around your child's actual routines and needs."
  ],
  "why": {
    "src": "/images/family-pages/special-needs-parent-child-connection.webp",
    "alt": "Parent and child connecting at home, reflecting Solagree's support for families with special needs",
    "text": "Children with special needs often need ongoing coordination between parents long after the divorce is final. A resolution built only for today can quietly become tomorrow's conflict.\n\nBy planning for the long term — not just the immediate split — we help you build an agreement that gives your child stability, and gives you confidence that the hard questions were actually addressed, not just avoided."
  },
  "pricingIntro": [
    "Special needs cases typically fall under Solagree Core Parenting, or Parenting + Financial when financial complexity is also involved."
  ],
  "faqTitle": "Special Needs FAQs",
  "faqIntro": "When your child has special needs, there's a lot to think through. Here are the questions we hear most often.",
  "faqs": [
    {
      "label": "Can Solagree help protect our child's SSI or Medicaid eligibility?",
      "content": "Yes. Our CDFA® professionals help structure financial decisions, including options like a Special Needs Trust, with eligibility in mind."
    },
    {
      "label": "How does Solagree handle parenting plans for a child with special needs?",
      "content": "Our parenting specialists build plans around your child's actual routines, therapies, and appointments — not a generic custody template."
    },
    {
      "label": "Does this cost more if our situation is complex?",
      "content": "Solagree's flat-fee pricing is set upfront based on your track, so you know your cost before you begin, regardless of complexity within that track."
    }
  ],
  "closing": {
    "src": "/images/family-pages/special-needs-parent-child-getting-started.webp",
    "alt": "A woman using a wheelchair at a table, getting started with Solagree's special needs divorce process",
    "title": "A Path Forward That Puts Your Child First."
  }
}

