<script setup lang="ts">
import type { QuizResultViewModel } from '~/data/quiz-types'

defineProps<{
  result: QuizResultViewModel
}>()

const emit = defineEmits<{
  reset: []
}>()
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

    <div class="quiz-result-state__summary">
      <h4 class="quiz-result-state__summary-title">
        {{ result.summaryTitle }}
      </h4>
      <ul class="quiz-result-state__summary-list">
        <li
          v-for="item in result.summaryItems"
          :key="item"
          class="quiz-result-state__summary-item"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <p
      v-if="result.policyNote"
      class="quiz-result-state__policy-note"
    >
      {{ result.policyNote }}
    </p>

    <div class="quiz-result-state__actions">
      <a
        class="quiz-result-state__cta quiz-result-state__cta--primary"
        :href="result.primaryCta.href"
      >
        {{ result.primaryCta.label }}
      </a>

      <button
        type="button"
        class="quiz-result-state__cta quiz-result-state__cta--secondary"
        @click="emit('reset')"
      >
        {{ result.resetLabel }}
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
            rel="noreferrer"
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
