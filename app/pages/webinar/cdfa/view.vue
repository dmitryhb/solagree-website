<script setup lang="ts">
import WebinarViewPage from '~/components/webinar/WebinarViewPage.vue'
import { solagreeVimeoVideos } from '~/data/video-embeds'

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
    :video-src="solagreeVimeoVideos.cdfaWebinar.src"
    :video-title="solagreeVimeoVideos.cdfaWebinar.title"
    join-to="/cdfa-application"
  />
</template>
