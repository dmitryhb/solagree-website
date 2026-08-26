<script setup lang="ts">
import type {
  QuizCriterionGroupDefinition,
  QuizCriterionId
} from '~/data/quiz-types'

const props = defineProps<{
  group: QuizCriterionGroupDefinition
  groupNumber: number
  selectedCriterionIds: readonly QuizCriterionId[]
}>()

const emit = defineEmits<{
  change: [payload: { criterionId: QuizCriterionId, selected: boolean }]
}>()

const isSelected = (criterionId: QuizCriterionId): boolean => {
  return props.selectedCriterionIds.includes(criterionId)
}

const handleChange = (criterionId: QuizCriterionId, event: Event): void => {
  const input = event.target as HTMLInputElement
  emit('change', { criterionId, selected: input.checked })
}
</script>

<template>
  <fieldset class="quiz-criterion-group">
    <legend class="quiz-criterion-group__title">
      {{ groupNumber }}. {{ group.title }}
    </legend>

    <p class="quiz-criterion-group__cue">
      <span
        class="quiz-criterion-group__cue-label"
        aria-label="Listen for:"
      >💬 Listen for:</span>
      {{ group.listeningCue }}
    </p>

    <ul class="quiz-criterion-group__list">
      <li
        v-for="criterion in group.criteria"
        :key="criterion.id"
      >
        <label class="quiz-criterion-card">
          <input
            :id="`quiz-criterion-${criterion.id}`"
            class="quiz-criterion-card__control"
            type="checkbox"
            name="case-qualifier-criteria"
            :value="criterion.id"
            :checked="isSelected(criterion.id)"
            :aria-describedby="`quiz-criterion-${criterion.id}-description`"
            :data-criterion-id="criterion.id"
            @change="handleChange(criterion.id, $event)"
          >
          <span
            class="quiz-criterion-card__visual"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="quiz-criterion-card__content">
            <span class="quiz-criterion-card__title">{{ criterion.title }}</span>
            <span
              :id="`quiz-criterion-${criterion.id}-description`"
              class="quiz-criterion-card__description"
            >
              {{ criterion.description }}
            </span>
          </span>
        </label>
      </li>
    </ul>
  </fieldset>
</template>
