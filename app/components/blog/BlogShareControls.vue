<script setup lang="ts">
const props = defineProps<{
  title: string
  url: string
}>()

const linkedInHref = computed(() => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`)
const emailHref = computed(() => `mailto:?subject=${encodeURIComponent(props.title)}&body=${encodeURIComponent(props.url)}`)
</script>

<template>
  <nav
    class="blog-share-controls"
    aria-label="Share this article"
  >
    <p class="blog-share-controls__label">
      Share article
    </p>
    <div class="blog-share-controls__links">
      <a
        :href="linkedInHref"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >LinkedIn</a>
      <a :href="emailHref">Email</a>
    </div>
  </nav>
</template>
