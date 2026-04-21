<script setup lang="ts">
import type { LegalNavItem, LegalSlug } from '~/types/legal'
import LegalTabs from '~/components/legal/LegalTabs.vue'

defineProps<{
  navItems: LegalNavItem[]
  activeSlug: LegalSlug
}>()
</script>

<template>
  <header class="legal-hero">
    <h1 class="legal-hero__title">
      Legal Policies
    </h1>
    <p class="legal-hero__intro">
      Explore our Privacy Policy, Terms of Service, and Legal Guidelines to understand your rights and our commitments.
    </p>

    <LegalTabs
      :items="navItems"
      :active-slug="activeSlug"
    />
  </header>
</template>
