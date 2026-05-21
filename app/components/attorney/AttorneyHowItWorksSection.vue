<script setup lang="ts">
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'
import { attorneyHowItWorksContent } from '~/data/attorney-landing-content'
import type { AttorneyHowItWorksContent } from '~/types/attorney-landing'

interface AttorneyHowItWorksSectionProps {
  content?: AttorneyHowItWorksContent
}

withDefaults(defineProps<AttorneyHowItWorksSectionProps>(), {
  content: () => attorneyHowItWorksContent
})
</script>

<template>
  <section
    class="attorney-how-it-works-section"
    aria-labelledby="attorney-how-it-works-title"
  >
    <div class="attorney-how-it-works-section__inner">
      <header
        v-appear
        class="attorney-how-it-works-section__header"
      >
        <h2
          id="attorney-how-it-works-title"
          class="attorney-how-it-works-section__title"
        >
          {{ content.title }}
        </h2>

        <p class="attorney-how-it-works-section__intro">
          {{ content.intro }}
        </p>
      </header>

      <WebinarVideoFrame
        v-appear="{ variant: 'scale' }"
        class="attorney-how-it-works-section__video"
        :video-src="content.videoSrc"
        :video-title="content.videoTitle"
        :image-src="content.videoImageSrc"
        :image-alt="content.videoImageAlt"
      />

      <SiteButton
        v-appear="{ delay: 80 }"
        class="attorney-how-it-works-section__cta"
        :to="content.ctaTo"
      >
        {{ content.ctaLabel }}
      </SiteButton>

      <blockquote
        v-appear="{ delay: 140 }"
        class="attorney-how-it-works-section__quote"
      >
        &ldquo;{{ content.quote }}&rdquo;
      </blockquote>
    </div>
  </section>
</template>
