<script setup lang="ts">
import type { DirectContactItem } from '~/types/contact'

defineProps<{
  item: DirectContactItem
}>()
</script>

<template>
  <article class="direct-contact-card">
    <img
      class="direct-contact-card__icon"
      :src="item.iconSrc"
      alt=""
      width="60"
      height="60"
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    >

    <div class="direct-contact-card__content">
      <h3 class="direct-contact-card__title">
        {{ item.title }}
      </h3>
      <p class="direct-contact-card__detail">
        {{ item.detail }}
      </p>
    </div>

    <a
      class="direct-contact-card__action"
      :href="item.href"
    >
      <span>{{ item.actionLabel }}</span>
      <span
        class="direct-contact-card__action-icon"
        aria-hidden="true"
      >
        &rarr;
      </span>
    </a>
  </article>
</template>
