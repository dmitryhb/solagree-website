<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from '~/types/form-options'

const model = defineModel<string[]>({ required: true })

const props = withDefaults(defineProps<{
  name: string
  legend: string
  options: readonly SelectOption[]
  error?: string
  errorId?: string
  hint?: string
  hintId?: string
  required?: boolean
}>(), {
  error: undefined,
  errorId: undefined,
  hint: undefined,
  hintId: undefined,
  required: false
})

const describedBy = computed(() => {
  return [
    props.hint && props.hintId ? props.hintId : undefined,
    props.error && props.errorId ? props.errorId : undefined
  ].filter(Boolean).join(' ') || undefined
})
</script>

<template>
  <fieldset
    class="form-checkbox-group"
    :class="{ 'form-checkbox-group--invalid': error }"
  >
    <legend>
      {{ legend }}<span
        v-if="required"
        class="form-field__required"
        aria-hidden="true"
      >*</span>
    </legend>

    <p
      v-if="hint && hintId"
      :id="hintId"
      class="form-field__hint"
    >
      {{ hint }}
    </p>

    <div class="form-checkbox-group__options">
      <label
        v-for="option in options"
        :key="option.value"
        class="form-checkbox-group__option"
      >
        <input
          v-model="model"
          type="checkbox"
          :name="name"
          :value="option.value"
          :aria-invalid="error ? 'true' : undefined"
          :aria-describedby="describedBy"
        >
        <span>{{ option.label }}</span>
      </label>
    </div>

    <p
      v-if="error && errorId"
      :id="errorId"
      class="form-field__error"
      role="alert"
    >
      {{ error }}
    </p>
  </fieldset>
</template>
