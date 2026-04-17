<script setup lang="ts">
import type { QuizHostConfigInput, QuizHostEvent } from '~/data/quiz-types'
import { solagreeQuizShellContent } from '~/data/quiz'

const props = defineProps<{
  hostConfig?: QuizHostConfigInput
}>()

const emit = defineEmits<{
  hostEvent: [event: QuizHostEvent]
}>()

const quizSession = useQuizSession()
const quizHost = useQuizHost(quizSession, {
  hostConfig: toRef(props, 'hostConfig'),
  onEvent: event => emit('hostEvent', event)
})
const quizBodyRef = ref<HTMLElement | null>(null)
const explainer = computed(() => {
  return {
    title: quizSession.currentQuestion.value.explainerTitle,
    body: quizSession.currentQuestion.value.explainerBody
  }
})

function getQuizScrollBehavior(): ScrollBehavior {
  if (!import.meta.client) {
    return 'auto'
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

async function scrollQuizToTop() {
  if (!import.meta.client) {
    return
  }

  await nextTick()

  const quizBody = quizBodyRef.value
  if (!quizBody) {
    return
  }

  const top = Math.max(window.scrollY + quizBody.getBoundingClientRect().top - 24, 0)
  window.scrollTo({
    top,
    behavior: getQuizScrollBehavior()
  })
}

function hasRevealedQuizResult(previousPhase: typeof quizSession.phase.value) {
  return previousPhase !== 'result' && quizSession.phase.value === 'result'
}

async function handleAdvance() {
  const previousPhase = quizSession.phase.value

  quizHost.handleAdvance()

  if (!hasRevealedQuizResult(previousPhase)) {
    return
  }

  await scrollQuizToTop()
}

function handleBack() {
  quizHost.handleBack()
}
</script>

<template>
  <section class="quiz-section">
    <div class="quiz-section__layout">
      <header
        v-if="quizHost.hostConfig.value.display.showShellHeader"
        class="quiz-section__header"
      >
        <h2 class="quiz-section__heading">
          {{ solagreeQuizShellContent.heading }}
        </h2>
        <p class="quiz-section__intro">
          {{ solagreeQuizShellContent.intro }}
        </p>
      </header>

      <div
        ref="quizBodyRef"
        class="quiz-section__body"
      >
        <QuizCardShell
          :progress="quizSession.progressValue.value"
          :back-label="quizSession.labels.backLabel"
          :question="quizSession.phase.value === 'result' ? undefined : quizSession.currentQuestion.value"
          :result="quizSession.phase.value === 'result' ? quizHost.resolvedResultView.value : undefined"
          :value="quizSession.currentValue.value"
          :primary-action-label="quizSession.primaryActionLabel.value"
          :can-go-back="quizSession.canGoBack.value"
          :can-advance="quizSession.canAdvance.value"
          @back="handleBack"
          @advance="handleAdvance"
          @cta="quizHost.handleResultCtaClick"
          @reset="quizHost.handleReset"
          @single-change="quizHost.handleSingleAnswer($event.questionId, $event.value)"
          @multi-change="quizHost.handleMultiAnswer($event.questionId, { value: $event.value, checked: $event.checked })"
        />

        <QuizExplainer
          v-if="quizSession.phase.value === 'question' && quizHost.hostConfig.value.display.showExplainer"
          :title="explainer.title"
          :body="explainer.body"
        />
      </div>
    </div>
  </section>
</template>
