<script setup lang="ts">
import WebinarRegistrationPage from '~/components/webinar/WebinarRegistrationPage.vue'
import { cdfaWebinarRegistrationContent } from '~/data/webinar-registration'

useSolagreeSeo({
  title: 'CDFA Partner Webinar',
  description:
    'Watch the Solagree CDFA network overview to learn how financial professionals can receive referrals, lead financial analysis, and work through a structured divorce process.',
  path: '/webinar/cdfa',
  image: cdfaWebinarRegistrationContent.presenter.imageSrc
})
</script>

<template>
  <WebinarRegistrationPage :content="cdfaWebinarRegistrationContent" />
</template>
