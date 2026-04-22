import type { LegalNavItem, LegalPageContent, LegalSlug } from '~/types/legal'

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

const placeholderBlocks: LegalPageContent['blocks'] = [
  {
    type: 'text',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae purus vitae orci porttitor fermentum. Sed facilisis, nibh vitae malesuada bibendum, ipsum arcu luctus neque, vitae gravida justo lorem non justo.'
  },
  {
    type: 'text',
    text: 'Praesent a justo vel augue dignissim posuere. Donec tempor arcu vel sem luctus, eu efficitur lectus dignissim. Curabitur laoreet, libero at malesuada volutpat, ipsum risus feugiat dolor, vitae ultrices nibh nunc eget sapien.'
  },
  {
    type: 'heading',
    text: '1. GENERAL INFORMATION'
  },
  {
    type: 'subheading',
    text: 'Information Included on This Page:'
  },
  {
    type: 'list',
    items: [
      {
        label: 'Overview',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      {
        label: 'Eligibility',
        text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      },
      {
        label: 'Responsibilities',
        text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
      },
      {
        label: 'Updates',
        text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      }
    ]
  }
]

export const legalPages: Record<LegalSlug, LegalPageContent> = {
  'terms-of-service': {
    slug: 'terms-of-service',
    navLabel: 'Terms of Service',
    title: 'Terms of Service',
    metaTitle: 'Terms of Service',
    metaDescription: 'Review the Solagree terms of service for website use, service expectations, and legal guidelines.',
    sourceLabel: 'SOLAGREE.COM',
    revisionLabel: 'Date of Last Revision: March 13, 2025',
    blocks: placeholderBlocks
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
        text: '1. PERSONAL INFORMATION COLLECTION'
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
    sourceLabel: 'SOLAGREE.COM',
    revisionLabel: 'Date of Last Revision: March 13, 2025',
    blocks: placeholderBlocks
  }
}

/**
 * Type guard for validating route params against configured legal page slugs.
 */
export const isLegalSlug = (slug: string): slug is LegalSlug => slug in legalPages
