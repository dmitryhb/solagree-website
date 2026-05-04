import type { FaqPageContent } from '~/types/faq'

/**
 * Standalone FAQ page content kept out of the route component so navigation,
 * SEO, sitemap generation, and future content edits can reuse one source.
 */
export const faqPageContent = {
  title: 'FAQs',
  intro: 'Find answers to common questions about the Solagree process, pricing, professionals, and whether it may fit your situation.',
  metaTitle: 'Frequently Asked Questions',
  metaDescription:
    'Review frequently asked questions about Solagree, including process, pricing, professionals, children, and next steps.',
  sections: [
    {
      label: 'Divorcing Couples',
      slug: 'divorcing-couples',
      items: [
        {
          label: 'What is SOLAGREE?',
          value: 'what-is-solagree',
          content:
            'SOLAGREE is a private, flat-fee divorce resolution company that guides separating couples through a structured three-step process: Intake, Mediation, and Arbitration. Our process is designed to help you resolve your divorce efficiently, affordably, and without going to court.'
        },
        {
          label: 'How is SOLAGREE different from traditional divorce?',
          value: 'how-is-solagree-different-from-traditional-divorce',
          content:
            'Traditional divorce often involves lengthy court battles, unpredictable costs, and decisions made by a judge who may be meeting you for the first time. SOLAGREE keeps you out of court by having both spouses commit to a binding resolution process from the very beginning. Neither party can simply walk away, which keeps the process moving toward a final resolution.'
        },
        {
          label: 'How is SOLAGREE different from regular mediation?',
          value: 'how-is-solagree-different-from-regular-mediation',
          content:
            'In traditional mediation, either spouse can walk away at any time, leaving you with nothing to show for the effort. With SOLAGREE, both parties sign a binding arbitration agreement before the process begins. That means you are both committed to reaching a resolution through to the end.'
        },
        {
          label: 'Is SOLAGREE right for us?',
          value: 'is-solagree-right-for-us',
          content:
            'Most cases have a home with SOLAGREE, even when couples are largely at odds. If both spouses agree that they want to minimize time and cost, even if they agree on nothing else, SOLAGREE is often an effective path forward. Our introductory meetings help determine whether this approach is a good fit for your situation.'
        },
        {
          label: 'What are the two SOLAGREE service options?',
          value: 'what-are-the-two-solagree-service-options',
          content:
            'SOLAGREE offers two paths. SOLAGREE-Expedite is designed for couples with lower conflict and is structured as flat-fee stages. SOLAGREE-Traditional is designed for couples with more complex circumstances or deeper conflict, where both spouses generally have attorney representation throughout.'
        },
        {
          label: 'Is SOLAGREE a law firm?',
          value: 'is-solagree-a-law-firm',
          content:
            'No. SOLAGREE is not a law firm and cannot provide legal advice or represent either party. We assemble a dedicated team of neutral professionals, including a Certified Divorce Financial Analyst (CDFA), a mediator, and an arbitrator, who guide both parties through the process. It is important to know that family law varies from state to state, and the way certain elements of our process apply, including arbitration, must adapt to reflect the laws of your jurisdiction. We encourage all clients to consult with a licensed attorney in their state if they have questions about how the process applies to them.'
        },
        {
          label: 'What are the three steps of the SOLAGREE process?',
          value: 'what-are-the-three-steps-of-the-solagree-process',
          content:
            'Step 1 is Intake, where a CDFA and/or Child Custody Intake Specialist helps you gather documents and information and identify early areas of agreement. Step 2 is Mediation, where a professional mediator works with both of you to resolve disagreements. Step 3 is Arbitration, where an arbitrator incorporates all agreements into a legally binding Arbitration Award. For any unresolved issues, the arbitrator makes the final decision based on the laws of your state.'
        },
        {
          label: 'What is an Arbitration Award?',
          value: 'what-is-an-arbitration-award',
          content:
            'The Arbitration Award is the legally binding document that outlines all the terms of your divorce agreement. It is drafted by your arbitrator and incorporates everything you agreed upon during mediation, as well as any decisions the arbitrator made on unresolved issues.'
        },
        {
          label: 'Do we still have to go to court?',
          value: 'do-we-still-have-to-go-to-court',
          content:
            'Generally, no. SOLAGREE is designed to minimize or eliminate court involvement. Once the process is complete, some couples choose to have their Arbitration Award confirmed by the court through a Confirmation of Award or other uncontested process. In most states, this is a simple, inexpensive procedure that may not even require a hearing.'
        },
        {
          label: 'What issues can SOLAGREE help us resolve?',
          value: 'what-issues-can-solagree-help-us-resolve',
          content:
            'SOLAGREE can help you work through property and asset division, retirement account allocation, debt allocation, spousal support, child custody and parenting plans, child support, and other financial and family matters related to your divorce.'
        },
        {
          label: 'Can we participate remotely?',
          value: 'can-we-participate-remotely',
          content:
            'Yes. The SOLAGREE process is virtual - designed to be conducted from the comfort of your home, with no in-person court appearances required.'
        },
        {
          label: 'How much does SOLAGREE cost?',
          value: 'how-much-does-solagree-cost',
          content:
            'SOLAGREE generally uses a flat-fee pricing model, which means you will typically know your costs upfront with no surprise bills or hourly rates that climb over time. The exact cost depends on which service option you choose and the specifics of your situation, all of which will be discussed with you in detail before you commit to anything.'
        },
        {
          label: 'Is SOLAGREE less expensive than a traditional divorce?',
          value: 'is-solagree-less-expensive-than-a-traditional-divorce',
          content:
            "In the vast majority of cases, yes. Traditional divorce litigation can cost couples tens of thousands of dollars, sometimes far more, depending on how long it takes. SOLAGREE's fee structure is designed to be substantially less expensive than litigation or traditional settlement procedures."
        },
        {
          label: 'Are payments made in stages?',
          value: 'are-payments-made-in-stages',
          content:
            'Yes. For SOLAGREE-Expedite, the process is structured into flat-fee stages, so you pay as you progress rather than a single large upfront sum. Pricing details for SOLAGREE-Traditional will be discussed during your initial consultation.'
        },
        {
          label: 'Is the process confidential?',
          value: 'is-the-process-confidential',
          content:
            'Yes. As part of the SOLAGREE process, all parties agree that the proceedings are confidential. Neither the mediator nor the arbitrator can be subpoenaed to testify in any future hearing. This confidentiality helps create a more open environment for reaching a fair resolution.'
        },
        {
          label: 'What if we have children? Can SOLAGREE handle custody issues?',
          value: 'what-if-we-have-children-can-solagree-handle-custody-issues',
          content:
            'Yes. A Child Custody Intake Specialist is part of the intake team and helps gather information and identify areas of agreement related to parenting time, custody arrangements, and child support. These matters are then addressed in the mediation and arbitration steps.'
        },
        {
          label: 'What if my spouse and I cannot agree on anything?',
          value: 'what-if-my-spouse-and-i-cannot-agree-on-anything',
          content:
            'That is exactly what the arbitration step is designed for. If you cannot reach an agreement on certain issues during mediation, the arbitrator steps in and makes a legally binding decision (subject to the laws of your state). You will not be left without a resolution.'
        },
        {
          label: 'Do we need to hire our own attorneys?',
          value: 'do-we-need-to-hire-our-own-attorneys',
          content:
            'It depends on which service option you choose. In SOLAGREE-Expedite, attorney representation is not required, though you are encouraged to retain an Attorney Advisor on a flat-fee basis for personal guidance and document review. In SOLAGREE-Traditional, both spouses typically have their own attorney throughout the process.'
        },
        {
          label: 'What if our situation turns out to be too complex for SOLAGREE?',
          value: 'what-if-our-situation-turns-out-to-be-too-complex-for-solagree',
          content:
            'This process is designed to handle low, medium and high levels of complexity. During the screening and intake process, we identify cases that are not the right fit for our services. If that happens, we will refer you to trusted professionals in our network who are better suited to help you.'
        },
        {
          label: 'How do I get started?',
          value: 'how-do-i-get-started',
          content:
            'Simply reach out to the SOLAGREE team through the contact form on our website at solagree.com. A team member will review your situation and walk you through which option may be the right fit for you.'
        }
      ]
    },
    {
      label: 'Professional Partners',
      slug: 'professional-partners',
      items: [
        {
          label: 'Why should I join the SOLAGREE network?',
          value: 'why-should-i-join-the-solagree-network',
          content:
            'SOLAGREE offers professionals a cleaner, more efficient alternative to the traditional adversarial divorce process. By joining our network, you gain access to a steady stream of referred clients, a more structured, productive working environment, and a process designed to deliver better outcomes for the families you serve.'
        },
        {
          label: 'What types of professionals does SOLAGREE work with?',
          value: 'what-types-of-professionals-does-solagree-work-with',
          content:
            'SOLAGREE works with a range of divorce professionals, including family law attorneys in advisory and appearing roles, Certified Divorce Financial Analysts (CDFAs), mediators, arbitrators, and child custody specialists.'
        },
        {
          label: 'How does the referral process work?',
          value: 'how-does-the-referral-process-work',
          content:
            'Not every case is right for the SOLAGREE process. When we screen cases that are better suited for traditional representation, due to high conflict, financial complexity, or other factors, we refer those clients directly to trusted professionals in our network. Being part of our network means receiving client referrals even for cases handled entirely outside of SOLAGREE.'
        },
        {
          label: 'What is the One Case Challenge?',
          value: 'what-is-the-one-case-challenge',
          content:
            'The One Case Challenge is our invitation to new SOLAGREE Network professionals. The first clients that you refer into the SOLAGREE process receive a discount on our services, giving you the opportunity to experience firsthand how productive and rewarding it is to guide clients through a more structured, dignified process.'
        },
        {
          label: 'Will SOLAGREE compete with my existing practice?',
          value: 'will-solagree-compete-with-my-existing-practice',
          content:
            'No. There will always be plenty of cases that are not right for our process, and we are not here to replace your practice. We are here to complement it. Our goal is to strengthen the profession by offering a better option for the cases that fit our model and referring everything else back to you.'
        },
        {
          label: 'How do I learn more about joining the SOLAGREE network?',
          value: 'how-do-i-learn-more-about-joining-the-solagree-network',
          content:
            'Contact the SOLAGREE team through our website to discuss opportunities. We regularly host informational sessions for interested professionals.'
        }
      ]
    },
    {
      label: 'Attorneys',
      slug: 'attorneys',
      items: [
        {
          label: 'What roles can an attorney play within the SOLAGREE process?',
          value: 'what-roles-can-an-attorney-play-within-the-solagree-process',
          content:
            "When you become a SOLAGREE Network Attorney, you can participate in three distinct ways. First, as an Attorney Advisor, retained by a client on a flat fee to provide general guidance and document review during the SOLAGREE-Expedite process. Second, as an Appearing Attorney, representing a client in the SOLAGREE-Traditional process for couples with more complex circumstances. Third, as a Panel Professional, joining SOLAGREE's vetted network of attorney neutrals who serve as mediators or arbitrators on cases."
        },
        {
          label: 'Can I represent my client in the SOLAGREE process?',
          value: 'can-i-represent-my-client-in-the-solagree-process',
          content:
            'Yes. In the SOLAGREE-Traditional option, both spouses typically have their own attorney who participates throughout the process. In the SOLAGREE-Expedite option, clients may proceed without full attorney representation but are encouraged to retain a SOLAGREE Network Attorney as an Attorney Advisor for limited guidance.'
        },
        {
          label: 'What is the Attorney Advisor role?',
          value: 'what-is-the-attorney-advisor-role',
          content:
            'As a SOLAGREE Network Attorney in the Advisor role, you are retained by one party on a flat-fee basis to provide general legal guidance throughout the SOLAGREE-Expedite process. This may include answering questions and reviewing the Mediation Summary before agreements are finalized. It is a practical way to serve clients you might otherwise have to turn away due to the open-ended nature of traditional representation, while still generating meaningful revenue.'
        },
        {
          label: 'How does SOLAGREE generate referrals for my practice?',
          value: 'how-does-solagree-generate-referrals-for-my-practice',
          content:
            "Clients find us directly or through referrals from other professionals. This is a rising tide proposition, because for each case referred to us, we have the opportunity to refer to 4 attorneys (two neutral, two advocates) and other professionals. As a SOLAGREE Network Attorney, you will be listed as a referral resource for both SOLAGREE cases and for cases that do not qualify for our program. When incoming cases do not meet SOLAGREE's screening criteria, we refer those clients directly to attorneys in our network. You also receive referrals for cases handled entirely outside our process."
        },
        {
          label: 'Will serving as a neutral conflict with my existing practice?',
          value: 'will-serving-as-a-neutral-conflict-with-my-existing-practice',
          content:
            'That depends on your practice and jurisdiction, but typically no. SOLAGREE Network Attorneys who serve as neutrals do so separately from their advocacy work.'
        },
        {
          label: 'Why should I consider becoming a SOLAGREE Network Attorney, given my established practice?',
          value: 'why-should-i-consider-becoming-a-solagree-network-attorney-given-my-established-practice',
          content:
            'SOLAGREE provides a structured, predictable framework that protects your time and expertise. Rather than being drawn into prolonged adversarial proceedings, you can serve clients that you might ordinarily decline with reduced risk. The process is also designed to be less emotionally taxing for everyone involved, including the attorneys.'
        },
        {
          label: 'How do I become a SOLAGREE Network Attorney?',
          value: 'how-do-i-become-a-solagree-network-attorney',
          content:
            'Reach out to the SOLAGREE team through our website to express your interest. We are consistently seeking qualified attorneys to expand our professional network and will walk you through the next steps.'
        }
      ]
    },
    {
      label: 'CDFA / Financial Advisors',
      slug: 'cdfa-financial-advisors',
      items: [
        {
          label: 'What role does a CDFA play in the SOLAGREE process?',
          value: 'what-role-does-a-cdfa-play-in-the-solagree-process',
          content:
            "The CDFA is a central part of the SOLAGREE intake phase. They work with both parties to gather financial documents, clarify the couple's full financial picture, and identify areas of agreement before mediation begins. This foundation is what makes the rest of the process more efficient and better informed."
        },
        {
          label: 'Why does SOLAGREE place such emphasis on financial professionals at the start?',
          value: 'why-does-solagree-place-such-emphasis-on-financial-professionals-at-the-start',
          content:
            'SOLAGREE believes divorce should begin with a clear understanding of the numbers. When couples have financial clarity from the outset, they are better equipped to make confident, informed decisions throughout mediation and arbitration. Financial uncertainty leads to conflict, anxiety, and delays.'
        },
        {
          label: 'Can CDFA professionals join the SOLAGREE network?',
          value: 'can-cdfa-professionals-join-the-solagree-network',
          content:
            'Yes. SOLAGREE is actively expanding its network of qualified CDFA professionals. Network members receive referrals for cases that come through the SOLAGREE process, as well as referrals for cases that do not fit our model but still require financial expertise.'
        },
        {
          label: 'What kinds of financial issues might I work on as a SOLAGREE network CDFA?',
          value: 'what-kinds-of-financial-issues-might-i-work-on-as-a-solagree-network-cdfa',
          content:
            'You may help clients navigate asset and debt understanding, retirement account analysis, tax implications of settlement options, spousal support calculations, housing decisions, and long-term financial planning post-divorce.'
        },
        {
          label: 'Is SOLAGREE a good fit for the clients I typically serve?',
          value: 'is-solagree-a-good-fit-for-the-clients-i-typically-serve',
          content:
            'SOLAGREE is designed for couples who want an efficient, financially predictable divorce process. If you work with clients going through separation or divorce, SOLAGREE can be a valuable resource to collaborate with as a professional on the case. You will be our partners in the process and therefore, give the clients more complete divorce services. This strengthens your industry by ensuring that your work will remain relevant until resolution.'
        },
        {
          label: 'How does SOLAGREE view the role of the CDFA compared to attorneys in the process?',
          value: 'how-does-solagree-view-the-role-of-the-cdfa-compared-to-attorneys-in-the-process',
          content:
            'SOLAGREE recognizes that financial expertise is just as critical as legal expertise in divorce. CDFAs and financial advisors are core team members in our process, not add-ons. SOLAGREE also actively presents the CDFA profession to broader audiences, including faith communities, divorce support groups, and professional associations.'
        },
        {
          label: 'How do I connect with SOLAGREE as a CDFA or financial advisor?',
          value: 'how-do-i-connect-with-solagree-as-a-cdfa-or-financial-advisor',
          content:
            'Reach out to the SOLAGREE team directly through our website. We welcome conversations with CDFAs and financial advisors interested in network membership, case collaboration, or co-presenting educational content to their communities.'
        }
      ]
    },
    {
      label: 'Client & Partner Support',
      slug: 'client-partner-support',
      items: [
        {
          label: 'I am already a SOLAGREE client. Who do I contact if I have a question about my case?',
          value: 'i-am-already-a-solagree-client-who-do-i-contact-if-i-have-a-question-about-my-case',
          content:
            'Your primary point of contact is your assigned SOLAGREE case team, which includes your CDFA and mediator or arbitrator. For administrative or billing questions, you can reach the SOLAGREE support team through the contact form on our website at solagree.com.'
        },
        {
          label: 'What happens if I need to reschedule a session?',
          value: 'what-happens-if-i-need-to-reschedule-a-session',
          content:
            'Please contact your case team as soon as possible to reschedule. We understand that life happens, and our team will work with you to find a new time that works for all parties involved, provided that the request is in good faith and not for unreasonable delay.'
        },
        {
          label: 'I am a client, and I feel like the process has stalled. What should I do?',
          value: 'i-am-a-client-and-i-feel-like-the-process-has-stalled-what-should-i-do',
          content:
            'Reach out to your case team directly to discuss the concern. If you feel the issue is not being resolved, you can also contact the SOLAGREE client support team through the website. Our goal is to keep your case moving efficiently toward resolution.'
        },
        {
          label: 'Can I add an attorney or advisor to my case after the process has started?',
          value: 'can-i-add-an-attorney-or-advisor-to-my-case-after-the-process-has-started',
          content:
            'Yes. It is possible and encouraged to engage a SOLAGREE Network Attorney in an Advisor role, and this can even happen at any point after the process has begun. Please notify your case team so that the appropriate coordination can take place.'
        },
        {
          label: 'I am a professional in the SOLAGREE network, and I have a question about a referral or a case. Who do I contact?',
          value: 'i-am-a-professional-in-the-solagree-network-and-i-have-a-question-about-a-referral-or-a-case-who-do-i-contact',
          content:
            'Network professionals can reach the SOLAGREE team through the professional portal or contact form on our website. For urgent case-related matters, please contact your designated SOLAGREE liaison directly.'
        },
        {
          label: 'How do network professionals stay informed about updates to the SOLAGREE process or new resources?',
          value: 'how-do-network-professionals-stay-informed-about-updates-to-the-solagree-process-or-new-resources',
          content:
            'SOLAGREE regularly communicates with its professional network through email updates, informational sessions, and events. Reach out to the team to make sure you are on our professional communications list.'
        },
        {
          label: 'Is there support available for the emotional aspects of the divorce process?',
          value: 'is-there-support-available-for-the-emotional-aspects-of-the-divorce-process',
          content:
            'Yes. SOLAGREE recognizes that divorce is not just a financial and legal process. It is a deeply personal and emotional one. Counseling and coaching support resources are available to help both parties navigate the emotional dimensions of separation with greater confidence and stability.'
        },
        {
          label: 'What if I have a concern about confidentiality or the neutrality of the process?',
          value: 'what-if-i-have-a-concern-about-confidentiality-or-the-neutrality-of-the-process',
          content:
            'All SOLAGREE team members are bound by strict confidentiality and neutrality standards. If you have a concern, please raise it with the SOLAGREE client support team so it can be addressed promptly and appropriately.'
        }
      ]
    }
  ]
} satisfies FaqPageContent
