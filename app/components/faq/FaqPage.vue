<script setup lang="ts">
import type { FaqPageContent } from '~/types/faq'
import LegalTabs from '~/components/legal/LegalTabs.vue'

const props = defineProps<{
  page: FaqPageContent
}>()

const route = useRoute()

const sectionTabs = computed(() => props.page.sections.map((section) => ({
  label: section.label,
  slug: section.slug,
  to: {
    path: '/faq',
    query: {
      section: section.slug
    }
  }
})))

const activeSection = computed(() => {
  const requestedSection = String(route.query.section ?? '')

  return props.page.sections.find((section) => section.slug === requestedSection) ?? props.page.sections[0]
})

const activeSectionSlug = computed(() => activeSection.value?.slug ?? '')
const activeAccordionDefaultValue = computed(() => activeSection.value?.items[0]?.value)
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

        <LegalTabs
          :items="sectionTabs"
          :active-slug="activeSectionSlug"
          aria-label="FAQ sections"
        />
      </header>

      <article
        v-if="activeSection"
        class="legal-document faq-page__document"
        aria-labelledby="faq-page-title"
      >
        <header class="legal-document__header">
          <h2
            id="faq-page-title"
            class="legal-document__title"
          >
            {{ activeSection.label }}
          </h2>
        </header>

        <BaseAccordion
          :key="activeSection.slug"
          class="faq-page__accordion"
          :items="activeSection.items"
          :default-value="activeAccordionDefaultValue"
          numbered
        />
      </article>
    </section>

    <SiteFooter />
  </main>
</template>
