<script setup lang="ts">
import { formatArticleDate } from '~/utils/article-formatting'
import type { ResourceArticle } from '#shared/types/resource-content'

defineProps<{
  article: ResourceArticle
  relatedArticles: readonly ResourceArticle[]
  shareUrl: string
}>()

</script>

<template>
  <main class="blog-article-page">
    <article class="blog-article">
      <header class="blog-article__header section-shell section-shell--narrow">
        <p class="blog-article__eyebrow">
          Blog <span aria-hidden="true">•</span> {{ formatArticleDate(article.publishedAt) }}
        </p>
        <h1 class="blog-article__title">
          {{ article.title }}
        </h1>
      </header>

      <div class="blog-article__hero section-shell">
        <BlogMedia
          :src="article.featuredImage"
          :alt="article.title"
        />
      </div>

      <div class="blog-article__layout section-shell section-shell--narrow">
        <aside class="blog-article__aside">
          <p class="blog-article__author">
            Written by {{ article.author }}
          </p>
          <BlogShareControls
            :title="article.title"
            :url="shareUrl"
          />
        </aside>
        <div class="blog-article__body">
          <p class="blog-article__summary">
            {{ article.summary }}
          </p>
          <ArticleRichText :body="article.body" />
          <NuxtLink
            class="blog-article__back-link"
            to="/blog"
          >
            <span aria-hidden="true">←</span> Back to all articles
          </NuxtLink>
        </div>
      </div>
    </article>

    <section
      v-if="relatedArticles.length"
      class="blog-article__related"
      aria-labelledby="recent-articles-title"
    >
      <div class="section-shell">
        <h2
          id="recent-articles-title"
          class="blog-article__related-title"
        >
          Recent articles
        </h2>
        <div class="blog-card-grid blog-card-grid--related">
          <BlogArticleCard
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.slug"
            :article="relatedArticle"
          />
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
