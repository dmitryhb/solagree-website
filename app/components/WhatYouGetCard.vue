<script setup lang="ts">
import type { WhatYouGetItem } from '~/types/what-you-get'

defineProps<{
  item: WhatYouGetItem
}>()
</script>

<template>
  <article class="what-you-get-card">
    <img
      class="what-you-get-card__icon"
      :src="item.iconSrc"
      alt=""
      width="184"
      height="184"
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    >

    <h3 class="what-you-get-card__title">
      {{ item.title }}
    </h3>

    <p class="what-you-get-card__description">
      {{ item.description }}
    </p>
  </article>
</template>
