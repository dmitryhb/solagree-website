<script setup lang="ts">
import { publishedArticles } from '~/data/resource-content'

useSolagreeSeo({
  title: 'Blog',
  description: 'Guidance, insight, and honest answers for anyone navigating divorce with Solagree.',
  path: '/blog'
})
</script>

<template>
  <BlogIndexPage :articles="publishedArticles" />
</template>
