<script setup lang="ts">
import { webinarFeatures } from '~/data/webinar-registration'
</script>

<template>
  <section
    class="webinar-registration-intro"
    aria-labelledby="webinar-registration-title"
  >
    <h1
      id="webinar-registration-title"
      class="webinar-registration-intro__title"
    >
      What Could Solagree Add to Your Practice?
    </h1>

    <p class="webinar-registration-intro__summary">
      <strong>Attorney Partner Overview:</strong>
      More cases, more referrals, and new revenue opportunities - without adding overhead or complexity.
    </p>

    <div class="webinar-registration-intro__includes">
      <p class="webinar-registration-intro__includes-title">
        Includes
      </p>

      <ul class="webinar-registration-intro__features">
        <li
          v-for="feature in webinarFeatures"
          :key="feature.label"
          class="webinar-registration-intro__feature"
        >
          <span
            class="webinar-registration-intro__feature-icon"
            aria-hidden="true"
          />
          <span>{{ feature.label }}</span>
        </li>
      </ul>
    </div>

    <figure class="webinar-registration-intro__presenter">
      <img
        class="webinar-registration-intro__presenter-image"
        src="/images/amanda.png"
        alt="Amanda, Solagree co-founder"
        width="762"
        height="562"
      >

      <figcaption class="webinar-registration-intro__caption">
        <strong>Amanda</strong> - Solagree co-founder
      </figcaption>
    </figure>
  </section>
</template>
