<script setup lang="ts">
import type { ChoosePathOption } from '~/types/choose-path'

defineProps<{
  option: ChoosePathOption
}>()
</script>

<template>
  <article class="choose-path-card">
    <div class="choose-path-card__content">
      <h3 class="choose-path-card__title">
        {{ option.title }}
      </h3>

      <p class="choose-path-card__description">
        {{ option.description }}
      </p>

      <ul class="choose-path-card__features">
        <li
          v-for="feature in option.features"
          :key="feature"
          class="choose-path-card__feature"
        >
          {{ feature }}
        </li>
      </ul>
    </div>

    <SiteButton
      class="choose-path-card__cta"
      :to="option.ctaTo"
      size="sm"
    >
      {{ option.ctaLabel }}
    </SiteButton>
  </article>
</template>
