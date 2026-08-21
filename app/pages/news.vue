<script setup lang="ts">
import NewsIndexPage from '~/components/news/NewsIndexPage.vue'
import { publishedNewsItems } from '~/data/resource-content'

useSolagreeSeo({
  title: 'News & Press',
  description: 'Official announcements and media coverage about Solagree’s approach to divorce resolution.',
  path: '/news'
})
</script>

<template>
  <NewsIndexPage :items="publishedNewsItems" />
</template>
