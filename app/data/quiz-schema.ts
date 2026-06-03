import type {
  QuizQuestionDefinition,
  QuizQuestionId
} from '~/data/quiz-types'
import { stateOptions } from '~/data/us-states'

const solagreeStateOptions = stateOptions.map(({ value, label }) => ({ id: value, label }))

const solagreeQuizExplainerTitle = 'Why are we asking this?'

export const solagreeQuizQuestions = [
  {
    id: 'state',
    kind: 'select',
    title: 'Where will your divorce be filed?',
    description: 'Select the U.S. state or district connected to your divorce filing.',
    placeholder: 'Choose a state',
    options: solagreeStateOptions
  },
  {
    id: 'children',
    kind: 'single-select',
    title: 'Do you have children under 21?',
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
    description: 'Select one or more answers:',
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
    title: 'Do you have financial questions about your divorce?',
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
    description: 'Select one or more answers:',
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
    title: 'Do you have contact information for your spouse (we will not ask you to provide it at this time)?',
    options: [
      { id: 'direct-contact', label: 'Yes' },
      { id: 'cannot-find', label: 'No' },
      { id: 'unknown-whereabouts', label: 'Not Sure' }
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
    title: 'Do you have the ability to pay for a service to help you?',
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
