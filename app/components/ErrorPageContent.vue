<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>

<template>
  <main class="error-page">
    <section
      class="error-page__hero"
      aria-labelledby="error-page-title"
    >
      <div class="error-page__content">
        <p class="error-page__eyebrow">
          {{ eyebrow }}
        </p>

        <h1
          id="error-page-title"
          class="error-page__title"
        >
          {{ title }}
        </h1>

        <p class="error-page__description">
          {{ description }}
        </p>

        <div class="error-page__actions">
          <slot name="actions" />
        </div>
      </div>

      <div
        class="error-page__mark"
        aria-hidden="true"
      >
        <span>404</span>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
