<script setup lang="ts">
import { solagreeQuizCopy } from '~/data/quiz'
import type { QuizHostDisplayOptions, QuizResultViewModel } from '~/data/quiz-types'
import { appendReferralToHref } from '~/utils/referral'

const props = defineProps<{
  score: number
  result: QuizResultViewModel | null
  headingLevel: QuizHostDisplayOptions['headingLevel']
}>()

const emit = defineEmits<{
  reset: []
  cta: [payload: QuizResultViewModel['primaryCta']]
}>()

const route = useRoute()
const referralCode = computed(() => {
  const refValue = route.query.ref

  if (Array.isArray(refValue)) {
    return refValue.find(value => typeof value === 'string' && value.trim()) ?? null
  }

  return typeof refValue === 'string' ? refValue.trim() || null : null
})
const primaryCta = computed(() => {
  if (!props.result) {
    return null
  }

  return {
    ...props.result.primaryCta,
    href: appendReferralToHref(props.result.primaryCta.href, referralCode.value)
  }
})
const gaugeLabel = computed(() => props.result?.gaugeLabel ?? solagreeQuizCopy.awaitingLabel)
const toneClass = computed(() => props.result ? `quiz-assessment--${props.result.tone}` : undefined)
const assessmentHeadingTag = computed(() => `h${props.headingLevel + 1}`)
const resultHeadingTag = computed(() => `h${props.headingLevel + 2}`)
const needleAngle = computed(() => {
  if (props.result?.tone === 'possible') {
    return 30
  }

  if (props.result?.tone === 'good') {
    return 90
  }

  if (props.result?.tone === 'ideal') {
    return 150
  }

  return 0
})
const needleStyle = computed(() => ({
  transform: `rotate(${needleAngle.value}deg)`
}))
const announcement = computed(() => {
  if (!props.result) {
    return `0 criteria met. ${solagreeQuizCopy.awaitingLabel}.`
  }

  return `${props.score} criteria met. ${props.result.gaugeLabel}. ${props.result.title}. ${props.result.actionLabel}.`
})
</script>

<template>
  <aside
    class="quiz-assessment"
    :class="toneClass"
    aria-labelledby="quiz-assessment-title"
  >
    <div class="quiz-assessment__inner">
      <component
        :is="assessmentHeadingTag"
        id="quiz-assessment-title"
        class="quiz-assessment__heading"
      >
        {{ solagreeQuizCopy.assessmentTitle }}
      </component>

      <div
        class="quiz-visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ announcement }}
      </div>

      <div
        class="quiz-assessment__gauge"
        aria-hidden="true"
      >
        <svg viewBox="0 0 300 190">
          <path
            class="quiz-assessment__segment quiz-assessment__segment--possible"
            :class="{ 'is-active': result?.tone === 'possible' }"
            d="M 40 150 A 110 110 0 0 1 95 54.74"
          />
          <path
            class="quiz-assessment__segment quiz-assessment__segment--good"
            :class="{ 'is-active': result?.tone === 'good' }"
            d="M 95 54.74 A 110 110 0 0 1 205 54.74"
          />
          <path
            class="quiz-assessment__segment quiz-assessment__segment--ideal"
            :class="{ 'is-active': result?.tone === 'ideal' }"
            d="M 205 54.74 A 110 110 0 0 1 260 150"
          />
          <line
            class="quiz-assessment__needle"
            :style="needleStyle"
            x1="150"
            y1="150"
            x2="40"
            y2="150"
          />
          <circle
            class="quiz-assessment__needle-dot"
            cx="150"
            cy="150"
            r="10"
          />
        </svg>
      </div>

      <p class="quiz-assessment__gauge-label">
        {{ gaugeLabel }}
      </p>
      <p
        class="quiz-assessment__score"
        data-testid="quiz-score"
      >
        {{ score }}
      </p>
      <p class="quiz-assessment__score-label">
        {{ solagreeQuizCopy.scoreLabel }}
      </p>

      <div
        v-if="result"
        class="quiz-assessment__result"
      >
        <component
          :is="resultHeadingTag"
          class="quiz-assessment__result-title"
        >
          {{ result.title }}
        </component>
        <p class="quiz-assessment__result-description">
          {{ result.body }}
        </p>
        <p class="quiz-assessment__action-label">
          {{ result.actionLabel }}
        </p>

        <div class="quiz-assessment__actions">
          <a
            v-if="primaryCta"
            class="quiz-assessment__cta quiz-assessment__cta--primary"
            :href="primaryCta.href"
            :target="primaryCta.target"
            :rel="primaryCta.rel"
            @click="emit('cta', primaryCta)"
          >
            {{ primaryCta.label }}
          </a>
          <button
            class="quiz-assessment__cta quiz-assessment__cta--reset"
            type="button"
            @click="emit('reset')"
          >
            {{ result.resetLabel }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
