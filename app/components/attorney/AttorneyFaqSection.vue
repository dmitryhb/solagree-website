<script setup lang="ts">
import { attorneyFaqContent } from '~/data/attorney-landing-content'
import type { AttorneyFaqContent } from '~/types/attorney-landing'

interface AttorneyFaqSectionProps {
  content?: AttorneyFaqContent
}

withDefaults(defineProps<AttorneyFaqSectionProps>(), {
  content: () => attorneyFaqContent
})
</script>

<template>
  <section
    class="attorney-faq-section"
    aria-labelledby="attorney-faq-title"
  >
    <div class="attorney-faq-section__inner">
      <div
        v-appear
        class="attorney-faq-section__copy"
      >
        <h2
          id="attorney-faq-title"
          class="attorney-faq-section__title"
        >
          {{ content.title }}
        </h2>

        <p
          v-if="content.intro"
          class="attorney-faq-section__intro"
        >
          {{ content.intro }}
        </p>
      </div>

      <BaseAccordion
        v-appear="{ delay: 100 }"
        class="attorney-faq-section__accordion"
        :items="content.items"
        :default-value="content.defaultValue"
        numbered
      />
    </div>
  </section>
</template>
