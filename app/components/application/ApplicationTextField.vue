<script setup lang="ts">
import { computed } from 'vue'

const model = defineModel<string>({ required: true })

const props = withDefaults(defineProps<{
  id: string
  label: string
  name: string
  autocomplete?: string
  describedBy?: string
  disabled?: boolean
  hint?: string
  hintId?: string
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  labelVisuallyHidden?: boolean
  max?: number | string
  maxlength?: number | string
  min?: number | string
  multiline?: boolean
  optionalLabel?: string
  pattern?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  rows?: number | string
  showRequiredIndicator?: boolean
  title?: string
  type?: string
  variant?: 'default' | 'contact' | 'webinar' | 'co-branded'
}>(), {
  autocomplete: undefined,
  describedBy: undefined,
  disabled: false,
  hint: undefined,
  hintId: undefined,
  inputmode: undefined,
  labelVisuallyHidden: false,
  max: undefined,
  maxlength: undefined,
  min: undefined,
  multiline: false,
  optionalLabel: undefined,
  pattern: undefined,
  placeholder: undefined,
  readonly: false,
  required: false,
  rows: 3,
  showRequiredIndicator: true,
  title: undefined,
  type: 'text',
  variant: 'default'
})

const resolvedPlaceholder = computed(() => {
  return props.placeholder ?? (props.variant === 'default' ? 'Type here...' : undefined)
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
    class="form-field"
    :class="[
      `form-field--${variant}`,
      { 'form-field--multiline': multiline }
    ]"
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
    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      class="form-field__control"
      :name="name"
      :rows="rows"
      :autocomplete="autocomplete"
      :aria-describedby="resolvedDescribedBy"
      :disabled="disabled"
      :inputmode="inputmode"
      :maxlength="maxlength"
      :placeholder="resolvedPlaceholder"
      :readonly="readonly"
      :required="required"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      class="form-field__control"
      :name="name"
      :type="type"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :inputmode="inputmode"
      :min="min"
      :max="max"
      :maxlength="maxlength"
      :pattern="pattern"
      :placeholder="resolvedPlaceholder"
      :readonly="readonly"
      :required="required"
      :title="title"
      :aria-describedby="resolvedDescribedBy"
    >
  </div>
</template>
