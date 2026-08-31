<script setup lang="ts">
import BlogMedia from '~/components/blog/BlogMedia.vue'
import { formatArticleDate } from '~/utils/article-formatting'
import type { ExternalNewsItem } from '#shared/types/resource-content'

const props = defineProps<{
  items: readonly ExternalNewsItem[]
}>()

const featuredItem = computed(() => props.items.find(item => item.featured) ?? props.items[0])
const mediaItems = computed(() => props.items.filter(item => item.slug !== featuredItem.value?.slug))

/** Identifies the external destination in a concise label for assistive technology. */
const getExternalLabel = (item: ExternalNewsItem): string => item.category === 'Press Release'
  ? `Read the full release on ${item.author} (opens in a new tab)`
  : `Listen on ${item.author} (opens in a new tab)`
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

        <article
          v-if="featuredItem"
          class="news-feature"
        >
          <BlogMedia
            :src="featuredItem.featuredImage"
            :alt="''"
          />
          <div class="news-feature__content">
            <h2 class="news-feature__title">
              {{ featuredItem.title }}
            </h2>
            <p class="news-feature__summary">
              {{ featuredItem.summary }}
            </p>
            <a
              class="news-feature__link sol-button sol-button--primary"
              :href="featuredItem.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="getExternalLabel(featuredItem)"
            >
              Read the Full Release
              <UIcon
                name="i-heroicons-arrow-right-20-solid"
                aria-hidden="true"
              />
            </a>
          </div>
        </article>

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
            v-if="mediaItems.length"
            class="news-card-grid"
          >
            <article
              v-for="item in mediaItems"
              :key="item.slug"
              class="news-card"
            >
              <BlogMedia
                :src="item.featuredImage"
                :alt="''"
                fit="contain"
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
                  {{ item.title }}
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
            For media inquiries, contact <a href="mailto:support@solagree.com">support@solagree.com</a>.
          </p>
        </section>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
