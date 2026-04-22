<script setup lang="ts">
import WebinarRegistrationPage from '~/components/webinar/WebinarRegistrationPage.vue'

useSolagreeSeo({
  title: 'Attorney Partner Webinar',
  description:
    'Watch the Solagree attorney partner overview to learn how structured divorce resolution can create referrals, cases, and new revenue opportunities.',
  path: '/webinar',
  image: '/images/amanda.webp'
})
</script>

<template>
  <WebinarRegistrationPage />
</template>
