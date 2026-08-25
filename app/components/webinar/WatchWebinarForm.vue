<script setup lang="ts">
import { stateOptions } from '~/data/us-states'
import { attorneyWebinarRegistrationContent } from '~/data/webinar-registration'
import {
  getWebinarRegistrationErrorMessage,
  submitWebinarRegistration
} from '~/services/webinar-registration-api'
import { websitePortalFetcher } from '~/services/portal-api'
import { focusPageDestination } from '~/utils/focus-destination'
import type { WebinarFormState, WebinarRegistrationContent } from '~/types/webinar'

interface WatchWebinarFormProps {
  subtitle?: string
  redirectPath?: string
  submissionType?: WebinarRegistrationContent['submissionType']
}

const props = withDefaults(defineProps<WatchWebinarFormProps>(), {
  subtitle: attorneyWebinarRegistrationContent.formSubtitle,
  redirectPath: attorneyWebinarRegistrationContent.formRedirectPath,
  submissionType: attorneyWebinarRegistrationContent.submissionType
})

const runtimeConfig = useRuntimeConfig()
const formEl = ref<HTMLFormElement | null>(null)
const form = reactive<WebinarFormState>({
  businessEmail: '',
  firstName: '',
  lastName: '',
  companyName: '',
  state: ''
})

const sourceUrl = useSourceUrl()

const {
  submitting,
  submissionResult,
  handleSubmit
} = useApplicationSubmission<WebinarFormState, Awaited<ReturnType<typeof submitWebinarRegistration>>>({
  validate: () => {
    if (!formEl.value?.checkValidity()) {
      formEl.value?.reportValidity()
      return false
    }

    return true
  },
  getFormState: () => form,
  submit: (formState) => submitWebinarRegistration(formState, {
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    fetcher: websitePortalFetcher,
    submissionType: props.submissionType,
    sourceUrl
  }),
  onSuccess: async () => {
    await navigateTo(props.redirectPath)
    await focusPageDestination()
  },
  errorTitle: '',
  getErrorMessage: getWebinarRegistrationErrorMessage
})
</script>

<template>
  <section
    class="watch-webinar-form"
    aria-labelledby="watch-webinar-title"
  >
    <h2
      id="watch-webinar-title"
      class="watch-webinar-form__title"
    >
      Watch Now
    </h2>

    <p class="watch-webinar-form__subtitle">
      {{ subtitle }}
    </p>

    <form
      ref="formEl"
      class="watch-webinar-form__form"
      @submit.prevent="handleSubmit"
    >
      <div class="watch-webinar-form__field watch-webinar-form__field--full">
        <label
          class="sr-only"
          for="webinar-business-email"
        >
          Business email
        </label>
        <input
          id="webinar-business-email"
          v-model="form.businessEmail"
          class="watch-webinar-form__control"
          name="businessEmail"
          type="email"
          autocomplete="email"
          placeholder="Business email*"
          required
        >
      </div>

      <div class="watch-webinar-form__row">
        <div class="watch-webinar-form__field">
          <label
            class="sr-only"
            for="webinar-first-name"
          >
            First name
          </label>
          <input
            id="webinar-first-name"
            v-model="form.firstName"
            class="watch-webinar-form__control"
            name="firstName"
            type="text"
            autocomplete="given-name"
            placeholder="First name *"
            required
          >
        </div>

        <div class="watch-webinar-form__field">
          <label
            class="sr-only"
            for="webinar-last-name"
          >
            Last name
          </label>
          <input
            id="webinar-last-name"
            v-model="form.lastName"
            class="watch-webinar-form__control"
            name="lastName"
            type="text"
            autocomplete="family-name"
            placeholder="Last name *"
            required
          >
        </div>
      </div>

      <div class="watch-webinar-form__row">
        <div class="watch-webinar-form__field">
          <label
            class="sr-only"
            for="webinar-company-name"
          >
            Company name
          </label>
          <input
            id="webinar-company-name"
            v-model="form.companyName"
            class="watch-webinar-form__control"
            name="companyName"
            type="text"
            autocomplete="organization"
            placeholder="Company name"
          >
        </div>

        <div class="watch-webinar-form__field watch-webinar-form__select-field">
          <label
            class="sr-only"
            for="webinar-state"
          >
            State
          </label>
          <select
            id="webinar-state"
            v-model="form.state"
            class="watch-webinar-form__control watch-webinar-form__select"
            name="state"
            required
          >
            <option
              value=""
              disabled
            >
              Select state*
            </option>
            <option
              v-for="state in stateOptions"
              :key="state.value"
              :value="state.value"
            >
              {{ state.label }}
            </option>
          </select>
          <span
            class="watch-webinar-form__chevron"
            aria-hidden="true"
          />
        </div>
      </div>

      <SiteFormSubmit
        class="watch-webinar-form__submit"
        label="Watch Now"
        submitting-label="Submitting..."
        :submitting="submitting"
      >
        <template #icon>
          <span
            class="watch-webinar-form__submit-icon"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </template>
      </SiteFormSubmit>

      <FormResultMessage
        v-if="submissionResult"
        class="watch-webinar-form__status"
        kind="error"
        :message="submissionResult.message"
      />
    </form>

    <p class="watch-webinar-form__contact">
      Looking for other information?
      <NuxtLink to="/contact">
        Get in touch.
      </NuxtLink>
    </p>
  </section>
</template>
