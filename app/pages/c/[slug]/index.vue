<script setup lang="ts">
definePageMeta({
  appShell: 'bare'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || '').trim())

await navigateTo({
  path: `/meet/${encodeURIComponent(slug.value)}`
}, {
  redirectCode: 301
})
</script>

<template>
  <span hidden>Redirecting...</span>
</template>
