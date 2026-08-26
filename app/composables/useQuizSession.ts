import {
  solagreeQuizLegacyStorageKeys,
  solagreeQuizSchemaVersion,
  solagreeQuizStorageKey
} from '~/data/quiz'
import type { QuizCriterionId, QuizPersistedSession } from '~/data/quiz-types'
import {
  evaluateQuizAnswers,
  getQuizProgressValue,
  getQuizResultViewModel
} from '~/utils/quiz-results'
import { toggleQuizCriterionSelection } from '~/utils/quiz-selection'
import { parseQuizSessionSnapshot } from '~/utils/quiz-session'

/** Owns qualifier selection, deterministic assessment, reset, and v3 persistence. */
export const useQuizSession = () => {
  const selectedCriterionIds = ref<QuizCriterionId[]>([])
  const hasRestoredPersistedState = ref(false)
  const evaluation = computed(() => evaluateQuizAnswers(selectedCriterionIds.value))
  const score = computed(() => evaluation.value.score)
  const outcome = computed(() => evaluation.value.outcome)
  const progressValue = computed(() => getQuizProgressValue(score.value))
  const resultView = computed(() => getQuizResultViewModel(score.value))

  const isSelected = (criterionId: QuizCriterionId): boolean => {
    return selectedCriterionIds.value.includes(criterionId)
  }

  const setCriterionSelected = (criterionId: QuizCriterionId, selected: boolean): void => {
    selectedCriterionIds.value = toggleQuizCriterionSelection(
      selectedCriterionIds.value,
      criterionId,
      selected
    )
  }

  const reset = (): void => {
    selectedCriterionIds.value = []

    if (import.meta.client) {
      window.localStorage.removeItem(solagreeQuizStorageKey)
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      solagreeQuizLegacyStorageKeys.forEach((legacyKey) => {
        window.localStorage.removeItem(legacyKey)
      })

      const snapshotText = window.localStorage.getItem(solagreeQuizStorageKey)

      if (!snapshotText) {
        hasRestoredPersistedState.value = true
        return
      }

      try {
        const snapshot = parseQuizSessionSnapshot(JSON.parse(snapshotText) as unknown)

        if (!snapshot) {
          window.localStorage.removeItem(solagreeQuizStorageKey)
          return
        }

        selectedCriterionIds.value = snapshot.selectedCriterionIds
      } catch {
        window.localStorage.removeItem(solagreeQuizStorageKey)
      } finally {
        hasRestoredPersistedState.value = true
      }
    })

    watch(selectedCriterionIds, (selectedIds) => {
      if (!hasRestoredPersistedState.value) {
        return
      }

      if (selectedIds.length === 0) {
        window.localStorage.removeItem(solagreeQuizStorageKey)
        return
      }

      const snapshot: QuizPersistedSession = {
        version: solagreeQuizSchemaVersion,
        selectedCriterionIds: [...selectedIds]
      }

      window.localStorage.setItem(solagreeQuizStorageKey, JSON.stringify(snapshot))
    })
  }

  return {
    selectedCriterionIds: readonly(selectedCriterionIds),
    hasRestoredPersistedState: readonly(hasRestoredPersistedState),
    evaluation,
    score,
    outcome,
    progressValue,
    resultView,
    isSelected,
    setCriterionSelected,
    reset
  }
}
