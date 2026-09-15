<script setup lang="ts">
import ApplicationTextField from '~/components/application/ApplicationTextField.vue'
import { usePortalFormSubmissionOptions } from '~/composables/usePortalFormSubmissionOptions'
import {
  getContactSubmissionErrorMessage,
  submitContactSubmission
} from '~/services/contact-submission-api'
import { useSourceUrl } from '~/composables/useSourceUrl'
import type { ContactFormState } from '~/types/contact'
import { validateNativeForm } from '~/utils/native-form-validation'

const portalSubmissionOptions = usePortalFormSubmissionOptions()
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
  validate: () => validateNativeForm(formEl.value),
  getFormState: () => form,
  submit: (formState) => submitContactSubmission(formState, {
    ...portalSubmissionOptions,
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
    :aria-busy="submitting"
    @submit.prevent="handleSubmit"
  >
    <ApplicationTextField
      id="contact-name"
      v-model="form.name"
      label="Name"
      name="name"
      autocomplete="name"
      placeholder="Name"
      label-visually-hidden
      variant="contact"
      required
    />

    <ApplicationTextField
      id="contact-email"
      v-model="form.email"
      label="Email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="Email"
      label-visually-hidden
      variant="contact"
      required
    />

    <ApplicationTextField
      id="contact-phone"
      v-model="form.phone"
      label="Phone"
      name="phone"
      type="tel"
      autocomplete="tel"
      placeholder="Phone (optional)"
      label-visually-hidden
      variant="contact"
    />

    <ApplicationTextField
      id="contact-message"
      v-model="form.message"
      label="Message"
      name="message"
      placeholder="Message"
      label-visually-hidden
      multiline
      rows="5"
      variant="contact"
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
