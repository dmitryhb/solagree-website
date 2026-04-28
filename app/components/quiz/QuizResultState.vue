<script setup lang="ts">
import type { QuizResultViewModel } from '~/data/quiz-types'
import { appendReferralToHref } from '~/utils/referral'

const props = defineProps<{
  result: QuizResultViewModel
}>()

const emit = defineEmits<{
  reset: []
  cta: [payload: QuizResultViewModel['primaryCta']]
}>()

const route = useRoute()

const referralCode = computed(() => {
  const refValue = route.query.ref

  if (Array.isArray(refValue)) {
    return refValue.find((value) => typeof value === 'string' && value.trim()) ?? null
  }

  return typeof refValue === 'string' ? refValue.trim() || null : null
})

const consultActionIds = new Set<QuizResultViewModel['primaryCta']['actionId']>([
  'solagree-consult',
  'attorney-consult'
])

const primaryCtaHref = computed(() => {
  if (!consultActionIds.has(props.result.primaryCta.actionId)) {
    return props.result.primaryCta.href
  }

  return appendReferralToHref(props.result.primaryCta.href, referralCode.value)
})

const primaryCta = computed(() => ({
  ...props.result.primaryCta,
  href: primaryCtaHref.value
}))
</script>

<template>
  <div class="quiz-result-state">
    <p class="quiz-result-state__eyebrow">
      {{ result.eyebrow }}
    </p>

    <div class="quiz-result-state__content">
      <h3 class="quiz-result-state__title">
        {{ result.title }}
      </h3>
      <p class="quiz-result-state__body">
        {{ result.body }}
      </p>
    </div>

    <div class="quiz-result-state__actions">
      <a
        class="quiz-result-state__cta quiz-result-state__cta--primary"
        :href="primaryCta.href"
        :target="primaryCta.target"
        :rel="primaryCta.rel"
        @click="emit('cta', primaryCta)"
      >
        {{ primaryCta.label }}
      </a>

      <button
        type="button"
        class="quiz-result-state__cta quiz-result-state__cta--secondary"
        @click="emit('reset')"
      >
        <svg
          class="quiz-result-state__cta-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6.67742 20.5673C2.53141 18.0212 0.758026 12.7584 2.71678 8.1439C4.87472 3.0601 10.7453 0.68822 15.8291 2.84617C20.9129 5.00412 23.2848 10.8747 21.1269 15.9585C20.2837 17.945 18.8736 19.5174 17.1651 20.5673"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 16V20.4C17 20.7314 17.2686 21 17.6 21H22"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 22.01L12.01 21.9989"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ result.resetLabel }}</span>
      </button>
    </div>

    <div
      v-if="result.resources?.length"
      class="quiz-result-state__resources"
      id="fallback-resources"
    >
      <h4
        v-if="result.resourceTitle"
        class="quiz-result-state__resources-title"
      >
        {{ result.resourceTitle }}
      </h4>
      <p
        v-if="result.resourceBody"
        class="quiz-result-state__resources-body"
      >
        {{ result.resourceBody }}
      </p>

      <ul class="quiz-result-state__resource-list">
        <li
          v-for="resource in result.resources"
          :key="resource.href"
          class="quiz-result-state__resource-item"
        >
          <a
            class="quiz-result-state__resource-link"
            :href="resource.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ resource.label }}
          </a>
          <p class="quiz-result-state__resource-description">
            {{ resource.description }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
