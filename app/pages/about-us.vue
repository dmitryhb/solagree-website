<script setup lang="ts">
import AboutAudienceSection from '~/components/about/AboutAudienceSection.vue'
import AboutPage from '~/components/about/AboutPage.vue'

useSolagreeSeo({
  title: 'About Us',
  description:
    'Learn about Solagree and the team building a structured, lower-conflict path through divorce.',
  path: '/about-us'
})
</script>

<template>
  <AboutPage>
    <AboutAudienceSection />
  </AboutPage>
</template>
