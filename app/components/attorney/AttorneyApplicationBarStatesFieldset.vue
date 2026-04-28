<script setup lang="ts">
import { stateOptions } from '~/data/us-states'

const selectedStates = defineModel<string[]>({ required: true })

defineProps<{
  hasError: boolean
}>()
</script>

<template>
  <fieldset
    class="attorney-application-form__fieldset"
    :class="{ 'attorney-application-form__fieldset--invalid': hasError }"
  >
    <legend>
      State(s) of Bar License<span aria-hidden="true">*</span>
    </legend>
    <p
      id="attorney-bar-states-hint"
      class="attorney-application-form__hint"
    >
      Select all that apply.
    </p>

    <div
      class="attorney-application-form__state-list"
      :aria-describedby="hasError ? 'attorney-bar-states-hint attorney-bar-states-error' : 'attorney-bar-states-hint'"
      :aria-invalid="hasError ? 'true' : undefined"
    >
      <label
        v-for="state in stateOptions"
        :key="state.value"
        class="attorney-application-form__checkbox-card"
      >
        <input
          v-model="selectedStates"
          type="checkbox"
          name="barStates"
          :value="state.value"
        >
        <span>{{ state.label }}</span>
      </label>
    </div>

    <p
      v-if="hasError"
      id="attorney-bar-states-error"
      class="attorney-application-form__error"
      role="alert"
    >
      Select at least one state.
    </p>
  </fieldset>
</template>
