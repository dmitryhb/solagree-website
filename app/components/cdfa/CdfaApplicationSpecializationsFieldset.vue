<script setup lang="ts">
import { cdfaSpecializationOptions } from '~/data/cdfa-application'

const model = defineModel<string[]>({ required: true })

defineProps<{
  hasError: boolean
}>()
</script>

<template>
  <fieldset
    class="attorney-application-form__fieldset"
    :class="{ 'attorney-application-form__fieldset--invalid': hasError }"
    :aria-invalid="hasError"
    :aria-describedby="hasError ? 'cdfa-specializations-error' : undefined"
  >
    <legend>
      Which areas of divorce financial analysis do you specialize in?<span aria-hidden="true">*</span>
    </legend>

    <div class="attorney-application-form__state-list">
      <label
        v-for="option in cdfaSpecializationOptions"
        :key="option.value"
        class="attorney-application-form__checkbox-card"
      >
        <input
          v-model="model"
          name="specializations"
          type="checkbox"
          :value="option.value"
        >
        <span>{{ option.label }}</span>
      </label>
    </div>

    <p
      v-if="hasError"
      id="cdfa-specializations-error"
      class="attorney-application-form__error"
    >
      Select at least one specialization.
    </p>
  </fieldset>
</template>
