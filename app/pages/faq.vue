<script setup lang="ts">
import FaqPage from '~/components/faq/FaqPage.vue'
import { faqPageContent } from '~/data/faq-page'

const faqStructuredItems = faqPageContent.sections.flatMap((section) => section.items)

useSolagreeSeo({
  title: faqPageContent.metaTitle,
  description: faqPageContent.metaDescription,
  path: '/faq',
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqStructuredItems.map((item) => ({
        '@type': 'Question',
        name: item.label,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.content
        }
      }))
    }
  ]
})
</script>

<template>
  <FaqPage :page="faqPageContent" />
</template>
