<script setup lang="ts">
import CdfaApplicationSentPage from '~/components/cdfa/CdfaApplicationSentPage.vue'

useSolagreeSeo({
  title: 'Application Received',
  description: 'Your Solagree CDFA Network application has been received.',
  noIndex: true,
  path: '/cdfa-application/sent'
})
</script>

<template>
  <CdfaApplicationSentPage />
</template>
