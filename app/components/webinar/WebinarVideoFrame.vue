<script setup lang="ts">
interface WebinarVideoFrameProps {
  imageSrc?: string
  imageAlt?: string
}

withDefaults(defineProps<WebinarVideoFrameProps>(), {
  imageSrc: '/images/video-placeholder.webp',
  imageAlt: 'Solagree webinar video preview.'
})
</script>

<template>
  <figure class="webinar-video-frame">
    <img
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
