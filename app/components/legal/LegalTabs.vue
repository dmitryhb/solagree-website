<script setup lang="ts">
import type { LegalNavItem, LegalSlug } from '~/types/legal'

defineProps<{
  items: LegalNavItem[]
  activeSlug: LegalSlug
}>()
</script>

<template>
  <nav
    class="legal-tabs"
    aria-label="Legal policies"
  >
    <NuxtLink
      v-for="item in items"
      :key="item.slug"
      class="legal-tabs__link"
      :class="{ 'legal-tabs__link--active': item.slug === activeSlug }"
      :to="item.to"
      :aria-current="item.slug === activeSlug ? 'page' : undefined"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
