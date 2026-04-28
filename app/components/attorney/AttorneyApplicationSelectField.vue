<script setup lang="ts">
import type { AttorneySelectOption } from '~/types/attorney-application'

const model = defineModel<string>({ required: true })

withDefaults(defineProps<{
  id: string
  label: string
  name: string
  options: readonly AttorneySelectOption[]
  hint?: string
  hintId?: string
  required?: boolean
}>(), {
  hint: undefined,
  hintId: undefined,
  required: false
})
</script>

<template>
  <div class="attorney-application-form__field attorney-application-form__field--select">
    <label :for="id">
      {{ label }}<span
        v-if="required"
        aria-hidden="true"
      >*</span>
    </label>
    <p
      v-if="hint && hintId"
      :id="hintId"
      class="attorney-application-form__hint"
    >
      {{ hint }}
    </p>
    <select
      :id="id"
      v-model="model"
      :name="name"
      :aria-describedby="hint && hintId ? hintId : undefined"
      :required="required"
    >
      <option
        value=""
        disabled
      >
        Select...
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
