<script setup lang="ts">
import ArticleRichText from '~/components/blog/ArticleRichText.vue'
import BlogArticleCard from '~/components/blog/BlogArticleCard.vue'
import BlogMedia from '~/components/blog/BlogMedia.vue'
import BlogShareControls from '~/components/blog/BlogShareControls.vue'
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
        <NuxtLink
          class="blog-article__back-link blog-article__back-link--top"
          to="/blog"
        >
          <UIcon
            name="i-heroicons-arrow-left-20-solid"
            aria-hidden="true"
          />
          Back to all articles
        </NuxtLink>
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
        <div class="blog-article__body">
          <div class="blog-article__meta">
            <span class="blog-article__tag">
              <span aria-hidden="true">•</span> {{ article.category || 'Blog' }}
            </span>
            <span class="blog-article__updated">
              Last Updated:
              <time :datetime="article.updatedAt || article.publishedAt">
                {{ formatArticleDate(article.updatedAt || article.publishedAt) }}
              </time>
            </span>
          </div>
          <ArticleRichText :body="article.body" />

          <footer class="blog-article__footer">
            <p class="blog-article__author-label">
              Meet the author
            </p>
            <div class="blog-article__author-card">
              <img
                v-if="article.authorImage"
                :src="article.authorImage"
                :alt="article.author"
                width="48"
                height="48"
                loading="lazy"
                decoding="async"
              >
              <div>
                <p class="blog-article__author-name">
                  {{ article.author }}
                </p>
                <p v-if="article.authorRole" class="blog-article__author-role">
                  {{ article.authorRole }}
                </p>
              </div>
            </div>
            <BlogShareControls
              :title="article.title"
              :url="shareUrl"
            />
          </footer>
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
