<script setup lang="ts">
defineProps<{
  titleId: string
  description: string
}>()
</script>

<template>
  <main class="attorney-application-page">
    <section
      class="attorney-application-page__content attorney-application-page__content--sent"
      :aria-labelledby="titleId"
    >
      <div class="attorney-application-sent">
        <h1
          :id="titleId"
          class="attorney-application-sent__title"
        >
          Thank you for applying!
        </h1>

        <p class="attorney-application-sent__copy">
          {{ description }}
        </p>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
