<script setup lang="ts">
import LegalPage from '~/components/legal/LegalPage.vue'
import { isLegalSlug, legalPages } from '~/data/legal-pages'

const route = useRoute()
const slug = String(route.params.slug)

if (!isLegalSlug(slug)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Legal page not found'
  })
}

const page = legalPages[slug]

useSolagreeSeo({
  title: page.metaTitle,
  description: page.metaDescription,
  path: `/legal/${page.slug}`
})
</script>

<template>
  <LegalPage :page="page" />
</template>
