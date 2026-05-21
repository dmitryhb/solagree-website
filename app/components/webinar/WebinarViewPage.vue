<script setup lang="ts">
import WebinarJoinPrompt from '~/components/webinar/WebinarJoinPrompt.vue'
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'
import { solagreeVimeoVideos } from '~/data/video-embeds'

interface WebinarViewPageProps {
  videoSrc?: string
  videoTitle?: string
  joinTo?: string
}

withDefaults(defineProps<WebinarViewPageProps>(), {
  videoSrc: solagreeVimeoVideos.attorneyWebinar.src,
  videoTitle: solagreeVimeoVideos.attorneyWebinar.title,
  joinTo: '/attorney-application'
})
</script>

<template>
  <main class="webinar-view-page">
    <div class="webinar-view-page__content">
      <WebinarVideoFrame
        v-appear="{ variant: 'scale' }"
        :video-src="videoSrc"
        :video-title="videoTitle"
      />
      <WebinarJoinPrompt
        v-appear="{ delay: 120 }"
        :join-to="joinTo"
      />
    </div>

    <SiteFooter />
  </main>
</template>
