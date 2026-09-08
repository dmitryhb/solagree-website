<script setup lang="ts">
import type {
  CaseQualifierCriterionGroupDefinition,
  CaseQualifierCriterionId
} from '~/data/case-qualifier-types'

const props = defineProps<{
  group: CaseQualifierCriterionGroupDefinition
  groupNumber: number
  selectedCriterionIds: readonly CaseQualifierCriterionId[]
}>()

defineEmits<{
  change: [payload: { criterionId: CaseQualifierCriterionId, selected: boolean }]
}>()

const isSelected = (criterionId: CaseQualifierCriterionId): boolean => {
  return props.selectedCriterionIds.includes(criterionId)
}

</script>

<template>
  <fieldset class="case-qualifier-criterion-group">
    <legend class="case-qualifier-criterion-group__title">
      {{ groupNumber }}. {{ group.title }}
    </legend>

    <p class="case-qualifier-criterion-group__cue">
      <span
        class="case-qualifier-criterion-group__cue-label"
        aria-label="Listen for:"
      >💬 Listen for:</span>
      {{ group.listeningCue }}
    </p>

    <ul class="case-qualifier-criterion-group__list">
      <li
        v-for="criterion in group.criteria"
        :key="criterion.id"
      >
        <CaseQualifierCriterionCard
          :criterion="criterion"
          :selected="isSelected(criterion.id)"
          @change="$emit('change', $event)"
        />
      </li>
    </ul>
  </fieldset>
</template>
