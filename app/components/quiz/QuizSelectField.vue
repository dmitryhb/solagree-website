<script setup lang="ts">
import type { QuizOption } from '~/data/quiz-types'

const props = defineProps<{
  id: string
  options: readonly QuizOption[]
  value?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  change: [value: string]
}>()

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('change', target.value)
}
</script>

<template>
  <div class="quiz-select-field">
    <select
      :id="id"
      class="quiz-select-field__control"
      :value="props.value ?? ''"
      @change="onChange"
    >
      <option
        value=""
        disabled
      >
        {{ placeholder ?? 'Select one' }}
      </option>

      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
