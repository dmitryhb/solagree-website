<script setup lang="ts">
import { formatArticleDate } from '~/utils/article-formatting'
import { getArticlePath } from '~/utils/article-seo'
import type { ResourceArticle } from '#shared/types/resource-content'

const props = defineProps<{
  articles: readonly ResourceArticle[]
}>()

const featuredArticle = computed(() => props.articles.find(article => article.featured) ?? props.articles[0])
const latestArticles = computed(() => props.articles.filter(article => article.slug !== featuredArticle.value?.slug))
</script>

<template>
  <main class="blog-index">
    <section class="blog-index__hero">
      <div class="section-shell">
        <header class="blog-index__heading">
          <h1 class="editorial-display">
            Blog
          </h1>
          <p class="blog-index__intro">
            Guidance, insight, and honest answers for anyone navigating divorce — from the people building a better way through it.
          </p>
        </header>

        <div
          v-if="featuredArticle"
          class="blog-featured"
        >
          <NuxtLink
            class="blog-featured__media-link"
            :to="getArticlePath(featuredArticle)"
          >
            <BlogMedia
              :src="featuredArticle.featuredImage"
              :alt="featuredArticle.title"
            />
          </NuxtLink>
          <article class="blog-featured__content">
            <p class="blog-featured__label">
              Featured article
            </p>
            <h2 class="blog-featured__title">
              <NuxtLink :to="getArticlePath(featuredArticle)">
                {{ featuredArticle.title }}
              </NuxtLink>
            </h2>
            <p class="blog-featured__date">
              {{ formatArticleDate(featuredArticle.publishedAt) }}
            </p>
            <p class="blog-featured__summary">
              {{ featuredArticle.summary }}
            </p>
            <SiteButton
              :to="getArticlePath(featuredArticle)"
              size="sm"
            >
              Read article
            </SiteButton>
          </article>
        </div>

        <p
          v-else
          class="blog-index__empty"
        >
          New articles are on their way. Please check back soon.
        </p>
      </div>
    </section>

    <section
      v-if="latestArticles.length"
      class="blog-index__latest"
      aria-labelledby="latest-articles-title"
    >
      <div class="section-shell">
        <header class="blog-index__heading">
          <h2
            id="latest-articles-title"
            class="editorial-display"
          >
            Latest Articles
          </h2>
          <p class="blog-index__intro">
            Fresh perspective on divorce, mediation, and what comes next.
          </p>
        </header>
        <div class="blog-card-grid">
          <BlogArticleCard
            v-for="article in latestArticles"
            :key="article.slug"
            :article="article"
          />
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
