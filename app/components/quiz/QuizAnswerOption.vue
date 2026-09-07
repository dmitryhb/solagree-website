<script setup lang="ts">
const props = defineProps<{
  id: string
  value: string
  name: string
  label: string
  type?: 'radio' | 'checkbox'
  checked?: boolean
  description?: string
}>()

const emit = defineEmits<{
  change: [payload: { value: string, checked: boolean }]
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', {
    value: props.value,
    checked: target.checked
  })
}
</script>

<template>
  <label class="quiz-answer-option">
    <input
      :id="id"
      class="quiz-answer-option__control"
      :type="type ?? 'radio'"
      :name="name"
      :value="value"
      :checked="checked"
      @change="onChange"
    >
    <span class="quiz-answer-option__label">
      <span>{{ label }}</span>
      <small
        v-if="description"
        class="quiz-answer-option__description"
      >
        {{ description }}
      </small>
    </span>
  </label>
</template>
