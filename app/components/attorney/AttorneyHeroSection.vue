<script setup lang="ts">
import { attorneyHeroContent } from '~/data/attorney-landing-content'
import type { AttorneyHeroContent } from '~/types/attorney-landing'

interface AttorneyHeroSectionProps {
  content?: AttorneyHeroContent
}

withDefaults(defineProps<AttorneyHeroSectionProps>(), {
  content: () => attorneyHeroContent
})
</script>

<template>
  <section
    class="attorney-hero-section"
    aria-labelledby="attorney-hero-title"
  >
    <div class="attorney-hero-section__inner">
      <div
        v-appear
        class="attorney-hero-section__content"
      >
        <p class="attorney-hero-section__eyebrow">
          {{ content.eyebrow }}
        </p>

        <h1
          id="attorney-hero-title"
          class="attorney-hero-section__title"
        >
          <span
            v-for="line in content.titleLines"
            :key="line"
          >{{ line }}</span>
        </h1>

        <p class="attorney-hero-section__intro">
          {{ content.intro }}
        </p>

        <div class="attorney-hero-section__actions">
          <SiteButton
            class="attorney-hero-section__primary"
            :to="content.primaryCtaTo"
          >
            {{ content.primaryCtaLabel }}
            <img
              class="button-arrow-icon"
              src="/icons/arrow.svg"
              alt=""
              width="16"
              height="17"
              aria-hidden="true"
            >
          </SiteButton>

          <NuxtLink
            class="attorney-hero-section__secondary"
            :to="content.secondaryCtaTo"
          >
            {{ content.secondaryCtaLabel }}
          </NuxtLink>
        </div>
      </div>

      <figure
        v-appear="{ delay: 100, variant: 'scale' }"
        class="attorney-hero-section__media"
      >
        <img
          :src="content.image.src"
          :alt="content.image.alt"
          :width="content.image.width"
          :height="content.image.height"
          loading="eager"
          decoding="async"
        >
      </figure>
    </div>
  </section>
</template>
