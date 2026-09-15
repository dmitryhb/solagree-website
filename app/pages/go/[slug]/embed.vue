<script setup lang="ts">
definePageMeta({
  appShell: 'bare'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || '').trim())
</script>

<template>
  <CoBrandedPageRouteShell
    mode="embed"
    :seo-path="`/go/${slug}/embed`"
    no-index
    wrapper-class="co-branded-page-route--embed"
  />
</template>
