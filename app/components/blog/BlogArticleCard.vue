<script setup lang="ts">
import { formatArticleDate } from '~/utils/article-formatting'
import { getArticlePath } from '~/utils/article-seo'
import type { ResourceArticle } from '#shared/types/resource-content'

defineProps<{
  article: ResourceArticle
}>()
</script>

<template>
  <article class="blog-card">
    <NuxtLink
      class="blog-card__media-link"
      :to="getArticlePath(article)"
    >
      <BlogMedia
        :src="article.featuredImage"
        :alt="article.title"
      />
      <span
        v-if="article.category"
        class="blog-card__category"
      >{{ article.category }}</span>
    </NuxtLink>
    <p class="blog-card__date">
      {{ formatArticleDate(article.publishedAt) }}
    </p>
    <h3 class="blog-card__title">
      <NuxtLink :to="getArticlePath(article)">
        {{ article.title }}
      </NuxtLink>
    </h3>
  </article>
</template>
