export const solagreeCaseQualifierSchemaVersion = 1 as const

export const solagreeCaseQualifierStorageKey = 'solagree.case-qualifier.session.v1'

export const solagreeCaseQualifierLegacyStorageKeys = [] as const

export const solagreeCaseQualifierCopy = {
  title: 'The Case Qualifier',
  subtitle: 'A 15-second case selection guide for family law practitioners',
  instructions:
    "Check each criterion your client meets during your initial consultation. If they match 3 or more, they're likely a strong candidate for Solagree. Your recommendation will update in real-time on the right.",
  assessmentTitle: 'Case Assessment',
  awaitingLabel: 'Awaiting Assessment',
  scoreLabel: 'Criteria Met'
} as const
