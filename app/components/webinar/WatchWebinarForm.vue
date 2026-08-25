<script setup lang="ts">
import { stateOptions } from '~/data/us-states'
import { attorneyWebinarRegistrationContent } from '~/data/webinar-registration'
import {
  getWebinarRegistrationErrorMessage,
  submitWebinarRegistration
} from '~/services/webinar-registration-api'
import { isPortalApiConfigurationError, websitePortalFetcher } from '~/services/portal-api'
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

const submitting = ref(false)
const statusMessage = ref('')

const getSourceUrl = (): string | null => {
  if (!import.meta.client) {
    return null
  }

  return window.location.href
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
    await submitWebinarRegistration(form, {
      portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
      fetcher: websitePortalFetcher,
      submissionType: props.submissionType,
      sourceUrl: getSourceUrl()
    })

    await navigateTo(props.redirectPath)
  } catch (error) {
    if (isPortalApiConfigurationError(error)) {
      console.error(error)
    }

    statusMessage.value = getWebinarRegistrationErrorMessage(error)
  } finally {
    submitting.value = false
  }
}
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

      <button
        class="watch-webinar-form__submit"
        type="submit"
        :disabled="submitting"
      >
        <span>{{ submitting ? 'Submitting...' : 'Watch Now' }}</span>
        <span
          class="watch-webinar-form__submit-icon"
          aria-hidden="true"
        >
          &rarr;
        </span>
      </button>

      <p
        v-if="statusMessage"
        class="watch-webinar-form__status"
        role="status"
        aria-live="polite"
      >
        {{ statusMessage }}
      </p>
    </form>

    <p class="watch-webinar-form__contact">
      Looking for other information?
      <NuxtLink to="/contact">
        Get in touch.
      </NuxtLink>
    </p>
  </section>
</template>
