<script setup lang="ts">
import AttorneyApplicationSentPage from '~/components/attorney/AttorneyApplicationSentPage.vue'

useSolagreeSeo({
  title: 'Application Received',
  description: 'Your Solagree attorney partner application has been received.',
  noIndex: true,
  path: '/attorney-application/sent'
})
</script>

<template>
  <AttorneyApplicationSentPage />
</template>
