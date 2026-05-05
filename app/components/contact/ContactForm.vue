<script setup lang="ts">
import {
  getContactSubmissionErrorMessage,
  submitContactSubmission
} from '~/services/contact-submission-api'
import { isPortalApiConfigurationError } from '~/services/portal-api'
import type { ContactSubmissionFetcher } from '~/services/contact-submission-api'
import type { ContactFormState } from '~/types/contact'

const runtimeConfig = useRuntimeConfig()
const formEl = ref<HTMLFormElement | null>(null)
const submitting = ref(false)
const submitted = ref(false)
const statusMessage = ref('')

const form = reactive<ContactFormState>({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const getSourceUrl = (): string | null => {
  if (!import.meta.client) {
    return null
  }

  const sourceUrl = new URL(window.location.href)
  sourceUrl.hash = ''

  return sourceUrl.toString()
}

const handleSubmit = async () => {
  if (submitting.value) {
    return
  }

  statusMessage.value = ''

  if (!formEl.value?.checkValidity()) {
    formEl.value?.reportValidity()
    return
  }

  submitting.value = true

  try {
    await submitContactSubmission(form, {
      portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
      fetcher: $fetch as unknown as ContactSubmissionFetcher,
      sourceUrl: getSourceUrl()
    })

    submitted.value = true
  } catch (error) {
    if (isPortalApiConfigurationError(error)) {
      console.error(error)
    }

    statusMessage.value = getContactSubmissionErrorMessage(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div
    v-if="submitted"
    class="contact-form contact-form__thank-you"
    role="status"
    aria-live="polite"
  >
    <p><strong>Thank you for reaching out.</strong></p>
    <p>We’ve received your message, and a Solagree team member will review it and follow up soon. If your matter is urgent, please use the direct contact details on this page.</p>
  </div>

  <form
    v-else
    ref="formEl"
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
      :disabled="submitting"
    >
      <span>{{ submitting ? 'SENDING...' : 'SEND' }}</span>
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
      role="status"
      aria-live="polite"
    >
      {{ statusMessage }}
    </p>
  </form>
</template>
