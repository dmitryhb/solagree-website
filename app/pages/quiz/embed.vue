<script setup lang="ts">
import SolagreeQuizEmbed from '~/components/quiz/SolagreeQuizEmbed.vue'

useSolagreeSeo({
  title: 'Solagree Quiz Embed',
  description: 'Embedded Solagree quiz for partner sites.',
  noIndex: true,
  path: '/quiz/embed'
})
</script>

<template>
  <main class="quiz-embed-page">
    <SolagreeQuizEmbed />
  </main>
</template>
