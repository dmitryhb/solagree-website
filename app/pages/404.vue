<script setup lang="ts">
useSeoMeta({
  title: 'Page Not Found | Solagree',
  description: 'The page you are looking for may have moved, or the link may no longer be available.',
  robots: 'noindex, nofollow'
})
</script>

<template>
  <ErrorPageContent
    eyebrow="404"
    title="Page not found"
    description="The page you are looking for may have moved, or the link may no longer be available."
  >
    <template #actions>
      <SiteButton to="/">
        Return home
      </SiteButton>

      <SiteButton
        to="/#quiz"
        variant="muted"
      >
        Take the quiz
      </SiteButton>
    </template>
  </ErrorPageContent>
</template>
