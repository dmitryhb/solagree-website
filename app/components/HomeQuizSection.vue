<script setup lang="ts">
import SolagreeQuizEmbed from '~/components/quiz/SolagreeQuizEmbed.vue'
import type { QuizHostConfigInput } from '~/data/quiz-types'

const homeQuizHostConfig: QuizHostConfigInput = {
  hostId: 'homepage-quiz',
  display: {
    showShellHeader: false,
    showInstructions: true,
    headingLevel: 3
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
          Qualify a Solagree case in 15 seconds.
        </h2>
        <p class="home-quiz-section__intro">
          Use the approved practitioner checklist to assess fit during an initial consultation.
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
