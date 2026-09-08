<script setup lang="ts">
import FamilyLandingPage from '~/components/family/FamilyLandingPage.vue'
import { specialNeedsLandingPage } from '~/data/family-landing-pages'
</script>

<template>
  <FamilyLandingPage :page="specialNeedsLandingPage" />
</template>
