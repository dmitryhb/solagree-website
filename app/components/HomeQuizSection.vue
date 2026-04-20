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
      <header class="home-quiz-section__header">
        <h1
          id="home-quiz-title"
          class="home-quiz-section__title"
        >
          Find the right Solagree divorce plan in minutes.
        </h1>
        <p class="home-quiz-section__intro">
          Answer a few questions and we'll suggest a plan to fit your unique needs.
        </p>
      </header>

      <div class="home-quiz-section__quiz">
        <SolagreeQuizEmbed :host-config="homeQuizHostConfig" />
      </div>
    </div>
  </section>
</template>
