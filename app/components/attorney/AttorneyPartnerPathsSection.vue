<script setup lang="ts">
import { attorneyPartnerPathsContent } from '~/data/attorney-landing-content'
import type { AttorneyPartnerPathsContent } from '~/types/attorney-landing'

interface AttorneyPartnerPathsSectionProps {
  content?: AttorneyPartnerPathsContent
}

withDefaults(defineProps<AttorneyPartnerPathsSectionProps>(), {
  content: () => attorneyPartnerPathsContent
})
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
          {{ content.title }}
        </h2>

        <p class="attorney-partner-paths-section__intro">
          {{ content.intro }}
        </p>

        <SiteButton
          class="attorney-partner-paths-section__cta"
          :to="content.ctaTo"
        >
          {{ content.ctaLabel }}
          <img
            class="button-arrow-icon"
            src="/icons/arrow.svg"
            alt=""
            width="16"
            height="17"
            aria-hidden="true"
          >
        </SiteButton>
      </header>

      <div class="attorney-partner-paths-section__grid">
        <article
          v-for="(path, index) in content.paths"
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
