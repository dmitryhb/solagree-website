<script setup lang="ts">
import type { QuizStaticOption } from '~/data/quiz'

defineProps<{
  question: string
  options: readonly QuizStaticOption[]
}>()
</script>

<template>
  <div class="quiz-question-block">
    <h3 class="quiz-question-block__title">
      {{ question }}
    </h3>

    <div class="quiz-question-block__options">
      <QuizAnswerOption
        v-for="option in options"
        :key="option.id"
        :label="option.label"
      />
    </div>
  </div>
</template>
