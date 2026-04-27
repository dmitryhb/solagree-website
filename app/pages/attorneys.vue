<script setup lang="ts">
import AttorneyFaqSection from '~/components/attorney/AttorneyFaqSection.vue'
import AttorneyFitsPracticeSection from '~/components/attorney/AttorneyFitsPracticeSection.vue'
import AttorneyLandingPage from '~/components/attorney/AttorneyLandingPage.vue'
import AttorneyMoreCasesSection from '~/components/attorney/AttorneyMoreCasesSection.vue'
import AttorneyOnePlaceSection from '~/components/attorney/AttorneyOnePlaceSection.vue'

useSolagreeSeo({
  title: 'Attorney Partners',
  description:
    'Learn how attorneys can partner with Solagree to support clients through a structured, flat-fee divorce process.',
  path: '/attorneys'
})
</script>

<template>
  <AttorneyLandingPage>
    <AttorneyOnePlaceSection />
    <AttorneyMoreCasesSection />
    <AttorneyFaqSection />
    <AttorneyFitsPracticeSection />
  </AttorneyLandingPage>
</template>
