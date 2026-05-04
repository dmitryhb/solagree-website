<script setup lang="ts">
import FaqPage from '~/components/faq/FaqPage.vue'
import { faqPageContent } from '~/data/faq-page'

useSolagreeSeo({
  title: faqPageContent.metaTitle,
  description: faqPageContent.metaDescription,
  path: '/faq',
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqPageContent.items.map((item) => ({
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
