<script setup lang="ts">
import type {
  QuizQuestionDefinition,
  QuizQuestionValue,
  QuizResultViewModel
} from '~/data/quiz-types'

const props = defineProps<{
  progress: number
  backLabel: string
  currentStepNumber?: number
  totalStepCount?: number
  showStepCounter?: boolean
  question?: QuizQuestionDefinition
  value?: QuizQuestionValue
  result?: QuizResultViewModel
  primaryActionLabel: string
  canGoBack?: boolean
  canAdvance?: boolean
}>()

const shouldShowBackButton = computed(() => {
  return !!props.result || !props.showStepCounter
})

const stepCounterLabel = computed(() => {
  if (!props.currentStepNumber || !props.totalStepCount) {
    return ''
  }

  return `${props.currentStepNumber} of ${props.totalStepCount}`
})

const emit = defineEmits<{
  back: []
  advance: []
  reset: []
  cta: [payload: QuizResultViewModel['primaryCta']]
  singleChange: [payload: { questionId: QuizQuestionDefinition['id'], value: string | undefined }]
  multiChange: [payload: { questionId: QuizQuestionDefinition['id'], value: string, checked: boolean }]
}>()
</script>

<template>
  <article
    class="quiz-card-shell"
    :class="{ 'quiz-card-shell--result': !!result }"
  >
    <div class="quiz-card-shell__inner">
      <div class="quiz-card-shell__frame">
        <QuizProgressMeter :value="progress" />

        <div class="quiz-card-shell__header">
          <QuizBackButton
            v-if="shouldShowBackButton"
            class="quiz-card-shell__back"
            :label="backLabel"
            :disabled="!canGoBack"
            @click="emit('back')"
          />

          <p
            v-else-if="showStepCounter"
            class="quiz-card-shell__step-counter"
            aria-live="polite"
          >
            {{ stepCounterLabel }}
          </p>
        </div>

        <Transition
          name="quiz-card-shell-step"
          mode="out-in"
        >
          <div
            :key="question ? question.id : result ? `result-${result.title}` : 'quiz-step'"
            class="quiz-card-shell__step"
          >
            <QuizQuestionBlock
              v-if="question"
              class="quiz-card-shell__question"
              :question="question"
              :value="value"
              @single-change="emit('singleChange', $event)"
              @multi-change="emit('multiChange', $event)"
            />

            <QuizResultState
              v-else-if="result"
              class="quiz-card-shell__question"
              :result="result"
              @cta="emit('cta', $event)"
              @reset="emit('reset')"
            />

            <div
              v-if="question"
              class="quiz-card-shell__action"
            >
              <QuizPrimaryAction
                :label="primaryActionLabel"
                :disabled="!canAdvance"
                @click="emit('advance')"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </article>
</template>
