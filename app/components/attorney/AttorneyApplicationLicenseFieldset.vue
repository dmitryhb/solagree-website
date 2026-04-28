<script setup lang="ts">
import type { AttorneyLicenseNumberRow } from '~/composables/useAttorneyApplicationForm'

defineProps<{
  rows: AttorneyLicenseNumberRow[]
  hasAttemptedSubmit: boolean
  hasError: boolean
}>()

const emit = defineEmits<{
  add: []
  remove: [id: string]
  update: [id: string, value: string]
}>()
</script>

<template>
  <fieldset class="attorney-application-form__fieldset">
    <legend>
      License #<span aria-hidden="true">*</span>
    </legend>

    <div class="attorney-application-form__license-list">
      <div
        v-for="(row, index) in rows"
        :key="row.id"
        class="attorney-application-form__license-row"
      >
        <label
          class="sr-only"
          :for="`attorney-${row.id}`"
        >
          License number {{ index + 1 }}
        </label>
        <input
          :id="`attorney-${row.id}`"
          :value="row.value"
          :name="`licenseNumber-${index}`"
          type="text"
          placeholder="Type here..."
          :aria-invalid="hasAttemptedSubmit && !row.value.trim() ? 'true' : undefined"
          :aria-describedby="hasError ? 'attorney-license-error' : undefined"
          required
          @input="emit('update', row.id, ($event.target as HTMLInputElement).value)"
        >
        <button
          class="attorney-application-form__small-action"
          type="button"
          :aria-label="`Remove license number ${index + 1}`"
          @click="emit('remove', row.id)"
        >
          Remove
        </button>
      </div>
    </div>

    <button
      class="attorney-application-form__add-license"
      type="button"
      @click="emit('add')"
    >
      Add another License #
    </button>

    <p
      v-if="hasError"
      id="attorney-license-error"
      class="attorney-application-form__error"
      role="alert"
    >
      Enter a license number for every license field.
    </p>
  </fieldset>
</template>
