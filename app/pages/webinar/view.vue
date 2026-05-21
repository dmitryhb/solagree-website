<script setup lang="ts">
import WebinarViewPage from '~/components/webinar/WebinarViewPage.vue'
import { solagreeVimeoVideos } from '~/data/video-embeds'

useSolagreeSeo({
  title: 'Watch the Attorney Partner Webinar',
  description:
    'Watch Solagree’s attorney partnership webinar and learn how professionals can help couples resolve divorce more efficiently.',
  path: '/webinar/view',
  image: '/images/video-placeholder.webp'
})
</script>

<template>
  <WebinarViewPage
    :video-src="solagreeVimeoVideos.attorneyWebinar.src"
    :video-title="solagreeVimeoVideos.attorneyWebinar.title"
  />
</template>
