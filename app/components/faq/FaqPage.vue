<script setup lang="ts">
import type { FaqPageContent } from '~/types/faq'

defineProps<{
  page: FaqPageContent
}>()
</script>

<template>
  <main class="legal-page faq-page">
    <section class="legal-page__content faq-page__content">
      <header class="legal-hero faq-page__hero">
        <h1 class="legal-hero__title">
          {{ page.title }}
        </h1>
        <p class="legal-hero__intro">
          {{ page.intro }}
        </p>
      </header>

      <article
        class="legal-document faq-page__document"
        aria-labelledby="faq-page-title"
      >
        <header class="legal-document__header">
          <h2
            id="faq-page-title"
            class="legal-document__title"
          >
            {{ page.documentTitle }}
          </h2>
          <p class="legal-document__source">
            {{ page.sourceLabel }}
          </p>
        </header>

        <BaseAccordion
          class="faq-page__accordion"
          :items="page.items"
          default-value="what-is-solagree"
          numbered
        />
      </article>
    </section>

    <SiteFooter />
  </main>
</template>
