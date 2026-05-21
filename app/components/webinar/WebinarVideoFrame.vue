<script setup lang="ts">
import { solagreeVimeoVideos } from '~/data/video-embeds'

interface WebinarVideoFrameProps {
  videoSrc?: string
  videoTitle?: string
  imageSrc?: string
  imageAlt?: string
}

withDefaults(defineProps<WebinarVideoFrameProps>(), {
  videoSrc: solagreeVimeoVideos.about.src,
  videoTitle: solagreeVimeoVideos.about.title,
  imageSrc: '/images/video-placeholder.webp',
  imageAlt: 'Solagree webinar video preview.'
})
</script>

<template>
  <figure class="webinar-video-frame">
    <iframe
      v-if="videoSrc"
      class="webinar-video-frame__embed"
      :src="videoSrc"
      :title="videoTitle"
      width="1280"
      height="720"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    />
    <img
      v-else
      class="webinar-video-frame__image"
      :src="imageSrc"
      :alt="imageAlt"
      width="2152"
      height="1210"
      loading="eager"
      decoding="async"
    >
  </figure>
</template>
