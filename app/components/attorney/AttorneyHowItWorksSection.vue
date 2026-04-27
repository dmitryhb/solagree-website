<script setup lang="ts">
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'
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
          See How It Works
        </h2>

        <p class="attorney-how-it-works-section__intro">
          Watch how the partnership works and what makes this different - in 90 seconds.
        </p>
      </header>

      <WebinarVideoFrame
        v-appear="{ variant: 'scale' }"
        class="attorney-how-it-works-section__video"
      />

      <SiteButton
        v-appear="{ delay: 80 }"
        class="attorney-how-it-works-section__cta"
        to="/webinar/"
      >
        Watch the full Partner Briefing
      </SiteButton>

      <blockquote
        v-appear="{ delay: 140 }"
        class="attorney-how-it-works-section__quote"
      >
        &ldquo;I can finally offer my clients a better path without sacrificing my own quality of life.&rdquo;
      </blockquote>
    </div>
  </section>
</template>
