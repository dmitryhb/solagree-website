<script setup lang="ts">
import CdfaApplicationPage from '~/components/cdfa/CdfaApplicationPage.vue'

useSolagreeSeo({
  title: 'CDFA Network Application',
  description:
    'Apply to join the Solagree CDFA Network and share your divorce financial analysis experience, service area, and consultation preferences.',
  path: '/cdfa-application',
  image: '/images/for-professionals.webp'
})
</script>

<template>
  <CdfaApplicationPage />
</template>
