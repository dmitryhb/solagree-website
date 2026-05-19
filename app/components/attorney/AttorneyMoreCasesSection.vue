<script setup lang="ts">
import { attorneyMoreCasesContent } from '~/data/attorney-landing-content'
import type { AttorneyMoreCasesContent } from '~/types/attorney-landing'

interface AttorneyMoreCasesSectionProps {
  content?: AttorneyMoreCasesContent
}

withDefaults(defineProps<AttorneyMoreCasesSectionProps>(), {
  content: () => attorneyMoreCasesContent
})
</script>

<template>
  <section
    class="attorney-more-cases-section"
    aria-labelledby="attorney-more-cases-title"
  >
    <div class="attorney-more-cases-section__inner">
      <div
        v-appear
        class="attorney-more-cases-section__copy"
      >
        <h2
          id="attorney-more-cases-title"
          class="attorney-more-cases-section__title"
        >
          {{ content.title }}
        </h2>

        <p
          v-for="paragraph in content.body.split('\n\n')"
          :key="paragraph"
          class="attorney-more-cases-section__body"
        >
          {{ paragraph }}
        </p>

        <p class="attorney-more-cases-section__link-copy">
          {{ content.linkPrefix }}<NuxtLink
            class="attorney-more-cases-section__link"
            :to="content.linkTo"
          >{{ content.linkLabel }}</NuxtLink>{{ content.linkSuffix }}
        </p>
      </div>

      <figure
        v-appear="{ delay: 100, variant: 'scale' }"
        class="attorney-more-cases-section__media"
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
  </section>
</template>
