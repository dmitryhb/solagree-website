<script setup lang="ts">
import {
  consultBestTimeOfDayOptions,
  consultPreferredContactMethodOptions,
  consultRequestInitialState
} from '~/data/consult-request'
import { stateOptions } from '~/data/us-states'
import {
  getConsultRequestSubmissionErrorMessage,
  submitConsultRequest
} from '~/services/consult-request-api'
import { websitePortalFetcher } from '~/services/portal-api'
import type {
  ConsultRequestPageContent,
  ConsultRequestFormState
} from '~/types/consult-request'
import { getStoredConsultQuizAnswers } from '~/utils/consult-quiz-answers'
import { focusPageDestination } from '~/utils/focus-destination'

const props = defineProps<{
  content: ConsultRequestPageContent
}>()

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const { trackEvent } = useGoogleAnalytics()

const formEl = ref<HTMLFormElement | null>(null)

const form = reactive<ConsultRequestFormState>({
  ...consultRequestInitialState
})

const contactMethodOptions = computed(() => consultPreferredContactMethodOptions.map(option => ({
  ...option,
  disabled: option.value === 'text' && !form.smsOptIn
})))

const referralCode = computed(() => {
  const refValue = route.query.ref

  if (Array.isArray(refValue)) {
    return refValue.find((value) => typeof value === 'string' && value.trim()) ?? null
  }

  return typeof refValue === 'string' ? refValue.trim() || null : null
})

const thankYouPath = computed(() => ({
  path: props.content.thankYouPath,
  query: referralCode.value ? { ref: referralCode.value } : undefined
}))

const sourceUrl = useSourceUrl()

watch(
  () => form.smsOptIn,
  (smsOptIn) => {
    if (!smsOptIn && form.preferredContactMethod === 'text') {
      form.preferredContactMethod = ''
    }
  }
)

const {
  submitting,
  submissionResult,
  handleSubmit
} = useApplicationSubmission<ConsultRequestFormState, Awaited<ReturnType<typeof submitConsultRequest>>>({
  validate: () => {
    if (!formEl.value?.checkValidity()) {
      formEl.value?.reportValidity()
      return false
    }

    return true
  },
  getFormState: () => form,
  submit: (formState) => submitConsultRequest(formState, {
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    fetcher: websitePortalFetcher,
    consultType: props.content.consultType,
    referralCode: referralCode.value,
    sourceUrl: sourceUrl,
    quizAnswers: getStoredConsultQuizAnswers()
  }),
  onSuccess: async () => {
    trackEvent('consultation_booked', {
      consult_type: props.content.consultType,
      referral_code: referralCode.value ?? undefined,
      source: 'consult_request_form'
    })

    await navigateTo(thankYouPath.value)
    await focusPageDestination()
  },
  errorTitle: 'Request not sent',
  getErrorMessage: getConsultRequestSubmissionErrorMessage
})
</script>

<template>
  <section
    class="consult-request-form"
    aria-labelledby="consult-request-title"
  >
    <div class="consult-request-form__intro">
      <p class="eyebrow">
        {{ content.eyebrow }}
      </p>
      <h1
        id="consult-request-title"
        class="consult-request-form__title"
      >
        {{ content.title }}
      </h1>
      <p class="consult-request-form__copy">
        {{ content.description }}
      </p>
    </div>

    <form
      ref="formEl"
      class="consult-request-form__form"
      @submit.prevent="handleSubmit"
    >
      <div class="consult-request-form__field">
        <label for="consult-full-name">
          Full name<span aria-hidden="true">*</span>
        </label>
        <input
          id="consult-full-name"
          v-model="form.fullName"
          name="fullName"
          type="text"
          autocomplete="name"
          placeholder="Type here..."
          required
        >
      </div>

      <div class="consult-request-form__field">
        <label for="consult-email">
          Email<span aria-hidden="true">*</span>
        </label>
        <input
          id="consult-email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="hello@example.com..."
          required
        >
      </div>

      <div class="consult-request-form__field">
        <label for="consult-phone">
          Phone<span aria-hidden="true">*</span>
        </label>
        <input
          id="consult-phone"
          v-model="form.phone"
          name="phone"
          type="tel"
          autocomplete="tel-national"
          inputmode="tel"
          pattern="\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
          title="Use a 10-digit US phone number, e.g. 415-555-1234."
          placeholder="415-555-1234..."
          required
        >
      </div>

      <div class="consult-request-form__field consult-request-form__field--select">
        <label for="consult-state">
          State<span aria-hidden="true">*</span>
        </label>
        <select
          id="consult-state"
          v-model="form.state"
          name="state"
          autocomplete="address-level1"
          required
        >
          <option
            value=""
            disabled
          >
            Select...
          </option>
          <option
            v-for="state in stateOptions"
            :key="state.value"
            :value="state.value"
          >
            {{ state.label }}
          </option>
        </select>
      </div>

      <FormSmsOptInField
        id="consult-sms-opt-in"
        v-model="form.smsOptIn"
      />

      <div class="consult-request-form__field consult-request-form__field--select">
        <label for="consult-contact-method">
          Preferred contact method<span aria-hidden="true">*</span>
        </label>
        <select
          id="consult-contact-method"
          v-model="form.preferredContactMethod"
          name="preferredContactMethod"
          required
        >
          <option
            value=""
            disabled
          >
            Select...
          </option>
          <option
            v-for="option in contactMethodOptions"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="consult-request-form__field consult-request-form__field--select">
        <label for="consult-best-time">
          Best time of day<span aria-hidden="true">*</span>
        </label>
        <select
          id="consult-best-time"
          v-model="form.bestTimeOfDay"
          name="bestTimeOfDay"
          required
        >
          <option
            value=""
            disabled
          >
            Select...
          </option>
          <option
            v-for="option in consultBestTimeOfDayOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <SiteFormSubmit
        label="SEND REQUEST"
        :submitting="submitting"
      />

      <FormResultMessage
        v-if="submissionResult"
        kind="error"
        :title="submissionResult.title"
        :message="submissionResult.message"
      />
    </form>
  </section>
</template>
