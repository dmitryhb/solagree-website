<script setup lang="ts">
import BlogIndexPage from '~/components/blog/BlogIndexPage.vue'
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
