<script setup lang="ts">
const props = defineProps<{
  id?: string
  modelValue: boolean
  name: string
  disabled?: boolean
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label
    class="form-checkbox-field"
    :for="props.id"
  >
    <input
      :id="props.id"
      class="form-checkbox-field__control"
      type="checkbox"
      :name="props.name"
      :checked="props.modelValue"
      :disabled="props.disabled"
      :required="props.required"
      @change="updateValue"
    >
    <span><slot /></span>
  </label>
</template>
