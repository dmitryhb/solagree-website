<script setup lang="ts">
import {
  attorneyMediationOptions,
  attorneyYesNoOptions
} from '~/data/attorney-application'

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
} = useAttorneyApplicationForm()
</script>

<template>
  <section
    class="attorney-application-form"
    aria-labelledby="attorney-application-title"
  >
    <h1
      id="attorney-application-title"
      class="attorney-application-form__title"
    >
      Attorney Partners
    </h1>

    <form
      ref="formEl"
      class="attorney-application-form__form"
      novalidate
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

      <button
        class="attorney-application-form__submit"
        type="submit"
        :disabled="submitting"
      >
        <span>{{ submitting ? 'SENDING...' : 'SEND' }}</span>
        <img
          class="attorney-application-form__submit-icon"
          src="/icons/send.svg"
          alt=""
          width="16"
          height="16"
          aria-hidden="true"
        >
      </button>

      <div
        v-if="submissionResult"
        class="attorney-application-form__result"
        :class="`attorney-application-form__result--${submissionResult.kind}`"
        role="status"
        aria-live="polite"
      >
        <p class="attorney-application-form__result-title">
          {{ submissionResult.title }}
        </p>
        <p>{{ submissionResult.message }}</p>
      </div>
    </form>
  </section>
</template>
