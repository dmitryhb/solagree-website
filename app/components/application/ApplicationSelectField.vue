<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from '~/types/form-options'

const model = defineModel<string>({ required: true })

type FormSelectOption = SelectOption & { disabled?: boolean }

const props = withDefaults(defineProps<{
  id: string
  label: string
  name: string
  options: readonly FormSelectOption[]
  autocomplete?: string
  describedBy?: string
  disabled?: boolean
  hint?: string
  hintId?: string
  labelVisuallyHidden?: boolean
  optionalLabel?: string
  placeholder?: string
  placeholderDisabled?: boolean
  required?: boolean
  showRequiredIndicator?: boolean
  variant?: 'default' | 'webinar' | 'co-branded'
}>(), {
  autocomplete: undefined,
  describedBy: undefined,
  disabled: false,
  hint: undefined,
  hintId: undefined,
  labelVisuallyHidden: false,
  optionalLabel: undefined,
  placeholder: 'Select...',
  placeholderDisabled: true,
  required: false,
  showRequiredIndicator: true,
  variant: 'default'
})

const resolvedDescribedBy = computed(() => {
  return [
    props.describedBy,
    props.hint && props.hintId ? props.hintId : undefined
  ].filter(Boolean).join(' ') || undefined
})
</script>

<template>
  <div
    class="form-field form-field--select"
    :class="`form-field--${variant}`"
  >
    <label
      class="form-field__label"
      :class="{ 'sr-only': labelVisuallyHidden }"
      :for="id"
    >
      {{ label }}<small
        v-if="optionalLabel"
        class="form-field__optional"
      > {{ optionalLabel }}</small><span
        v-if="required && showRequiredIndicator && !labelVisuallyHidden"
        class="form-field__required"
        aria-hidden="true"
      >*</span>
    </label>
    <p
      v-if="hint && hintId"
      :id="hintId"
      class="form-field__hint"
    >
      {{ hint }}
    </p>
    <select
      :id="id"
      v-model="model"
      class="form-field__control"
      :name="name"
      :autocomplete="autocomplete"
      :aria-describedby="resolvedDescribedBy"
      :disabled="disabled"
      :required="required"
    >
      <option
        value=""
        :disabled="placeholderDisabled"
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <span
      v-if="variant === 'webinar'"
      class="form-field__chevron"
      aria-hidden="true"
    />
  </div>
</template>
