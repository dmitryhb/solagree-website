<script setup lang="ts">
import SolagreeQuizEmbed from '~/components/quiz/SolagreeQuizEmbed.vue'

useSolagreeSeo({
  title: 'Solagree Case Qualifier Embed',
  description: 'Embedded Solagree Case Qualifier for practitioner and partner sites.',
  noIndex: true,
  path: '/quiz/embed'
})
</script>

<template>
  <main class="quiz-embed-page">
    <SolagreeQuizEmbed />
  </main>
</template>
