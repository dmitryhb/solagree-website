<script setup lang="ts">
import { solagreeQuizShellContent } from '~/data/quiz'

const quizSession = useQuizSession()
const explainer = computed(() => {
  if (quizSession.phase.value === 'complete') {
    return {
      title: 'Why does the flow stop here?',
      body:
        'The question flow and local persistence are complete here, while recommendation routing stays isolated for the next implementation slice.'
    }
  }

  return {
    title: quizSession.currentQuestion.value.explainerTitle,
    body: quizSession.currentQuestion.value.explainerBody
  }
})
</script>

<template>
  <section class="quiz-section">
    <div class="quiz-section__layout">
      <header class="quiz-section__header">
        <h2 class="quiz-section__heading">
          {{ solagreeQuizShellContent.heading }}
        </h2>
        <p class="quiz-section__intro">
          {{ solagreeQuizShellContent.intro }}
        </p>
      </header>

      <div class="quiz-section__body">
        <QuizCardShell
          :progress="quizSession.progressValue.value"
          :back-label="quizSession.labels.backLabel"
          :question="quizSession.phase.value === 'complete' ? undefined : quizSession.currentQuestion.value"
          :value="quizSession.currentValue.value"
          :primary-action-label="quizSession.primaryActionLabel.value"
          :can-go-back="quizSession.canGoBack.value"
          :can-advance="quizSession.canAdvance.value"
          :completion-title="quizSession.completionContent.title"
          :completion-body="quizSession.completionContent.body"
          @back="quizSession.goBack"
          @advance="quizSession.goNext"
          @single-change="quizSession.setSingleAnswer(quizSession.currentQuestionId.value, $event)"
          @multi-change="quizSession.toggleMultiAnswer(quizSession.currentQuestionId.value, $event.value, $event.checked)"
        />

        <QuizExplainer
          :title="explainer.title"
          :body="explainer.body"
        />
      </div>
    </div>
  </section>
</template>
