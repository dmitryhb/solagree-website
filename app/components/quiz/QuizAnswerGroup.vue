<script setup lang="ts">
import type { QuizStaticOption } from '~/data/quiz'

defineProps<{
  name: string
  options: readonly QuizStaticOption[]
}>()
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
    />
  </div>
</template>
