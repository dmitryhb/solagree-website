<script setup lang="ts">
import { howItWorksPhases } from '~/data/how-it-works-phases'
</script>

<template>
  <section
    id="how-it-works"
    class="how-it-works-section"
    aria-labelledby="how-it-works-title"
  >
    <div class="how-it-works-section__inner">
      <div class="how-it-works-section__intro-grid">
        <div class="how-it-works-section__copy">
          <h2
            id="how-it-works-title"
            class="how-it-works-section__title"
          >
            How It Works
          </h2>
          <p class="how-it-works-section__intro">
            <strong>Three phases. One resolution.</strong> A structured process designed for couples who can't agree
            on everything.
          </p>
          <SiteButton
            class="how-it-works-section__cta"
            to="#quiz"
            size="sm"
          >
            Is Solagree right for you?
          </SiteButton>
        </div>

        <ol class="how-it-works-section__phases">
          <li
            v-for="phase in howItWorksPhases"
            :key="phase.title"
            class="how-it-works-section__phase"
          >
            <h3 class="how-it-works-section__phase-title">
              <span>{{ phase.eyebrow }}</span>
              {{ phase.title }}
            </h3>
            <p class="how-it-works-section__phase-description">
              {{ phase.description }}
            </p>
          </li>
        </ol>
      </div>

      <figure class="how-it-works-section__video">
        <img
          src="/images/video-placeholder.png"
          alt="Video placeholder for Solagree: How It Works."
          width="2152"
          height="1210"
          loading="lazy"
          decoding="async"
        >
      </figure>
    </div>
  </section>
</template>
