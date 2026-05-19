<script setup lang="ts">
import { attorneyOnePlaceContent } from '~/data/attorney-landing-content'
import type { AttorneyOnePlaceContent } from '~/types/attorney-landing'

interface AttorneyOnePlaceSectionProps {
  content?: AttorneyOnePlaceContent
}

withDefaults(defineProps<AttorneyOnePlaceSectionProps>(), {
  content: () => attorneyOnePlaceContent
})
</script>

<template>
  <section
    class="attorney-one-place-section"
    aria-labelledby="attorney-one-place-title"
  >
    <div class="attorney-one-place-section__inner">
      <figure
        v-appear="{ variant: 'scale' }"
        class="attorney-one-place-section__media"
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

      <div
        v-appear="{ delay: 100 }"
        class="attorney-one-place-section__content"
      >
        <div class="attorney-one-place-section__copy">
          <h2
            id="attorney-one-place-title"
            class="attorney-one-place-section__title"
          >
            {{ content.title }}
          </h2>

          <p class="attorney-one-place-section__intro">
            {{ content.intro }}
          </p>
        </div>

        <div class="attorney-one-place-section__benefits">
          <p class="attorney-one-place-section__benefits-title">
            {{ content.benefitsTitle }}
          </p>

          <ul class="attorney-one-place-section__list">
            <li
              v-for="benefit in content.benefits"
              :key="benefit.title"
            >
              <strong>{{ benefit.title }}</strong> - {{ benefit.description }}
            </li>
          </ul>
        </div>

        <SiteButton
          class="attorney-one-place-section__cta"
          :to="content.ctaTo"
          size="sm"
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
      </div>
    </div>
  </section>
</template>
