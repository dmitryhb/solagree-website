<script setup lang="ts">
import type { TabNavItem } from '~/types/tabs'

withDefaults(defineProps<{
  items: TabNavItem[]
  activeSlug: string
  ariaLabel?: string
}>(), {
  ariaLabel: 'Legal policies'
})
</script>

<template>
  <nav
    class="legal-tabs"
    :aria-label="ariaLabel"
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
