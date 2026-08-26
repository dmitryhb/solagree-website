import type { ConsultRequestQuizAnswer } from '#shared/types/consult-request'
import { solagreeQuizStorageKey } from '~/data/quiz'
import { solagreeQuizCriterionMap } from '~/data/quiz-schema'
import { parseQuizSessionSnapshot } from '~/utils/quiz-session'

/** Reads a valid v3 qualifier snapshot for optional Initial Consult intake context. */
export const getStoredConsultQuizAnswers = (): ConsultRequestQuizAnswer[] => {
  if (!import.meta.client) {
    return []
  }

  const snapshotText = window.localStorage.getItem(solagreeQuizStorageKey)

  if (!snapshotText) {
    return []
  }

  try {
    const snapshot = parseQuizSessionSnapshot(JSON.parse(snapshotText) as unknown)

    if (!snapshot || snapshot.selectedCriterionIds.length === 0) {
      return []
    }

    return [{
      questionId: 'case-qualifier-criteria',
      question: 'Which case qualifier criteria apply?',
      value: [...snapshot.selectedCriterionIds],
      answerLabels: snapshot.selectedCriterionIds.map(
        criterionId => solagreeQuizCriterionMap[criterionId].title
      )
    }]
  } catch {
    return []
  }
}
