<script setup lang="ts">
import { splashFeatures } from '~/data/splash-content'
</script>

<template>
  <section
    class="splash-section"
    aria-labelledby="splash-title"
  >
    <div class="splash-section__inner">
      <div class="splash-section__content">
        <h1
          id="splash-title"
          class="splash-section__title"
        >
          Divorce without court.
          <span>Decisions without drama.</span>
        </h1>

        <p class="splash-section__intro">
          A next-generation divorce method designed to reduce conflict and cost - even when you don't agree on everything.
        </p>

        <div class="splash-section__actions">
          <SiteButton
            class="splash-section__primary"
            to="#quiz"
          >
            Is This Right for You?
          </SiteButton>

          <SiteButton
            class="splash-section__secondary"
            to="#how-it-works"
            variant="ghost"
          >
            How it Works
          </SiteButton>
        </div>
      </div>

      <ul class="splash-section__features">
        <li
          v-for="feature in splashFeatures"
          :key="feature.label"
          class="splash-section__feature"
        >
          {{ feature.label }}
        </li>
      </ul>
    </div>
  </section>
</template>
