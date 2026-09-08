<script setup lang="ts">
import type {
  CaseQualifierCriterionDefinition,
  CaseQualifierCriterionId
} from '~/data/case-qualifier-types'

defineProps<{
  criterion: CaseQualifierCriterionDefinition
  selected: boolean
}>()

const emit = defineEmits<{
  change: [payload: { criterionId: CaseQualifierCriterionId, selected: boolean }]
}>()

const handleChange = (criterionId: CaseQualifierCriterionId, event: Event): void => {
  const input = event.target as HTMLInputElement
  emit('change', { criterionId, selected: input.checked })
}
</script>

<template>
  <label class="case-qualifier-criterion-card">
    <input
      :id="`case-qualifier-criterion-${criterion.id}`"
      class="case-qualifier-criterion-card__control"
      type="checkbox"
      name="case-qualifier-criteria"
      :value="criterion.id"
      :checked="selected"
      :aria-describedby="`case-qualifier-criterion-${criterion.id}-description`"
      :data-criterion-id="criterion.id"
      @change="handleChange(criterion.id, $event)"
    >
    <span
      class="case-qualifier-criterion-card__visual"
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
    <span class="case-qualifier-criterion-card__content">
      <span class="case-qualifier-criterion-card__title">{{ criterion.title }}</span>
      <span
        :id="`case-qualifier-criterion-${criterion.id}-description`"
        class="case-qualifier-criterion-card__description"
      >
        {{ criterion.description }}
      </span>
    </span>
  </label>
</template>
