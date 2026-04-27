<script setup lang="ts">
import { attorneyPartnerPaths } from '~/data/attorney-partner-paths'
</script>

<template>
  <section
    class="attorney-partner-paths-section"
    aria-labelledby="attorney-partner-paths-title"
  >
    <div class="attorney-partner-paths-section__inner">
      <header
        v-appear
        class="attorney-partner-paths-section__header"
      >
        <h2
          id="attorney-partner-paths-title"
          class="attorney-partner-paths-section__title"
        >
          Three Ways to Partner
        </h2>

        <p class="attorney-partner-paths-section__intro">
          Choose what fits your practice - or do all three.
        </p>

        <SiteButton
          class="attorney-partner-paths-section__cta"
          to="/webinar/"
        >
          Watch the Partner Briefing
          <span
            class="attorney-partner-paths-section__cta-arrow"
            aria-hidden="true"
          />
        </SiteButton>
      </header>

      <div class="attorney-partner-paths-section__grid">
        <article
          v-for="(path, index) in attorneyPartnerPaths"
          :key="path.title"
          v-appear="{ delay: index * 80, variant: 'scale' }"
          class="attorney-partner-card"
        >
          <div class="attorney-partner-card__main">
            <h3 class="attorney-partner-card__title">
              {{ path.title }}
            </h3>

            <p class="attorney-partner-card__description">
              {{ path.description }}
            </p>
          </div>

          <ul class="attorney-partner-card__details">
            <li
              v-for="detail in path.details"
              :key="detail"
            >
              {{ detail }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
