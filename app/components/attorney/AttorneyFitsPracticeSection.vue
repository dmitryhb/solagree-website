<script setup lang="ts">
import { attorneyFitsPracticeContent } from '~/data/attorney-landing-content'
import type { AttorneyFitsPracticeContent } from '~/types/attorney-landing'

interface AttorneyFitsPracticeSectionProps {
  content?: AttorneyFitsPracticeContent
}

withDefaults(defineProps<AttorneyFitsPracticeSectionProps>(), {
  content: () => attorneyFitsPracticeContent
})
</script>

<template>
  <section
    class="attorney-fits-practice-section"
    aria-labelledby="attorney-fits-practice-title"
  >
    <div class="attorney-fits-practice-section__inner">
      <h2
        id="attorney-fits-practice-title"
        v-appear
        class="attorney-fits-practice-section__title"
      >
        {{ content.title }}
      </h2>

      <div class="attorney-fits-practice-section__grid">
        <div
          v-appear="{ variant: 'scale' }"
          class="attorney-fits-practice-section__panel"
        >
          <p class="attorney-fits-practice-section__copy">
            {{ content.body }}
          </p>

          <SiteButton
            class="attorney-fits-practice-section__cta"
            :to="content.ctaTo"
          >
            {{ content.ctaLabel }}
          </SiteButton>
        </div>

        <figure
          v-appear="{ delay: 100, variant: 'scale' }"
          class="attorney-fits-practice-section__media"
        >
          <img
            :src="content.image.src"
            :alt="content.image.alt"
            :width="content.image.width"
            :height="content.image.height"
            loading="lazy"
            decoding="async"
          >
        </figure>
      </div>
    </div>
  </section>
</template>
