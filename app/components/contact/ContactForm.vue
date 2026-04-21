<script setup lang="ts">
import type { ContactFormState } from '~/types/contact'

const form = reactive<ContactFormState>({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const statusMessage = ref('')

function handleSubmit() {
  statusMessage.value = 'Thanks. We will get back to you shortly.'
}
</script>

<template>
  <form
    class="contact-form"
    aria-label="Contact form"
    @submit.prevent="handleSubmit"
  >
    <label
      class="sr-only"
      for="contact-name"
    >
      Name
    </label>
    <input
      id="contact-name"
      v-model="form.name"
      name="name"
      type="text"
      autocomplete="name"
      placeholder="Name"
      required
    >

    <label
      class="sr-only"
      for="contact-email"
    >
      Email
    </label>
    <input
      id="contact-email"
      v-model="form.email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="Email"
      required
    >

    <label
      class="sr-only"
      for="contact-phone"
    >
      Phone
    </label>
    <input
      id="contact-phone"
      v-model="form.phone"
      name="phone"
      type="tel"
      autocomplete="tel"
      placeholder="Phone (optional)"
    >

    <label
      class="sr-only"
      for="contact-message"
    >
      Message
    </label>
    <textarea
      id="contact-message"
      v-model="form.message"
      name="message"
      rows="5"
      placeholder="Message"
      required
    />

    <button
      class="contact-form__submit"
      type="submit"
    >
      <span>SEND</span>
      <img
        class="contact-form__submit-icon"
        src="/icons/send.svg"
        alt=""
        width="16"
        height="16"
        aria-hidden="true"
      >
    </button>

    <p
      v-if="statusMessage"
      class="contact-form__status"
      aria-live="polite"
    >
      {{ statusMessage }}
    </p>
  </form>
</template>
