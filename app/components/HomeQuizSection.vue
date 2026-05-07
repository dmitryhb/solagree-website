<script setup lang="ts">
import SolagreeQuizEmbed from '~/components/quiz/SolagreeQuizEmbed.vue'
import type { QuizHostConfigInput } from '~/data/quiz-types'

const homeQuizHostConfig: QuizHostConfigInput = {
  hostId: 'homepage-quiz',
  display: {
    showShellHeader: false,
    showExplainer: true
  },
  analytics: {
    enabled: false
  },
  bridge: {
    postMessage: false
  }
}
</script>

<template>
  <section
    id="quiz"
    class="home-quiz-section"
    aria-labelledby="home-quiz-title"
  >
    <div class="home-quiz-section__inner">
      <header
        v-appear
        class="home-quiz-section__header"
      >
        <h2
          id="home-quiz-title"
          class="home-quiz-section__title"
        >
          See if Solagree is right for your situation.
        </h2>
        <p class="home-quiz-section__intro">
          Answer a few questions (takes less than a minute) and we’ll let you know if you’re a fit—and recommend your next step.
        </p>
      </header>

      <div
        v-appear="{ variant: 'scale' }"
        class="home-quiz-section__quiz"
      >
        <SolagreeQuizEmbed :host-config="homeQuizHostConfig" />
      </div>
    </div>
  </section>
</template>
