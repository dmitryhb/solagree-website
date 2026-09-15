<script setup lang="ts">
import ApplicationSelectField from '~/components/application/ApplicationSelectField.vue'
import ApplicationTextField from '~/components/application/ApplicationTextField.vue'
import { usePortalFormSubmissionOptions } from '~/composables/usePortalFormSubmissionOptions'
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
import type {
  ConsultRequestPageContent,
  ConsultRequestFormState
} from '~/types/consult-request'
import { getStoredConsultQuizAnswers } from '~/utils/consult-quiz-answers'
import { focusPageDestination } from '~/utils/focus-destination'
import { validateNativeForm } from '~/utils/native-form-validation'

const props = defineProps<{
  content: ConsultRequestPageContent
}>()

const portalSubmissionOptions = usePortalFormSubmissionOptions()
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
  validate: () => validateNativeForm(formEl.value),
  getFormState: () => form,
  submit: (formState) => submitConsultRequest(formState, {
    ...portalSubmissionOptions,
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
    class="request-form"
    aria-labelledby="consult-request-title"
  >
    <div class="request-form__intro">
      <p class="eyebrow">
        {{ content.eyebrow }}
      </p>
      <h1
        id="consult-request-title"
        class="request-form__title"
      >
        {{ content.title }}
      </h1>
      <p class="request-form__copy">
        {{ content.description }}
      </p>
    </div>

    <form
      ref="formEl"
      class="request-form__form"
      :aria-busy="submitting"
      @submit.prevent="handleSubmit"
    >
      <ApplicationTextField
        id="consult-full-name"
        v-model="form.fullName"
        label="Full name"
        name="fullName"
        autocomplete="name"
        required
      />

      <ApplicationTextField
        id="consult-email"
        v-model="form.email"
        label="Email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="hello@example.com..."
        required
      />

      <ApplicationTextField
        id="consult-phone"
        v-model="form.phone"
        label="Phone"
        name="phone"
        type="tel"
        autocomplete="tel-national"
        inputmode="tel"
        pattern="\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
        title="Use a 10-digit US phone number, e.g. 415-555-1234."
        placeholder="415-555-1234..."
        required
      />

      <ApplicationSelectField
        id="consult-state"
        v-model="form.state"
        label="State"
        name="state"
        autocomplete="address-level1"
        :options="stateOptions"
        required
      />

      <FormSmsOptInField
        id="consult-sms-opt-in"
        v-model="form.smsOptIn"
      />

      <ApplicationSelectField
        id="consult-contact-method"
        v-model="form.preferredContactMethod"
        label="Preferred contact method"
        name="preferredContactMethod"
        :options="contactMethodOptions"
        required
      />

      <ApplicationSelectField
        id="consult-best-time"
        v-model="form.bestTimeOfDay"
        label="Best time of day"
        name="bestTimeOfDay"
        :options="consultBestTimeOfDayOptions"
        required
      />

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
