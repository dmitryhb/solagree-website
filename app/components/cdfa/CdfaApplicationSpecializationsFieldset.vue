<script setup lang="ts">
import FormCheckboxGroup from '~/components/form/FormCheckboxGroup.vue'
import { cdfaSpecializationOptions } from '~/data/cdfa-application'

const model = defineModel<string[]>({ required: true })

defineProps<{
  hasError: boolean
}>()
</script>

<template>
  <FormCheckboxGroup
    v-model="model"
    name="specializations"
    legend="Which areas of divorce financial analysis do you specialize in?"
    :options="cdfaSpecializationOptions"
    :error="hasError ? 'Select at least one specialization.' : undefined"
    error-id="cdfa-specializations-error"
    required
  />
</template>
