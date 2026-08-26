<script setup lang="ts">
import { solagreeSocialLinksByIcon } from '~/data/social-links'
import { solagreeQuizCopy } from '~/data/quiz'
import { solagreeQuizCriterionGroups } from '~/data/quiz-schema'
import type {
  QuizCriterionId,
  QuizHostConfigInput,
  QuizHostEvent
} from '~/data/quiz-types'

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
const titleTag = computed(() => `h${quizHost.hostConfig.value.display.headingLevel}`)
const sectionClasses = computed(() => ({
  'quiz-section--standalone': quizHost.hostConfig.value.mode === 'standalone',
  'quiz-section--embedded': quizHost.hostConfig.value.mode === 'embedded'
}))

const getQuizScrollBehavior = (): ScrollBehavior => {
  if (!import.meta.client) {
    return 'auto'
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

const handleCriterionChange = (payload: {
  criterionId: QuizCriterionId
  selected: boolean
}): void => {
  quizHost.handleCriterionChange(payload.criterionId, payload.selected)
}

const handleReset = async (): Promise<void> => {
  quizHost.handleReset()
  await nextTick()

  const firstCriterion = quizBodyRef.value?.querySelector<HTMLInputElement>(
    '[data-criterion-id="simple-estate"]'
  )

  firstCriterion?.focus({ preventScroll: true })
  quizBodyRef.value?.scrollIntoView({
    behavior: getQuizScrollBehavior(),
    block: 'start'
  })
}
</script>

<template>
  <section
    class="quiz-section"
    :class="sectionClasses"
    aria-labelledby="case-qualifier-title"
  >
    <div class="quiz-section__layout">
      <header
        v-if="quizHost.hostConfig.value.display.showShellHeader"
        class="quiz-section__shell-header"
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

      <article
        ref="quizBodyRef"
        class="quiz-qualifier"
        :data-quiz-ready="quizSession.hasRestoredPersistedState.value ? 'true' : 'false'"
      >
        <header class="quiz-qualifier__header">
          <component
            :is="titleTag"
            id="case-qualifier-title"
            class="quiz-qualifier__title"
          >
            {{ solagreeQuizCopy.title }}
          </component>
          <p class="quiz-qualifier__subtitle">
            {{ solagreeQuizCopy.subtitle }}
          </p>
        </header>

        <div class="quiz-qualifier__layout">
          <div class="quiz-qualifier__questions">
            <p
              v-if="quizHost.hostConfig.value.display.showInstructions"
              class="quiz-qualifier__instructions"
            >
              {{ solagreeQuizCopy.instructions }}
            </p>

            <QuizCriterionGroup
              v-for="(group, index) in solagreeQuizCriterionGroups"
              :key="group.id"
              :group="group"
              :group-number="index + 1"
              :selected-criterion-ids="quizSession.selectedCriterionIds.value"
              @change="handleCriterionChange"
            />
          </div>

          <QuizAssessmentPanel
            :score="quizSession.score.value"
            :result="quizHost.resolvedResultView.value"
            :heading-level="quizHost.hostConfig.value.display.headingLevel"
            @cta="quizHost.handleResultCtaClick"
            @reset="handleReset"
          />
        </div>
      </article>
    </div>
  </section>
</template>
