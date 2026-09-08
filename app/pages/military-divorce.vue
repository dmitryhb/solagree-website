<script setup lang="ts">
import FamilyLandingPage from '~/components/family/FamilyLandingPage.vue'
import { militaryLandingPage } from '~/data/family-landing-pages'
</script>

<template>
  <FamilyLandingPage :page="militaryLandingPage" />
</template>
