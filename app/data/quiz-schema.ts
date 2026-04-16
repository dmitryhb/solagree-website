import type {
  QuizQuestionDefinition,
  QuizQuestionId,
  QuizStateCode
} from '~/data/quiz-types'

const solagreeStateOptions = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['DC', 'District of Columbia'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming']
] as const satisfies ReadonlyArray<readonly [QuizStateCode, string]>

export const solagreeQuizQuestions = [
  {
    id: 'state',
    kind: 'select',
    title: 'Which state will your divorce be filed in?',
    description: 'Select the U.S. state or district connected to your divorce filing.',
    placeholder: 'Choose a state',
    options: solagreeStateOptions.map(([id, label]) => ({ id, label })),
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'Divorce rules and next steps differ by state, so we need the filing jurisdiction before we guide the rest of the flow.'
  },
  {
    id: 'children',
    kind: 'single-select',
    title: 'Do you have children under 18?',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'Children can introduce parenting, custody, and support questions that affect which Solagree path is most appropriate.'
  },
  {
    id: 'parentingScreener',
    kind: 'single-select',
    title: 'Do you need help working through parenting, custody, or child-support issues?',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'This tells us whether parenting-related topics need to stay visible in the flow instead of assuming a simpler filing path.',
    isVisible: answers => answers.children === 'yes'
  },
  {
    id: 'parentingDetails',
    kind: 'multi-select',
    title: 'Which parenting topics apply to your situation?',
    description: 'Select all that apply.',
    options: [
      { id: 'custody-schedule', label: 'Custody or parenting-time schedule' },
      { id: 'decision-making', label: 'Decision-making responsibilities' },
      { id: 'child-support', label: 'Child support' },
      { id: 'communication-conflict', label: 'Co-parenting communication or conflict' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'These details stay separate from the UI so later policy and internal tags can reason about the parenting branch cleanly.',
    isVisible: answers => answers.children === 'yes' && answers.parentingScreener === 'yes'
  },
  {
    id: 'financialScreener',
    kind: 'single-select',
    title: 'Are there financial issues that may complicate your divorce?',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'Financial complexity often changes the level of support a couple needs, so we keep that branch explicit in the schema.'
  },
  {
    id: 'financialDetails',
    kind: 'multi-select',
    title: 'Which financial topics apply to your situation?',
    description: 'Select all that apply.',
    options: [
      { id: 'real-estate', label: 'A home, real estate, or major property' },
      { id: 'retirement-assets', label: 'Retirement accounts or investments' },
      { id: 'business-self-employment', label: 'A business or self-employment income' },
      { id: 'spousal-support', label: 'Spousal support or alimony' },
      { id: 'debts-assets', label: 'Debt, asset division, or other complex finances' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'The detailed financial branch is stored separately so future evaluation and internal flags can identify complexity without reading UI state.',
    isVisible: answers => answers.financialScreener === 'yes'
  },
  {
    id: 'spouseContact',
    kind: 'single-select',
    title: 'What best describes your current contact with your spouse?',
    options: [
      { id: 'direct-contact', label: 'We are in direct contact' },
      { id: 'know-where-not-communicating', label: 'I know where they are, but we are not communicating' },
      { id: 'cannot-find', label: 'I cannot find them' },
      { id: 'unknown-whereabouts', label: 'I do not know where they are or what to expect' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'Spouse availability affects which later questions are relevant and keeps unresolved missing-spouse policy branches explicit for the result engine.'
  },
  {
    id: 'spouseCooperation',
    kind: 'single-select',
    title: 'Do you expect your spouse to cooperate in the divorce process?',
    options: [
      { id: 'yes', label: 'Yes, I expect them to cooperate' },
      { id: 'no', label: 'No, I expect resistance' },
      { id: 'not-sure', label: 'I am not sure yet' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'Cooperation only matters when the spouses are in contact, so this branch stays conditional instead of being baked into presentation logic.',
    isVisible: answers => answers.spouseContact === 'direct-contact'
  },
  {
    id: 'legalAdvice',
    kind: 'single-select',
    title: 'Do you think you need legal advice before moving forward?',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
      { id: 'not-sure', label: 'I am not sure' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'This branch is important for final routing later, but the policy itself stays outside the UI and remains explicit until HIR-39.'
  },
  {
    id: 'paymentReadiness',
    kind: 'single-select',
    title: 'Are you ready to pay for divorce support now?',
    options: [
      { id: 'ready-now', label: 'Yes, I am ready now' },
      { id: 'need-payment-plan', label: 'I would need a payment plan' },
      { id: 'not-ready', label: 'No, not right now' }
    ],
    explainerTitle: 'Why are we asking this?',
    explainerBody:
      'Payment readiness is part of the quiz model so later policy can handle it explicitly without mixing qualification logic into the components.'
  }
] as const satisfies readonly QuizQuestionDefinition[]

export const solagreeQuizQuestionIds = solagreeQuizQuestions.map(question => question.id) as readonly QuizQuestionId[]

export const solagreeQuizQuestionMap = Object.fromEntries(
  solagreeQuizQuestions.map(question => [question.id, question])
) as Record<QuizQuestionId, (typeof solagreeQuizQuestions)[number]>
