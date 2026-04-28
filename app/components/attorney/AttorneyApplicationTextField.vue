<script setup lang="ts">
const model = defineModel<string>({ required: true })

withDefaults(defineProps<{
  id: string
  label: string
  name: string
  autocomplete?: string
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  max?: number | string
  min?: number | string
  multiline?: boolean
  placeholder?: string
  required?: boolean
  rows?: number | string
  type?: string
}>(), {
  autocomplete: undefined,
  inputmode: undefined,
  max: undefined,
  min: undefined,
  multiline: false,
  placeholder: 'Type here...',
  required: false,
  rows: 3,
  type: 'text'
})
</script>

<template>
  <div class="attorney-application-form__field">
    <label :for="id">
      {{ label }}<span
        v-if="required"
        aria-hidden="true"
      >*</span>
    </label>
    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      :name="name"
      :rows="rows"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :required="required"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      :name="name"
      :type="type"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :required="required"
    >
  </div>
</template>
