<script setup lang="ts">
import AttorneyApplicationPage from '~/components/attorney/AttorneyApplicationPage.vue'

useSolagreeSeo({
  title: 'Attorney Partner Application',
  description:
    'Apply to become a Solagree attorney partner and share your licensing, mediation, arbitration, and consultation preferences.',
  path: '/attorney-application',
  image: '/images/for-professionals.webp'
})
</script>

<template>
  <AttorneyApplicationPage />
</template>
