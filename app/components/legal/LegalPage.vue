<script setup lang="ts">
import { legalNavItems } from '~/data/legal-pages'
import type { LegalPageContent } from '~/types/legal'
import LegalDocument from '~/components/legal/LegalDocument.vue'
import LegalHero from '~/components/legal/LegalHero.vue'

defineProps<{
  page: LegalPageContent
}>()
</script>

<template>
  <main class="legal-page">
    <section class="legal-page__content">
      <LegalHero
        :nav-items="legalNavItems"
        :active-slug="page.slug"
      />
      <LegalDocument :page="page" />
    </section>

    <SiteFooter />
  </main>
</template>
