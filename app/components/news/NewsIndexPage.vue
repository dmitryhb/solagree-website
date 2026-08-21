<script setup lang="ts">
import BlogMedia from '~/components/blog/BlogMedia.vue'
import { formatArticleDate } from '~/utils/article-formatting'
import type { ExternalNewsItem } from '#shared/types/resource-content'

defineProps<{
  items: readonly ExternalNewsItem[]
}>()

/** Identifies the external destination in a concise label for assistive technology. */
const getExternalLabel = (item: ExternalNewsItem): string => `Listen on ${item.author} (opens in a new tab)`
</script>

<template>
  <main class="news-index">
    <section class="news-index__hero">
      <div class="section-shell">
        <header class="news-index__heading">
          <h1 class="editorial-display">
            News &amp; Press
          </h1>
          <p class="news-index__intro">
            Official announcements, company updates, and national coverage on how Solagree is reshaping dispute resolution.
          </p>
        </header>

        <section
          class="news-index__media"
          aria-labelledby="recent-media-title"
        >
          <header class="news-index__media-heading">
            <h2
              id="recent-media-title"
              class="editorial-display"
            >
              Recent Media
            </h2>
            <p class="news-index__intro">
              Solagree in the news, on the airwaves, and across the industry.
            </p>
          </header>

          <div
            v-if="items.length"
            class="news-card-grid"
          >
            <article
              v-for="item in items"
              :key="item.slug"
              class="news-card"
            >
              <BlogMedia
                :src="item.featuredImage"
                :alt="''"
              />
              <p class="news-card__source">
                {{ item.author }} <span aria-hidden="true">•</span> {{ formatArticleDate(item.publishedAt) }}
              </p>
              <h3 class="news-card__title">
                <a
                  :href="item.externalUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="getExternalLabel(item)"
                >
                  {{ item.title }} <span aria-hidden="true">↗</span>
                </a>
              </h3>
              <p class="news-card__summary">
                {{ item.summary }}
              </p>
              <a
                class="news-card__link"
                :href="item.externalUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="getExternalLabel(item)"
              >
                Listen on {{ item.author }} <span aria-hidden="true">→</span>
              </a>
            </article>
          </div>
          <p
            v-else
            class="news-index__empty"
          >
            New coverage is on its way. Please check back soon.
          </p>
        </section>

        <section
          class="news-press-inquiries"
          aria-labelledby="press-inquiries-title"
        >
          <h2
            id="press-inquiries-title"
            class="editorial-display"
          >
            Press Inquiries
          </h2>
          <p>
            For media inquiries, contact <a href="mailto:pr@solagree.com">pr@solagree.com</a>.
          </p>
        </section>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
