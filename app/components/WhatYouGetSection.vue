<script setup lang="ts">
import { whatYouGetItems } from '~/data/what-you-get-items'
</script>

<template>
  <section
    id="what-you-get"
    class="what-you-get-section"
    aria-labelledby="what-you-get-title"
  >
    <div class="what-you-get-section__inner">
      <header
        v-appear
        class="what-you-get-section__header"
      >
        <h2
          id="what-you-get-title"
          class="what-you-get-section__title"
        >
          What you get with <span>Solagree</span>
        </h2>
      </header>

      <div class="what-you-get-section__grid">
        <WhatYouGetCard
          v-for="(item, index) in whatYouGetItems"
          :key="item.title"
          :item="item"
          v-appear="{ delay: index * 80, variant: 'scale' }"
        />
      </div>
    </div>
  </section>
</template>
