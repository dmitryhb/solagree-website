<script setup lang="ts">
import { watchEffect } from 'vue'
import FormCheckboxField from '~/components/form/FormCheckboxField.vue'
import { useProfessionalTerms } from '~/composables/useProfessionalTerms'
import {
  attorneyMediationOptions,
  attorneyYesNoOptions
} from '~/data/attorney-application'

const { terms, status: termsStatus, refresh: refreshTerms } = useProfessionalTerms()
const {
  currentYear,
  formEl,
  form,
  hasAttemptedSubmit,
  hasBarStateError,
  hasLicenseNumberError,
  submitting,
  submissionResult,
  addLicenseNumber,
  removeLicenseNumber,
  updateLicenseNumber,
  handleSubmit
} = useAttorneyApplicationForm({ refreshTerms })
watchEffect(() => {
  form.termsVersion = terms.value?.current?.version ?? ''
  form.termsUrl = terms.value?.current?.url ?? ''
  form.termsAccepted = false
})
</script>

<template>
  <section
    class="application-form"
    aria-labelledby="attorney-application-title"
  >
    <h1
      id="attorney-application-title"
      class="application-form__title"
    >
      Attorney Partners
    </h1>

    <form
      ref="formEl"
      class="application-form__form"
      novalidate
      :aria-busy="submitting"
      @submit.prevent="handleSubmit"
    >
      <ApplicationTextField
        id="attorney-name"
        v-model="form.name"
        label="Name"
        name="name"
        autocomplete="name"
        required
      />

      <ApplicationTextField
        id="attorney-company"
        v-model="form.company"
        label="Company"
        name="company"
        autocomplete="organization"
        required
      />

      <ApplicationTextField
        id="attorney-email"
        v-model="form.email"
        label="Email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="hello@example.com..."
        required
      />

      <ApplicationTextField
        id="attorney-phone"
        v-model="form.phone"
        label="Phone Number"
        name="phone"
        type="tel"
        autocomplete="tel"
        inputmode="tel"
        pattern="(?:\+?1[.\s\-]?)?\(?\d{3}\)?[.\s\-]?\d{3}[.\s\-]?\d{4}"
        title="Use a 10-digit US phone number, e.g. 1-415-555-1234 or 415-555-1234."
        placeholder="1-415-555-1234..."
        required
      />

      <ApplicationTextField
        id="attorney-address"
        v-model="form.address"
        label="Address"
        name="address"
        autocomplete="street-address"
        multiline
        required
      />

      <AttorneyApplicationBarStatesFieldset
        v-model="form.barStates"
        :has-error="hasBarStateError"
      />

      <AttorneyApplicationLicenseFieldset
        :rows="form.licenseNumbers"
        :has-attempted-submit="hasAttemptedSubmit"
        :has-error="hasLicenseNumberError"
        @add="addLicenseNumber"
        @remove="removeLicenseNumber"
        @update="updateLicenseNumber"
      />

      <ApplicationTextField
        id="attorney-licensure-year"
        v-model="form.initialLicensureYear"
        label="Year of initial licensure"
        name="initialLicensureYear"
        type="number"
        inputmode="numeric"
        min="1900"
        :max="currentYear"
        placeholder="YYYY"
        required
      />

      <ApplicationSelectField
        id="attorney-good-standing"
        v-model="form.goodStanding"
        label="License in good standing"
        name="goodStanding"
        :options="attorneyYesNoOptions"
        required
      />

      <ApplicationSelectField
        id="attorney-disciplinary-finding"
        v-model="form.disciplinaryFinding"
        label="Have you ever been subject to a disciplinary finding?"
        name="disciplinaryFinding"
        hint="A positive answer does not necessarily disqualify you."
        hint-id="attorney-disciplinary-finding-hint"
        :options="attorneyYesNoOptions"
        required
      />

      <ApplicationTextField
        v-if="form.disciplinaryFinding === 'yes'"
        id="attorney-disciplinary-explanation"
        v-model="form.disciplinaryExplanation"
        label="Please explain"
        name="disciplinaryExplanation"
        multiline
        required
      />

      <ApplicationSelectField
        id="attorney-mediation-experience"
        v-model="form.mediationExperience"
        label="Do you have a mediation certification or a mediation practice?"
        name="mediationExperience"
        :options="attorneyMediationOptions"
        required
      />

      <ApplicationSelectField
        id="attorney-neutral-interest"
        v-model="form.neutralInterest"
        label="Interested in Solagree cases as a neutral mediator or arbitrator?"
        name="neutralInterest"
        :options="attorneyYesNoOptions"
        required
      />

      <ApplicationTextField
        id="attorney-adr-networks"
        v-model="form.adrNetworks"
        label="Have you participated in other ADR family law networks or organizations?"
        name="adrNetworks"
        placeholder="If so, please list them here..."
        multiline
      />

      <ApplicationSelectField
        id="attorney-consultation-interest"
        v-model="form.consultationInterest"
        label="Are you interested in taking 30-45 min flat fee ($250) pre-enrollment consultation calls as an attorney advocate?"
        name="consultationInterest"
        :options="attorneyYesNoOptions"
        required
      />

      <FormSmsOptInField
        id="attorney-sms-opt-in"
        v-model="form.smsOptIn"
      />

      <FormCheckboxField
        v-model="form.termsAccepted"
        name="termsAccepted"
        :disabled="!terms?.available"
        required
      >
        I have read and agree to the
        <a
          v-if="terms?.current"
          :href="terms.current.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Partner Terms (version {{ terms.current.version }})
        </a><span v-else>Partner Terms</span>.
      </FormCheckboxField>

      <p v-if="termsStatus === 'unavailable'" class="form-field__hint" role="status">
        Applications are temporarily unavailable until the approved terms are published.
      </p>
      <p v-else-if="termsStatus === 'loading'" class="form-field__hint" role="status">
        Loading approved terms…
      </p>
      <div v-else-if="termsStatus === 'error'" role="alert">
        <p>We could not load the approved terms. Please try again.</p>
        <button type="button" @click="refreshTerms">Retry</button>
      </div>

      <SiteFormSubmit
        label="SEND"
        :submitting="submitting"
        :disabled="!terms?.available"
      />

      <FormResultMessage
        v-if="submissionResult"
        :kind="submissionResult.kind"
        :title="submissionResult.title"
        :message="submissionResult.message"
      />
    </form>
  </section>
</template>
