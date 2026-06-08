import type { LegalContentBlock, LegalListItem, LegalNavItem, LegalPageContent, LegalSlug } from '~/types/legal'

export const legalNavItems: LegalNavItem[] = [
  {
    label: 'Terms of Service',
    slug: 'terms-of-service',
    to: '/legal/terms-of-service'
  },
  {
    label: 'Privacy Policy',
    slug: 'privacy-policy',
    to: '/legal/privacy-policy'
  },
  {
    label: 'Accessibility',
    slug: 'accessibility',
    to: '/legal/accessibility'
  }
]

const pendingLegalApproval = 'Pending legal approval'

const textBlock = (text: string): LegalContentBlock => ({
  type: 'text',
  text
})

const headingBlock = (text: string): LegalContentBlock => ({
  type: 'heading',
  text
})

const subheadingBlock = (text: string): LegalContentBlock => ({
  type: 'subheading',
  text
})

const listBlock = (items: LegalListItem[]): LegalContentBlock => ({
  type: 'list',
  items
})

const termsOfServiceBlocks: LegalPageContent['blocks'] = [
  subheadingBlock('Solagree is not a law firm and does not provide legal advice. We connect clients with independent licensed professionals. Nothing in these Terms creates an attorney-client relationship between you and Solagree.'),
  headingBlock('1. Acceptance of Terms'),
  textBlock('By accessing or using the Solagree website at solagree.com (the "Site"), the Solagree portal at portal.solagree.com (the "Portal"), or any services offered through these platforms (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Services.'),
  textBlock('These Terms apply to all users of the Services, including divorcing couples, professional partners (attorneys, CDFAs, mediators, arbitrators, and counselors), and visitors to the Site.'),
  headingBlock('2. Description of Services'),
  textBlock('Solagree provides a structured, virtual divorce resolution platform that facilitates mediation and arbitration through a three-phase process: financial and parenting evaluation (Phase 1), mediation (Phase 2), and binding arbitration (Phase 3). Solagree connects users with independent licensed professionals, including Certified Divorce Financial Analysts (CDFAs), mediators, arbitrators, and attorneys.'),
  textBlock('Solagree-CORE and Solagree-COMPASS are flat-fee service programs available to qualifying couples. The specific scope, timelines, and deliverables of each program are described in the enrollment agreement and service documentation provided at the time of enrollment.'),
  headingBlock('3. Eligibility'),
  textBlock('To use the Services, you must:'),
  listBlock([
    { text: 'Be at least 18 years of age.' },
    { text: 'Be legally competent to enter into binding agreements.' },
    { text: 'Be a resident of a U.S. state or territory in which Solagree currently operates.' },
    { text: 'Not be subject to any court order or legal restriction that would prevent participation in private dispute resolution.' }
  ]),
  textBlock('Professional partners must additionally meet the credentialing and licensing requirements specified in their separate Partner Agreement with Solagree.'),
  headingBlock('4. Accounts and Portal Access'),
  textBlock('Access to the Portal requires creation of a user account. You agree to provide accurate, current, and complete information at registration and to update that information as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.'),
  textBlock('You must notify Solagree immediately at contact@solagree.com if you suspect unauthorized access to your account. Solagree is not liable for losses resulting from unauthorized account use where you have failed to maintain reasonable credential security.'),
  headingBlock('5. Fees and Payment'),
  textBlock('Solagree charges flat fees for its programs as published on the Site at the time of enrollment. Fees are per person unless otherwise stated. By enrolling, both parties agree to the applicable fee structure.'),
  textBlock('Fees are due as specified in your enrollment agreement. Solagree reserves the right to suspend access to the Portal and Services if fees are not paid when due. Refund eligibility is governed by the Refund Policy provided at enrollment. All fees are stated in U.S. dollars.'),
  textBlock('Professional partner compensation is governed separately by each partner\'s Partner Agreement with Solagree and is not subject to these Terms.'),
  headingBlock('6. The Arbitration Process and Binding Nature of Awards'),
  textBlock('IMPORTANT: The Solagree process includes binding arbitration. By enrolling in a Solagree program, both parties agree that the arbitration award issued in Phase 3 is final and binding, subject only to the grounds for vacatur or modification permitted under applicable state arbitration law (including the Uniform Arbitration Act or Federal Arbitration Act, as applicable).'),
  textBlock('Both parties acknowledge that they have had the opportunity to consult with independent legal counsel before entering into the Solagree process and before agreeing to binding arbitration.'),
  textBlock('Nothing in these Terms prevents either party from consulting with or retaining an independent attorney at any point during the Solagree process.'),
  headingBlock('7. Independent Professionals'),
  textBlock('All CDFAs, mediators, arbitrators, attorneys, and other professionals participating in the Solagree process are independent contractors, not employees or agents of Solagree. Solagree does not practice law, provide financial advice, or guarantee any particular outcome.'),
  textBlock('The professional services provided by these independent contractors are subject to their own professional obligations, licensing requirements, and ethical rules. Solagree does not supervise or direct the substantive professional judgment of participating professionals.'),
  headingBlock('8. Confidentiality'),
  textBlock('Solagree maintains strict confidentiality of all case-related information, including documents uploaded to the Portal, communications between parties, and professional work product. Case information will not be disclosed to third parties except:'),
  listBlock([
    { text: 'As required by law or court order.' },
    { text: 'To facilitate the Services (e.g., sharing financial documents with the assigned CDFA or mediator).' },
    { text: 'With the written consent of both parties.' },
    { text: 'In connection with proceedings to enforce or vacate an arbitration award.' }
  ]),
  textBlock('Mediation communications are protected under applicable state mediation privilege laws.'),
  headingBlock('9. User Conduct'),
  textBlock('You agree not to use the Services to:'),
  listBlock([
    { text: 'Provide false or misleading information about your financial circumstances, assets, or liabilities.' },
    { text: 'Harass, threaten, or intimidate the other party or any professional.' },
    { text: 'Upload documents or information that are forged, fabricated, or obtained unlawfully.' },
    { text: 'Interfere with the technical operation of the Portal.' },
    { text: 'Attempt to circumvent or manipulate the structured process.' }
  ]),
  textBlock('Violation of these conduct standards may result in suspension or termination of Services, without refund, at Solagree\'s sole discretion.'),
  headingBlock('10. Intellectual Property'),
  textBlock('All content on the Site and Portal, including text, graphics, logos, process documentation, templates, and software, is the property of Solagree, LLC or its licensors and is protected by U.S. copyright and trademark law. The Solagree name and logo are registered trademarks of Solagree, LLC.'),
  textBlock('You are granted a limited, non-exclusive, non-transferable license to access and use the Portal solely for the purpose of participating in the Solagree process. No other use is permitted without prior written consent.'),
  headingBlock('11. Disclaimer of Warranties'),
  textBlock('THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. SOLAGREE DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.'),
  textBlock('SOLAGREE DOES NOT GUARANTEE ANY SPECIFIC OUTCOME, RESOLUTION, OR AGREEMENT AS A RESULT OF USING THE SERVICES.'),
  headingBlock('12. Limitation of Liability'),
  textBlock('TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SOLAGREE, LLC AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND CONTRACTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.'),
  textBlock('IN NO EVENT SHALL SOLAGREE\'S TOTAL LIABILITY TO YOU EXCEED THE TOTAL FEES PAID BY YOU TO SOLAGREE IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.'),
  headingBlock('13. Governing Law and Dispute Resolution'),
  textBlock(`Governing state and arbitration venue: ${pendingLegalApproval}.`),
  textBlock('Any dispute between you and Solagree arising from these Terms or the Services that is not resolved informally shall be submitted to binding arbitration under the rules of the American Arbitration Association unless you and Solagree agree otherwise.'),
  textBlock('Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent irreparable harm.'),
  headingBlock('14. Changes to These Terms'),
  textBlock('Solagree reserves the right to modify these Terms at any time. Changes will be posted to the Site with an updated effective date. Continued use of the Services after the effective date of changes constitutes acceptance. If you object to any changes, your sole remedy is to discontinue use of the Services.'),
  headingBlock('15. Contact'),
  textBlock('For questions about these Terms, contact:'),
  textBlock('Solagree, LLC'),
  textBlock('Email: contact@solagree.com'),
  textBlock('Website: www.solagree.com')
]

const accessibilityBlocks: LegalPageContent['blocks'] = [
  headingBlock('Our Commitment'),
  textBlock('Solagree, LLC is committed to ensuring that our website (solagree.com) and portal (portal.solagree.com) are accessible to people with disabilities. We strive to meet or exceed the requirements of the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, as published by the World Wide Web Consortium (W3C).'),
  textBlock('We recognize that accessibility is an ongoing process. We are continuously working to improve the accessibility and usability of our digital properties.'),
  headingBlock('Standards We Follow'),
  textBlock('Our accessibility efforts are guided by the following standards:'),
  listBlock([
    { text: 'Web Content Accessibility Guidelines (WCAG) 2.1, Level AA' },
    { text: 'Section 508 of the Rehabilitation Act of 1973, as amended' },
    { text: 'Americans with Disabilities Act (ADA), Title III' }
  ]),
  textBlock('These guidelines establish criteria across four principles: perceivable, operable, understandable, and robust (POUR).'),
  headingBlock('Measures We Have Taken'),
  textBlock('To support accessibility, Solagree has implemented or is working toward:'),
  subheadingBlock('Perceivable'),
  listBlock([
    { text: 'Text alternatives for non-text content, including images and icons.' },
    { text: 'Captions and transcripts for video content, including partner briefing videos.' },
    { text: 'Sufficient color contrast between text and backgrounds throughout the Site and Portal.' },
    { text: 'Content that can be resized up to 200% without loss of content or functionality.' }
  ]),
  subheadingBlock('Operable'),
  listBlock([
    { text: 'Full keyboard navigability throughout the Site and Portal.' },
    { text: 'Visible focus indicators for keyboard users.' },
    { text: 'No content that flashes more than three times per second.' },
    { text: 'Skip-to-main-content links on all pages.' }
  ]),
  subheadingBlock('Understandable'),
  listBlock([
    { text: 'Clear, plain-language content written for a general audience.' },
    { text: 'Consistent navigation structure across all pages.' },
    { text: 'Form fields with descriptive labels and clear error messaging.' }
  ]),
  subheadingBlock('Robust'),
  listBlock([
    { text: 'HTML that conforms to current W3C specifications.' },
    { text: 'Compatibility with current assistive technologies, including screen readers (NVDA, JAWS, VoiceOver).' },
    { text: 'Regular testing across major browsers and devices.' }
  ]),
  headingBlock('Known Limitations'),
  textBlock(`Known limitations text: ${pendingLegalApproval}. Solagree will update this section with approved known barriers or confirm that no known barriers are currently identified.`),
  textBlock('If you encounter a barrier not listed here, please contact us (see below).'),
  headingBlock('Assistive Technology Support'),
  textBlock('Solagree.com and portal.solagree.com are designed to be compatible with the following assistive technologies:'),
  listBlock([
    { text: 'Screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (macOS and iOS), TalkBack (Android)' },
    { text: 'Keyboard-only navigation' },
    { text: 'Browser zoom and text resizing tools' },
    { text: 'High contrast and dark mode display settings' }
  ]),
  textBlock('We recommend using the latest version of your browser and assistive technology for the best experience.'),
  headingBlock('Alternative Access'),
  textBlock('If you are unable to access any part of the Solagree Site or Portal due to a disability, we are committed to providing an accessible alternative. Please contact us and we will work with you to deliver the information or complete the process through an accessible method.'),
  textBlock('For individuals who require accommodations to participate in the Solagree process itself (mediation, arbitration, or financial evaluation sessions), please notify us at the time of enrollment. We will work with the assigned professionals to make reasonable accommodations.'),
  headingBlock('Feedback and Contact'),
  textBlock('We welcome feedback on the accessibility of our digital properties. If you experience an accessibility barrier, find a feature that is not working as expected, or have suggestions for improvement, please contact us:'),
  textBlock('Email: contact@solagree.com'),
  textBlock('Website: www.solagree.com/contact'),
  textBlock('We aim to respond to accessibility-related inquiries within five (5) business days.'),
  headingBlock('Third-Party Content'),
  textBlock('Some content on our Site is provided by third parties (including embedded video players, intake forms, and partner tools). While we request that third-party providers meet accessibility standards, we cannot guarantee the accessibility of all third-party content. If you encounter an inaccessible third-party feature, please let us know so we can seek an accessible alternative.'),
  headingBlock('Enforcement'),
  textBlock('If you are not satisfied with our response to an accessibility concern, you may contact:'),
  listBlock([
    { text: 'The U.S. Department of Justice, Civil Rights Division, Disability Rights Section: www.ada.gov' },
    { text: 'The U.S. Access Board: www.access-board.gov' }
  ]),
  headingBlock('Updates to This Statement'),
  textBlock('This Accessibility Statement is reviewed and updated periodically. We will update it to reflect changes to our digital properties, corrections of identified barriers, or changes in applicable standards.')
]

export const legalPages: Record<LegalSlug, LegalPageContent> = {
  'terms-of-service': {
    slug: 'terms-of-service',
    navLabel: 'Terms of Service',
    title: 'Terms of Service',
    metaTitle: 'Terms of Service',
    metaDescription: 'Review the Solagree terms of service for website use, service expectations, and legal guidelines.',
    sourceLabel: 'Solagree, LLC',
    revisionLabel: `Effective Date: ${pendingLegalApproval} | Last Updated: ${pendingLegalApproval}`,
    blocks: termsOfServiceBlocks
  },
  'privacy-policy': {
    slug: 'privacy-policy',
    navLabel: 'Privacy Policy',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy',
    metaDescription: 'Review the Solagree privacy policy and learn how personal information is collected, used, and handled.',
    sourceLabel: 'SOLAGREE.COM',
    revisionLabel: 'Date of Last Revision: March 13, 2025',
    blocks: [
      {
        type: 'text',
        text: 'Before using the Service or submitting any personal information to the Solagree website, please review this Privacy Policy carefully and contact us if you have any questions. By using the Service, you agree to the practices described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not use the Service.'
      },
      {
        type: 'text',
        text: 'Please review our GLBA Privacy Notice, below, to learn more about our collection, use and sharing of your financial information. In certain cases we may act as a service provider to a financial, accounting, investment, tax or legal advisor ("Advisor"), and in such case, our use of your personal information will be subject to our separate agreement with the Advisor and the Advisor\'s privacy policies and practices (including their GLBA privacy notice if applicable). Please refer to the privacy policy (or privacy notice) of the applicable Advisor for information regarding the Advisor\'s privacy practices, choices and controls.'
      },
      {
        type: 'text',
        text: 'If you are an Advisor, you represent and warrant that you have all rights necessary to grant the foregoing rights with respect to any such data and information of you and your clients.'
      },
      {
        type: 'heading',
        text: '1. Personal Information Collection'
      },
      {
        type: 'subheading',
        text: 'Personal Information We Collect From You:'
      },
      {
        type: 'list',
        items: [
          {
            label: 'Account and Contact Information',
            text: 'We collect your name, email address, phone number, and mailing address.'
          },
          {
            label: 'Estate Plan Information',
            text: 'We collect information needed to prepare your estate planning documents, including your date of birth, information about your assets and how you want to distribute them, and the names, dates of birth, and contact information of your family members, beneficiaries, and trustees.'
          },
          {
            label: 'Identity Vault Information',
            text: 'We collect information contained in the documents that you upload to our digital document vault, such as your passport, birth certificates, estate planning documents, and tax returns.'
          },
          {
            label: 'Financial Information',
            text: 'Our payment processor(s) will collect the financial information necessary to process your payments, such as your payment card number and authentication details. Please note, however, that we store only a tokenized version of such information and do not maintain payment card information on our servers.'
          },
          {
            label: 'Communication Information',
            text: 'We may collect information when you contact us with questions or concerns and when you contact us, including when you contact support, respond to questionnaires, participate in our contests or sweepstakes, or respond to surveys.'
          },
          {
            label: 'Inferences',
            text: 'We may use the information we collect or receive about you to derive inferences.'
          }
        ]
      }
    ]
  },
  accessibility: {
    slug: 'accessibility',
    navLabel: 'Accessibility',
    title: 'Accessibility',
    metaTitle: 'Accessibility',
    metaDescription: 'Review Solagree accessibility information, standards, and commitments for making the website easier to use.',
    sourceLabel: 'Solagree, LLC',
    revisionLabel: `Effective Date: ${pendingLegalApproval} | Last Updated: ${pendingLegalApproval}`,
    blocks: accessibilityBlocks
  }
}

/**
 * Type guard for validating route params against configured legal page slugs.
 */
export const isLegalSlug = (slug: string): slug is LegalSlug => slug in legalPages
