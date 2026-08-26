export const solagreeQuizSchemaVersion = 3 as const

export const solagreeQuizStorageKey = 'solagree.quiz.session.v3'

export const solagreeQuizLegacyStorageKeys = [
  'solagree.quiz.session.v1',
  'solagree.quiz.session.v2'
] as const

export const solagreeQuizCopy = {
  title: 'The Case Qualifier',
  subtitle: 'A 15-second case selection guide for family law practitioners',
  instructions:
    "Check each criterion your client meets during your initial consultation. If they match 3 or more, they're likely a strong candidate for Solagree. Your recommendation will update in real-time on the right.",
  assessmentTitle: 'Case Assessment',
  awaitingLabel: 'Awaiting Assessment',
  scoreLabel: 'Criteria Met'
} as const
