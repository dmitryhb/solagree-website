<script setup lang="ts">
import { attorneyWebinarRegistrationContent } from '~/data/webinar-registration'
import type { WebinarRegistrationContent } from '~/types/webinar'

interface WebinarRegistrationIntroProps {
  content?: WebinarRegistrationContent
}

withDefaults(defineProps<WebinarRegistrationIntroProps>(), {
  content: () => attorneyWebinarRegistrationContent
})
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
      {{ content.title }}
    </h1>

    <p class="webinar-registration-intro__summary">
      <strong>{{ content.summaryLabel }}</strong>
      {{ content.summary }}
    </p>

    <div class="webinar-registration-intro__includes">
      <p class="webinar-registration-intro__includes-title">
        Includes
      </p>

      <ul class="webinar-registration-intro__features">
        <li
          v-for="feature in content.features"
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
        :src="content.presenter.imageSrc"
        :alt="content.presenter.imageAlt"
        :width="content.presenter.imageWidth"
        :height="content.presenter.imageHeight"
      >

      <figcaption class="webinar-registration-intro__caption">
        <strong>{{ content.presenter.name }}</strong>
        {{ content.presenter.captionSeparator ?? '-' }} {{ content.presenter.title }}
      </figcaption>
    </figure>
  </section>
</template>
