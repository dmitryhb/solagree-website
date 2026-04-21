<script setup lang="ts">
import type { QuizOption } from '~/data/quiz-types'

const props = defineProps<{
  id: string
  options: readonly QuizOption[]
  value?: string
  placeholder?: string
  labelledBy?: string
  describedBy?: string
}>()

const emit = defineEmits<{
  'update:value': [value: string | undefined]
}>()

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:value', target.value || undefined)
}
</script>

<template>
  <div class="quiz-select-field">
    <select
      :id="id"
      class="quiz-select-field__control"
      :value="value ?? ''"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      @change="onChange"
    >
      <option value="">
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
