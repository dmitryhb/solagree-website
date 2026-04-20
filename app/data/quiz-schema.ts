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

const solagreeQuizExplainerTitle = 'Why are we asking this?'

export const solagreeQuizQuestions = [
  {
    id: 'state',
    kind: 'select',
    title: 'Which state will your divorce be filed in?',
    description: 'Select the U.S. state or district connected to your divorce filing.',
    placeholder: 'Choose a state',
    options: solagreeStateOptions.map(([id, label]) => ({ id, label }))
  },
  {
    id: 'children',
    kind: 'single-select',
    title: 'Do you have children under 18?',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' }
    ]
  },
  {
    id: 'parentingScreener',
    kind: 'single-select',
    title: 'Do you need help working through parenting, custody, or child-support issues?',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' }
    ],
    explainerTitle: solagreeQuizExplainerTitle,
    explainerBody: 'Examples: custody, parenting time, visitation, child support, or decision-making for the children.',
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
    explainerTitle: solagreeQuizExplainerTitle,
    explainerBody: 'Examples: your home, bank accounts, retirement accounts, debts, spousal support, or who keeps what.'
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
    ]
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
    ]
  },
  {
    id: 'paymentReadiness',
    kind: 'single-select',
    title: 'Are you ready to pay for divorce support now?',
    options: [
      { id: 'ready-now', label: 'Yes, I am ready now' },
      { id: 'need-payment-plan', label: 'I would need a payment plan' },
      { id: 'not-ready', label: 'No, not right now' }
    ]
  }
] as const satisfies readonly QuizQuestionDefinition[]

export const solagreeQuizQuestionIds = solagreeQuizQuestions.map(question => question.id) as readonly QuizQuestionId[]

export const solagreeQuizQuestionMap = Object.fromEntries(
  solagreeQuizQuestions.map(question => [question.id, question])
) as Record<QuizQuestionId, (typeof solagreeQuizQuestions)[number]>
