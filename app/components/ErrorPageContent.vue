<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow: string
  title: string
  description: string
  /** Status code displayed in the hero mark; defaults to the 404 visual. */
  code?: string | number
}>(), {
  code: '404'
})
</script>

<template>
  <main class="error-page">
    <section
      class="error-page__hero"
      aria-labelledby="error-page-title"
    >
      <div
        v-appear
        class="error-page__content"
      >
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
        v-appear="{ delay: 100, variant: 'scale' }"
        class="error-page__mark"
        aria-hidden="true"
      >
        <span>{{ code }}</span>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
