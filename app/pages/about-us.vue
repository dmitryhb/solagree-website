<script setup lang="ts">
import AboutAudienceSection from '~/components/about/AboutAudienceSection.vue'
import AboutAttorneyGuidanceSection from '~/components/about/AboutAttorneyGuidanceSection.vue'
import AboutPage from '~/components/about/AboutPage.vue'
import AboutProcessSection from '~/components/about/AboutProcessSection.vue'

useSolagreeSeo({
  title: 'About Us',
  description:
    'Learn about Solagree and the team building a structured, lower-conflict path through divorce.',
  path: '/about-us'
})
</script>

<template>
  <AboutPage>
    <AboutProcessSection />
    <AboutAttorneyGuidanceSection />
    <AboutAudienceSection />
  </AboutPage>
</template>
