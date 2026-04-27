<script setup lang="ts">
import { attorneyFaqItems } from '~/data/attorney-faq'
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
          Common Attorney Partner Questions
        </h2>

        <p class="attorney-faq-section__intro">
          As a partner attorney, you provide strategic counsel, receive referrals, or serve as a neutral - without the
          administrative burden. Cases resolve faster, fees are predictable, and you can serve more clients without
          adding staff.
        </p>
      </div>

      <BaseAccordion
        v-appear="{ delay: 100 }"
        class="attorney-faq-section__accordion"
        :items="attorneyFaqItems"
        default-value="bring-own-cases"
        numbered
      />
    </div>
  </section>
</template>
