<script setup lang="ts">
import ConsultRequestThankYouPage from '~/components/consult/ConsultRequestThankYouPage.vue'

useSolagreeSeo({
  title: 'Consult Request Received',
  description: 'Your Solagree consult request has been received.',
  noIndex: true,
  path: '/book-a-solagree-consult/thank-you'
})
</script>

<template>
  <ConsultRequestThankYouPage />
</template>
