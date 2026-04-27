<script setup lang="ts">
import { attorneyValueCards } from '~/data/attorney-value-cards'
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
          What's In It For You
        </h2>

        <p class="attorney-value-section__intro">
          Beyond the courtroom - a smarter way to serve clients.
        </p>
      </header>

      <div class="attorney-value-section__grid">
        <article
          v-for="(card, index) in attorneyValueCards"
          :key="card.title"
          v-appear="{ delay: index * 80, variant: 'scale' }"
          class="attorney-value-card"
        >
          <img
            class="attorney-value-card__icon"
            src="/icons/growth-icon.svg"
            alt=""
            width="21"
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
