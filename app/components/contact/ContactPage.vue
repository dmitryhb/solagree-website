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
        <div class="contact-page__intro">
          <p class="contact-page__eyebrow">
            Contact
          </p>
          <p class="contact-page__copy">
            Whether you have additional questions, want to book a consultation, or need support, our team is here to help.
          </p>

          <ContactPersonCard :person="contactPerson" />
        </div>

        <ContactForm />
      </div>

      <section
        class="contact-page__direct"
        aria-labelledby="contact-direct-title"
      >
        <h2
          id="contact-direct-title"
          class="contact-page__direct-title"
        >
          Reach us Directly
        </h2>

        <div class="contact-page__direct-grid">
          <DirectContactCard
            v-for="item in directContactItems"
            :key="item.title"
            :item="item"
          />
        </div>
      </section>
    </section>

    <SiteFooter />
  </main>
</template>
