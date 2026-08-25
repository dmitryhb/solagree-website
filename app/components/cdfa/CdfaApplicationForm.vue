<script setup lang="ts">
import {
  cdfaCertificationStatusOptions,
  cdfaClientExperienceOptions,
  cdfaClientSourceOptions,
  cdfaConsultationInterestOptions
} from '~/data/cdfa-application'

const {
  formEl,
  form,
  hasSpecializationError,
  submitting,
  submissionResult,
  handleSubmit
} = useCdfaApplicationForm()

const submissionResultEl = ref<HTMLElement | null>(null)

watch(
  submissionResult,
  async (result) => {
    if (result?.kind !== 'error') {
      return
    }

    await nextTick()
    submissionResultEl.value?.focus()
  }
)
</script>

<template>
  <section
    class="attorney-application-form"
    aria-labelledby="cdfa-application-title"
  >
    <h1
      id="cdfa-application-title"
      class="attorney-application-form__title"
    >
      CDFA® Network
    </h1>

    <form
      ref="formEl"
      class="attorney-application-form__form"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <ApplicationTextField
        id="cdfa-name"
        v-model="form.name"
        label="Name"
        name="name"
        autocomplete="name"
        required
      />

      <ApplicationTextField
        id="cdfa-company"
        v-model="form.company"
        label="Company"
        name="company"
        autocomplete="organization"
        required
      />

      <ApplicationTextField
        id="cdfa-email"
        v-model="form.email"
        label="Email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="hello@example.com..."
        required
      />

      <ApplicationTextField
        id="cdfa-phone"
        v-model="form.phone"
        label="Phone Number"
        name="phone"
        type="tel"
        autocomplete="tel-national"
        inputmode="tel"
        pattern="\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
        title="Use a 10-digit US phone number, e.g. 415-555-1234."
        placeholder="415-555-1234..."
        required
      />

      <ApplicationTextField
        id="cdfa-address"
        v-model="form.address"
        label="Address"
        name="address"
        autocomplete="street-address"
        multiline
        required
      />

      <ApplicationSelectField
        id="cdfa-certification-status"
        v-model="form.certificationStatus"
        label="Are you a Certified Divorce Financial Analyst (CDFA®)?"
        name="certificationStatus"
        :options="cdfaCertificationStatusOptions"
        required
      />

      <ApplicationTextField
        id="cdfa-certification-number"
        v-model="form.certificationNumber"
        label="CDFA® Certification Number"
        name="certificationNumber"
      />

      <ApplicationSelectField
        id="cdfa-client-experience"
        v-model="form.clientExperience"
        label="How many years have you been working with divorcing clients?"
        name="clientExperience"
        :options="cdfaClientExperienceOptions"
        required
      />

      <ApplicationTextField
        id="cdfa-service-area"
        v-model="form.serviceArea"
        label="What geographic area do you primarily serve?"
        name="serviceArea"
        placeholder="e.g., &quot;San Francisco Bay Area&quot; or &quot;Remote/National&quot;"
        described-by="cdfa-service-area-hint"
        required
      />
      <p
        id="cdfa-service-area-hint"
        class="attorney-application-form__hint"
      >
        CDFAs can work remotely nationwide, but we match based on client preference
      </p>

      <CdfaApplicationSpecializationsFieldset
        v-model="form.specializations"
        :has-error="hasSpecializationError"
      />

      <ApplicationTextField
        id="cdfa-adr-networks"
        v-model="form.adrNetworks"
        label="Have you participated in other ADR family law networks or organizations?"
        name="adrNetworks"
        placeholder="If so, please list them here..."
        multiline
      />

      <ApplicationSelectField
        id="cdfa-client-source"
        v-model="form.clientSource"
        label="Do you currently have divorcing clients you'd like to bring into the Solagree process?"
        name="clientSource"
        :options="cdfaClientSourceOptions"
        required
      />

      <ApplicationSelectField
        id="cdfa-consultation-interest"
        v-model="form.consultationInterest"
        label="Are you interested in taking 30-45 min fee ($50) pre-enrollment consultation calls as a CDFA® advisor?"
        name="consultationInterest"
        :options="cdfaConsultationInterestOptions"
        required
      />

      <FormSmsOptInField
        id="cdfa-sms-opt-in"
        v-model="form.smsOptIn"
      />

      <label class="attorney-application-form__terms">
        <input
          v-model="form.termsAccepted"
          name="termsAccepted"
          type="checkbox"
          required
        >
        <span>
          I have read and agree to the
          <NuxtLink
            to="/legal/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms and conditions
          </NuxtLink>.
        </span>
      </label>

      <SiteFormSubmit
        label="SEND"
        :submitting="submitting"
      />

      <div
        v-if="submissionResult"
        ref="submissionResultEl"
        class="attorney-application-form__result"
        :class="`attorney-application-form__result--${submissionResult.kind}`"
        :role="submissionResult.kind === 'error' ? 'alert' : 'status'"
        tabindex="-1"
      >
        <p class="attorney-application-form__result-title">
          {{ submissionResult.title }}
        </p>
        <p>{{ submissionResult.message }}</p>
      </div>
    </form>
  </section>
</template>
