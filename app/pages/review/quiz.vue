<script setup lang="ts">
import { solagreeQuizStaticScreen } from '~/data/quiz'

useSeoMeta({
  title: 'Quiz Review | Solagree',
  description: 'Internal signoff surface for the Solagree embeddable quiz first screen.',
  robots: 'noindex, nofollow'
})
</script>

<template>
  <main class="page-shell">
    <QuizSection :screen="solagreeQuizStaticScreen" />
  </main>
</template>
