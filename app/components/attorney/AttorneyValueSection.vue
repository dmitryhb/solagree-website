<script setup lang="ts">
import { attorneyValueContent } from '~/data/attorney-landing-content'
import type { AttorneyValueContent } from '~/types/attorney-landing'

interface AttorneyValueSectionProps {
  content?: AttorneyValueContent
}

withDefaults(defineProps<AttorneyValueSectionProps>(), {
  content: () => attorneyValueContent
})
</script>

<template>
  <section
    class="attorney-value-section"
    aria-labelledby="attorney-value-title"
  >
    <div class="attorney-value-section__inner">
      <header
        v-appear
        class="attorney-value-section__header"
      >
        <h2
          id="attorney-value-title"
          class="attorney-value-section__title"
        >
          {{ content.title }}
        </h2>

        <p class="attorney-value-section__intro">
          {{ content.intro }}
        </p>
      </header>

      <div class="attorney-value-section__grid">
        <article
          v-for="(card, index) in content.cards"
          :key="card.title"
          v-appear="{ delay: index * 80, variant: 'scale' }"
          class="attorney-value-card"
        >
          <img
            class="attorney-value-card__icon"
            :src="card.iconSrc"
            alt=""
            width="20"
            height="20"
            aria-hidden="true"
          >

          <h3 class="attorney-value-card__title">
            {{ card.title }}
          </h3>

          <p class="attorney-value-card__description">
            {{ card.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
