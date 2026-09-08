import {
  solagreeCaseQualifierLegacyStorageKeys,
  solagreeCaseQualifierSchemaVersion,
  solagreeCaseQualifierStorageKey
} from '~/data/case-qualifier'
import type { CaseQualifierCriterionId, CaseQualifierPersistedSession } from '~/data/case-qualifier-types'
import {
  evaluateCaseQualifierAnswers,
  getCaseQualifierProgressValue,
  getCaseQualifierResultViewModel
} from '~/utils/case-qualifier-results'
import { toggleCaseQualifierCriterionSelection } from '~/utils/case-qualifier-selection'
import { parseCaseQualifierSessionSnapshot } from '~/utils/case-qualifier-session'

/** Owns qualifier selection, deterministic assessment, reset, and v1 persistence. */
export const useCaseQualifierSession = () => {
  const selectedCriterionIds = ref<CaseQualifierCriterionId[]>([])
  const hasRestoredPersistedState = ref(false)
  const evaluation = computed(() => evaluateCaseQualifierAnswers(selectedCriterionIds.value))
  const score = computed(() => evaluation.value.score)
  const outcome = computed(() => evaluation.value.outcome)
  const progressValue = computed(() => getCaseQualifierProgressValue(score.value))
  const resultView = computed(() => getCaseQualifierResultViewModel(score.value))

  const isSelected = (criterionId: CaseQualifierCriterionId): boolean => {
    return selectedCriterionIds.value.includes(criterionId)
  }

  const setCriterionSelected = (criterionId: CaseQualifierCriterionId, selected: boolean): void => {
    selectedCriterionIds.value = toggleCaseQualifierCriterionSelection(
      selectedCriterionIds.value,
      criterionId,
      selected
    )
  }

  const reset = (): void => {
    selectedCriterionIds.value = []

    if (import.meta.client) {
      window.localStorage.removeItem(solagreeCaseQualifierStorageKey)
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      solagreeCaseQualifierLegacyStorageKeys.forEach((legacyKey) => {
        window.localStorage.removeItem(legacyKey)
      })

      const snapshotText = window.localStorage.getItem(solagreeCaseQualifierStorageKey)

      if (!snapshotText) {
        hasRestoredPersistedState.value = true
        return
      }

      try {
        const snapshot = parseCaseQualifierSessionSnapshot(JSON.parse(snapshotText) as unknown)

        if (!snapshot) {
          window.localStorage.removeItem(solagreeCaseQualifierStorageKey)
          return
        }

        selectedCriterionIds.value = snapshot.selectedCriterionIds
      } catch {
        window.localStorage.removeItem(solagreeCaseQualifierStorageKey)
      } finally {
        hasRestoredPersistedState.value = true
      }
    })

    watch(selectedCriterionIds, (selectedIds) => {
      if (!hasRestoredPersistedState.value) {
        return
      }

      if (selectedIds.length === 0) {
        window.localStorage.removeItem(solagreeCaseQualifierStorageKey)
        return
      }

      const snapshot: CaseQualifierPersistedSession = {
        version: solagreeCaseQualifierSchemaVersion,
        selectedCriterionIds: [...selectedIds]
      }

      window.localStorage.setItem(solagreeCaseQualifierStorageKey, JSON.stringify(snapshot))
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
