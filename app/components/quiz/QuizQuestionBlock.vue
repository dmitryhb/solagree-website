<script setup lang="ts">
import type { QuizStaticOption } from '~/data/quiz'

defineProps<{
  questionId: string
  question: string
  options: readonly QuizStaticOption[]
}>()
</script>

<template>
  <fieldset class="quiz-question-block">
    <legend class="quiz-question-block__title">
      {{ question }}
    </legend>

    <QuizAnswerGroup
      :name="questionId"
      :options="options"
    />
  </fieldset>
</template>
