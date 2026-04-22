<script setup lang="ts">
import ContactForm from '~/components/contact/ContactForm.vue'
import ContactPersonCard from '~/components/contact/ContactPersonCard.vue'
import DirectContactCard from '~/components/contact/DirectContactCard.vue'
import { contactPerson, directContactItems } from '~/data/contact'
</script>

<template>
  <main class="contact-page">
    <section class="contact-page__content">
      <div class="contact-page__top">
        <div
          v-appear
          class="contact-page__intro"
        >
          <h1 class="contact-page__title">
            Contact
          </h1>
          <p class="contact-page__copy">
            Whether you have additional questions, want to book a consultation, or need support, our team is here to help.
          </p>

          <ContactPersonCard :person="contactPerson" />
        </div>

        <ContactForm v-appear="{ delay: 100, variant: 'scale' }" />
      </div>

      <section
        class="contact-page__direct"
        aria-labelledby="contact-direct-title"
      >
        <h2
          v-appear
          id="contact-direct-title"
          class="contact-page__direct-title"
        >
          Reach us Directly
        </h2>

        <div class="contact-page__direct-grid">
          <DirectContactCard
            v-for="(item, index) in directContactItems"
            :key="item.title"
            :item="item"
            v-appear="{ delay: index * 80, variant: 'scale' }"
          />
        </div>
      </section>
    </section>

    <SiteFooter />
  </main>
</template>
