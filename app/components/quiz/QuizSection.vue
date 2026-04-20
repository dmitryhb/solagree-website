<script setup lang="ts">
import { solagreeSocialLinksByIcon } from '~/data/social-links'
import type { QuizHostConfigInput, QuizHostEvent } from '~/data/quiz-types'

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
const linkedInSocialLink = solagreeSocialLinksByIcon.linkedin
const currentStepNumber = computed(() => {
  if (quizSession.phase.value !== 'question') {
    return undefined
  }

  const currentQuestionId = quizSession.currentQuestionId.value
  const questionIndex = quizSession.visibleQuestionIds.value.findIndex(questionId => questionId === currentQuestionId)

  return questionIndex >= 0 ? questionIndex + 1 : undefined
})
const totalStepCount = computed(() => {
  return quizSession.phase.value === 'question' ? quizSession.visibleQuestionIds.value.length : undefined
})
const showStepCounter = computed(() => {
  return quizSession.phase.value === 'question' && (totalStepCount.value ?? 0) > 0
})
const sectionClasses = computed(() => {
  return {
    'quiz-section--standalone': quizHost.hostConfig.value.mode === 'standalone',
    'quiz-section--embedded': quizHost.hostConfig.value.mode === 'embedded'
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
  <section
    class="quiz-section"
    :class="sectionClasses"
  >
    <div class="quiz-section__layout">
      <header
        v-if="quizHost.hostConfig.value.display.showShellHeader"
        class="quiz-section__header"
      >
        <NuxtLink
          to="/"
          class="quiz-section__logo-link"
          aria-label="Solagree home"
        >
          <img
            class="quiz-section__logo"
            src="/solagree-logo.svg"
            alt="Solagree"
          >
        </NuxtLink>
        <a
          class="quiz-section__contact-link"
          :href="linkedInSocialLink.href"
          :aria-label="linkedInSocialLink.ariaLabel"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Us
        </a>
      </header>

      <div
        ref="quizBodyRef"
        class="quiz-section__body"
      >
        <QuizCardShell
          :progress="quizSession.progressValue.value"
          :back-label="quizSession.labels.backLabel"
          :current-step-number="currentStepNumber"
          :total-step-count="totalStepCount"
          :show-step-counter="showStepCounter"
          :question="quizSession.phase.value === 'result' ? undefined : quizSession.currentQuestion.value"
          :result="quizSession.phase.value === 'result' ? quizHost.resolvedResultView.value : undefined"
          :value="quizSession.currentValue.value"
          :primary-action-label="quizSession.primaryActionLabel.value"
          :can-go-back="quizSession.canGoBack.value"
          :can-advance="quizSession.canAdvance.value"
          :show-explainer="quizHost.hostConfig.value.display.showExplainer"
          @back="handleBack"
          @advance="handleAdvance"
          @cta="quizHost.handleResultCtaClick"
          @reset="quizHost.handleReset"
          @single-change="quizHost.handleSingleAnswer($event.questionId, $event.value)"
          @multi-change="quizHost.handleMultiAnswer($event.questionId, { value: $event.value, checked: $event.checked })"
        />
      </div>
    </div>
  </section>
</template>
