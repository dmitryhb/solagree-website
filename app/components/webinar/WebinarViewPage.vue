<script setup lang="ts">
import WebinarJoinPrompt from '~/components/webinar/WebinarJoinPrompt.vue'
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'

interface WebinarViewPageProps {
  videoImageSrc?: string
  videoImageAlt?: string
}

withDefaults(defineProps<WebinarViewPageProps>(), {
  videoImageSrc: '/images/video-placeholder.webp',
  videoImageAlt: 'Solagree webinar video preview.'
})
</script>

<template>
  <main class="webinar-view-page">
    <div class="webinar-view-page__content">
      <WebinarVideoFrame
        v-appear="{ variant: 'scale' }"
        :image-src="videoImageSrc"
        :image-alt="videoImageAlt"
      />
      <WebinarJoinPrompt v-appear="{ delay: 120 }" />
    </div>

    <SiteFooter />
  </main>
</template>
