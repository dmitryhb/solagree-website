<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  title: string
  body: string
  meta?: string
  dark?: boolean
}>(), {
  label: '',
  meta: '',
  dark: false
})
</script>

<template>
  <article :class="['review-row', dark && 'review-row--dark']">
    <p
      v-if="label"
      class="review-row__label"
    >
      {{ label }}
    </p>
    <h3 class="review-row__title">
      {{ title }}
    </h3>
    <p class="review-row__body">
      {{ body }}
    </p>
    <p
      v-if="meta"
      class="review-row__meta"
    >
      {{ meta }}
    </p>
  </article>
</template>
