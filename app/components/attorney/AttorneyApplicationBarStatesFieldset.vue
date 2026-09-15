<script setup lang="ts">
import FormCheckboxGroup from '~/components/form/FormCheckboxGroup.vue'
import { stateOptions } from '~/data/us-states'

const selectedStates = defineModel<string[]>({ required: true })

defineProps<{
  hasError: boolean
}>()
</script>

<template>
  <FormCheckboxGroup
    v-model="selectedStates"
    name="barStates"
    legend="State(s) of Bar License"
    :options="stateOptions"
    hint="Select all that apply."
    hint-id="attorney-bar-states-hint"
    :error="hasError ? 'Select at least one state.' : undefined"
    error-id="attorney-bar-states-error"
    required
  />
</template>
