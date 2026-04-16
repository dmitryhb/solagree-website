<script setup lang="ts">
import type {
  QuizQuestionDefinition,
  QuizQuestionValue,
  QuizResultViewModel
} from '~/data/quiz-types'

defineProps<{
  progress: number
  backLabel: string
  question?: QuizQuestionDefinition
  value?: QuizQuestionValue
  result?: QuizResultViewModel
  primaryActionLabel: string
  canGoBack?: boolean
  canAdvance?: boolean
}>()

const emit = defineEmits<{
  back: []
  advance: []
  reset: []
  cta: [payload: QuizResultViewModel['primaryCta']]
  singleChange: [value: string | undefined]
  multiChange: [payload: { value: string, checked: boolean }]
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

        <div class="quiz-card-shell__back">
          <QuizBackButton
            :label="backLabel"
            :disabled="!canGoBack"
            @click="emit('back')"
          />
        </div>

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
    </div>
  </article>
</template>
