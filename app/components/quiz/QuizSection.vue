<script setup lang="ts">
import type { QuizStaticScreen } from '~/data/quiz'

defineProps<{
  screen: QuizStaticScreen
}>()
</script>

<template>
  <section class="quiz-section">
    <div class="section-shell quiz-section__layout">
      <header class="quiz-section__header">
        <h2 class="quiz-section__heading">
          {{ screen.heading }}
        </h2>
        <p class="quiz-section__intro">
          {{ screen.intro }}
        </p>
      </header>

      <div class="quiz-section__body">
        <QuizCardShell
          :progress="screen.progress"
          :back-label="screen.backLabel"
          :question="screen.question"
          :options="screen.options"
          :primary-action-label="screen.primaryActionLabel"
        />

        <QuizExplainer
          :title="screen.explainerTitle"
          :body="screen.explainerBody"
        />
      </div>
    </div>
  </section>
</template>
