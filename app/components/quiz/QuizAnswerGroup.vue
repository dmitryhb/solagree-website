<script setup lang="ts">
import type { QuizOption } from '~/data/quiz-types'

const props = defineProps<{
  name: string
  type?: 'single-select' | 'multi-select'
  value?: string | readonly string[]
  options: readonly QuizOption[]
}>()

const emit = defineEmits<{
  change: [payload: { value: string, checked: boolean }]
}>()

const isChecked = (optionId: string) => {
  if (Array.isArray(props.value)) {
    return props.value.includes(optionId)
  }

  return props.value === optionId
}
</script>

<template>
  <div class="quiz-question-block__options">
    <QuizAnswerOption
      v-for="option in options"
      :id="`${name}-${option.id}`"
      :key="option.id"
      :value="option.id"
      :name="name"
      :label="option.label"
      :description="option.description"
      :type="type === 'multi-select' ? 'checkbox' : 'radio'"
      :checked="isChecked(option.id)"
      @change="emit('change', $event)"
    />
  </div>
</template>
