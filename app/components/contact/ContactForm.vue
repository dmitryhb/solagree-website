<script setup lang="ts">
import {
  getContactSubmissionErrorMessage,
  submitContactSubmission
} from '~/services/contact-submission-api'
import { websitePortalFetcher } from '~/services/portal-api'
import { useSourceUrl } from '~/composables/useSourceUrl'
import type { ContactFormState } from '~/types/contact'

const runtimeConfig = useRuntimeConfig()
const { trackEvent } = useGoogleAnalytics()
const formEl = ref<HTMLFormElement | null>(null)
const submitted = ref(false)

const form = reactive<ContactFormState>({
  name: '',
  email: '',
  phone: '',
  smsOptIn: false,
  message: ''
})

const sourceUrl = useSourceUrl()

const {
  submitting,
  submissionResult,
  handleSubmit
} = useApplicationSubmission<ContactFormState, Awaited<ReturnType<typeof submitContactSubmission>>>({
  validate: () => {
    if (!formEl.value?.checkValidity()) {
      formEl.value?.reportValidity()
      return false
    }

    return true
  },
  getFormState: () => form,
  submit: (formState) => submitContactSubmission(formState, {
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    fetcher: websitePortalFetcher,
    sourceUrl: sourceUrl
  }),
  onSuccess: () => {
    trackEvent('contact_form_submitted', {
      source: 'contact_form'
    })

    submitted.value = true
  },
  errorTitle: '',
  getErrorMessage: getContactSubmissionErrorMessage
})
</script>

<template>
  <FormResultMessage
    v-if="submitted"
    kind="success"
    class="contact-form contact-form__thank-you"
  >
    <div>
      <p><strong>Thank you for reaching out.</strong></p>
      <p>We’ve received your message, and a Solagree team member will review it and follow up soon. If your matter is urgent, please use the direct contact details on this page.</p>
    </div>
  </FormResultMessage>

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

    <FormSmsOptInField
      id="contact-sms-opt-in"
      v-model="form.smsOptIn"
    />

    <SiteFormSubmit
      label="SEND"
      :submitting="submitting"
    />

    <FormResultMessage
      v-if="submissionResult"
      class="contact-form__status"
      kind="error"
      :message="submissionResult.message"
    />
  </form>
</template>
