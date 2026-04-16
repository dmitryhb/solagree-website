<script setup lang="ts">
import type { QuizStaticOption } from '~/data/quiz'

defineProps<{
  progress: number
  backLabel: string
  question: string
  options: readonly QuizStaticOption[]
  primaryActionLabel: string
}>()
</script>

<template>
  <article class="quiz-card-shell">
    <div class="quiz-card-shell__inner">
      <div class="quiz-card-shell__frame">
        <QuizProgressMeter :value="progress" />

        <div class="quiz-card-shell__back">
          <QuizBackButton :label="backLabel" />
        </div>

        <QuizQuestionBlock
          class="quiz-card-shell__question"
          :question="question"
          :options="options"
        />

        <div class="quiz-card-shell__action">
          <QuizPrimaryAction :label="primaryActionLabel" />
        </div>
      </div>
    </div>
  </article>
</template>
