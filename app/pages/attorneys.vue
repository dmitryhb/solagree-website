<script setup lang="ts">
import AttorneyFaqSection from '~/components/attorney/AttorneyFaqSection.vue'
import AttorneyFitsPracticeSection from '~/components/attorney/AttorneyFitsPracticeSection.vue'
import AttorneyLandingPage from '~/components/attorney/AttorneyLandingPage.vue'

useSolagreeSeo({
  title: 'Attorney Partners',
  description:
    'Learn how attorneys can partner with Solagree to support clients through a structured, flat-fee divorce process.',
  path: '/attorneys'
})
</script>

<template>
  <AttorneyLandingPage>
    <AttorneyFaqSection />
    <AttorneyFitsPracticeSection />
  </AttorneyLandingPage>
</template>
