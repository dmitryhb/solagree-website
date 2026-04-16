<script setup lang="ts">
import type { QuizOption } from '~/data/quiz-types'

const props = defineProps<{
  id: string
  options: readonly QuizOption[]
  value?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  change: [value: string | undefined]
}>()

const normalizedValue = computed(() => props.value ?? '')

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('change', target.value || undefined)
}
</script>

<template>
  <div class="quiz-select-field">
    <select
      :key="normalizedValue"
      :id="id"
      class="quiz-select-field__control"
      :value="normalizedValue"
      @change="onChange"
    >
      <option
        value=""
        :selected="normalizedValue === ''"
      >
        {{ placeholder ?? 'Select one' }}
      </option>

      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
        :selected="normalizedValue === option.id"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
