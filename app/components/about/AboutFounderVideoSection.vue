<script setup lang="ts">
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'
</script>

<template>
  <section
    class="about-founder-video-section"
    aria-labelledby="about-founder-video-title"
  >
    <div class="about-founder-video-section__inner">
      <h2
        id="about-founder-video-title"
        v-appear
        class="about-founder-video-section__title"
      >
        Why We Built Solagree
      </h2>

      <WebinarVideoFrame
        v-appear="{ delay: 80, variant: 'scale' }"
        class="about-founder-video-section__video"
        image-alt="Video preview for Why We Built Solagree."
      />

      <blockquote
        v-appear="{ delay: 140 }"
        class="about-founder-video-section__quote"
      >
        <p>
          &ldquo;The system isn&apos;t fair to people. Something&apos;s got to give. I became determined to change the way we divorce in America.&rdquo;
        </p>
        <cite>&mdash; Amanda Mason, Co-Founder &amp; CEO</cite>
      </blockquote>
    </div>
  </section>
</template>
