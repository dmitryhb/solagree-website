<script setup lang="ts">
import WebinarViewPage from '~/components/webinar/WebinarViewPage.vue'

const cdfaWebinarImage = '/images/for-professionals.webp'

useSolagreeSeo({
  title: 'Watch the CDFA Partner Webinar',
  description:
    'Watch Solagree’s CDFA and advisor partnership webinar and learn how professionals can help couples resolve divorce more efficiently.',
  path: '/webinar/cdfa/view',
  image: cdfaWebinarImage
})
</script>

<template>
  <WebinarViewPage
    :video-image-src="cdfaWebinarImage"
    video-image-alt="Solagree CDFA and advisor webinar video preview."
  />
</template>
