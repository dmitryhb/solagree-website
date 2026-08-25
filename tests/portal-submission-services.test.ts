import { describe, expect, it } from 'vitest'

import {
  getAdminIntakeSubmissionErrorMessage,
  submitAdminIntake
} from '../app/services/admin-intake-api'
import {
  getAttorneyApplicationSubmissionErrorMessage,
  submitAttorneyApplication
} from '../app/services/attorney-application-api'
import {
  getCdfaApplicationSubmissionErrorMessage,
  submitCdfaApplication
} from '../app/services/cdfa-application-api'
import {
  getConsultRequestSubmissionErrorMessage,
  submitCoBrandedConsultRequest,
  submitConsultRequest
} from '../app/services/consult-request-api'
import {
  getContactSubmissionErrorMessage,
  submitContactSubmission
} from '../app/services/contact-submission-api'
import {
  getWebinarRegistrationErrorMessage,
  submitWebinarRegistration
} from '../app/services/webinar-registration-api'
import { isPortalApiConfigurationError } from '../app/services/portal-api'
import type { AdminIntakeFormState } from '../app/types/admin-intake'
import type { AttorneyApplicationFormState } from '../app/types/attorney-application'
import type { CdfaApplicationFormState } from '../app/types/cdfa-application'
import type {
  CoBrandedConsultRequestFormState,
  ConsultRequestFormState
} from '../app/types/consult-request'
import type { ContactFormState } from '../app/types/contact'
import type { WebinarFormState } from '../app/types/webinar'

const PORTAL_BASE_URL = 'https://portal.solagree.test'

type RecordingFetcher = <TResponse>(
  request: string,
  options: { method: 'POST', body: unknown }
) => Promise<TResponse>

interface RecordedCall {
  request: string
  method: string
  body: unknown
}

const createRecordingFetcher = (respond: () => unknown): {
  fetcher: RecordingFetcher
  calls: RecordedCall[]
} => {
  const calls: RecordedCall[] = []

  const fetcher = async <TResponse>(
    request: string,
    options: { method: 'POST', body: unknown }
  ): Promise<TResponse> => {
    calls.push({ request, method: options.method, body: options.body })

    return respond() as TResponse
  }

  return { fetcher, calls }
}

const catchSubmissionError = async (submit: () => Promise<unknown>): Promise<unknown> => {
  try {
    await submit()
  } catch (error) {
    return error
  }

  throw new Error('Expected the submission to reject.')
}

const asError = (error: unknown): Error => {
  expect(error).toBeInstanceOf(Error)

  return error as Error
}

interface MalformedSuccessResponse {
  label: string
  response: unknown
}

interface ServiceEntry {
  name: string
  submit: (fetcher: RecordingFetcher, portalApiBaseUrl?: string) => Promise<unknown>
  endpoint: string
  expectedPayload: unknown
  successResponse: unknown
  expectedSuccessValue: unknown
  malformedSuccessResponses: MalformedSuccessResponse[]
  fallbackMessage: string
  getErrorMessage: (error: unknown) => string
}

const adminIntakeForm: AdminIntakeFormState = {
  primaryFirstName: ' Jamie ',
  primaryLastName: 'Rivera',
  primaryEmail: ' jamie@example.test ',
  spouseFirstName: 'Taylor',
  spouseLastName: ' Parker ',
  spouseEmail: 'taylor@example.test',
  privacyPreference: 'hold'
}

const attorneyForm: AttorneyApplicationFormState = {
  name: 'Jordan Lee',
  company: 'Lee Mediation',
  email: 'jordan@example.test',
  phone: '1-415-555-1234',
  smsOptIn: true,
  address: '500 Market St, San Francisco, CA',
  barStates: ['CA', 'NY'],
  licenseNumbers: [' 12345 ', '67890'],
  initialLicensureYear: '2010',
  goodStanding: 'yes',
  disciplinaryFinding: 'no',
  disciplinaryExplanation: '',
  mediationExperience: 'practice',
  neutralInterest: 'yes',
  adrNetworks: 'APR',
  consultationInterest: 'yes',
  termsAccepted: true
}

const cdfaForm: CdfaApplicationFormState = {
  name: 'Avery Chen',
  company: 'Chen Financial',
  email: 'avery@example.test',
  phone: '1-415-555-2345',
  smsOptIn: false,
  address: '88 Elm St, Denver, CO',
  certificationStatus: 'active_cdfa',
  certificationNumber: 'CDFA-9911',
  clientExperience: '3_to_5_years',
  serviceArea: 'Colorado Front Range',
  specializations: ['asset_debt_inventory', 'retirement_qdros'],
  adrNetworks: 'APR',
  clientSource: 'referrals',
  consultationInterest: 'yes',
  termsAccepted: true
}

const consultForm: ConsultRequestFormState = {
  fullName: ' Casey Smith ',
  email: ' casey@example.test ',
  phone: ' 415-555-3456 ',
  smsOptIn: false,
  state: ' CA ',
  preferredContactMethod: 'email',
  bestTimeOfDay: 'morning'
}

const coBrandedForm: CoBrandedConsultRequestFormState = {
  firstName: ' Jamie ',
  lastName: ' Parker ',
  email: ' jamie@example.test ',
  phone: ' 415-555-1234 ',
  smsOptIn: true,
  preferredContactMethod: 'phone',
  spouseFirstName: ' Taylor ',
  spouseLastName: ' Parker '
}

const contactForm: ContactFormState = {
  name: ' Sam Doe ',
  email: ' sam@example.test ',
  phone: ' 415-555-4567 ',
  smsOptIn: true,
  message: ' Hello, I need help with my divorce finances. '
}

const webinarForm: WebinarFormState = {
  businessEmail: ' dana@example.test ',
  firstName: ' Dana ',
  lastName: ' White ',
  companyName: ' White Law ',
  state: ' NY '
}

const serviceEntries: ServiceEntry[] = [
  {
    name: 'submitAdminIntake',
    submit: (fetcher, portalApiBaseUrl = PORTAL_BASE_URL) => submitAdminIntake(
      adminIntakeForm,
      'rivera-mediation',
      {
        portalApiBaseUrl,
        fetcher,
        sourceUrl: 'https://www.solagree.com/meet/rivera-mediation'
      }
    ),
    endpoint: '/api/public/admin-intakes/rivera-mediation',
    expectedPayload: {
      primaryFirstName: 'Jamie',
      primaryLastName: 'Rivera',
      primaryEmail: 'jamie@example.test',
      spouseFirstName: 'Taylor',
      spouseLastName: 'Parker',
      spouseEmail: 'taylor@example.test',
      privacyPreference: 'hold',
      sourceUrl: 'https://www.solagree.com/meet/rivera-mediation'
    },
    successResponse: { ok: true, submissionId: 'intake_123' },
    expectedSuccessValue: { submissionId: 'intake_123' },
    malformedSuccessResponses: [
      { label: 'non-string submissionId', response: { ok: true, submissionId: 12345 } },
      { label: 'empty submissionId string', response: { ok: true, submissionId: '' } }
    ],
    fallbackMessage: 'We could not submit your intake form. Please try again.',
    getErrorMessage: getAdminIntakeSubmissionErrorMessage
  },
  {
    name: 'submitAttorneyApplication',
    submit: (fetcher, portalApiBaseUrl = PORTAL_BASE_URL) => submitAttorneyApplication(attorneyForm, {
      portalApiBaseUrl,
      fetcher
    }),
    endpoint: '/api/attorney-applications',
    expectedPayload: {
      name: 'Jordan Lee',
      company: 'Lee Mediation',
      email: 'jordan@example.test',
      phone: '1-415-555-1234',
      smsOptIn: true,
      address: '500 Market St, San Francisco, CA',
      barStates: ['CA', 'NY'],
      licenseNumbers: ['12345', '67890'],
      initialLicensureYear: '2010',
      goodStanding: 'yes',
      disciplinaryFinding: 'no',
      disciplinaryExplanation: '',
      mediationExperience: 'practice',
      neutralInterest: 'yes',
      adrNetworks: 'APR',
      consultationInterest: 'yes',
      termsAccepted: true
    },
    successResponse: { applicationId: 'attorney_123', status: 'pending' },
    expectedSuccessValue: { applicationId: 'attorney_123', status: 'pending' },
    malformedSuccessResponses: [
      { label: 'non-string applicationId', response: { applicationId: 12345, status: 'pending' } },
      { label: 'empty applicationId string', response: { applicationId: '', status: 'pending' } },
      { label: 'missing applicationId', response: { status: 'pending' } }
    ],
    fallbackMessage: 'We could not submit your application. Please try again.',
    getErrorMessage: getAttorneyApplicationSubmissionErrorMessage
  },
  {
    name: 'submitCdfaApplication',
    submit: (fetcher, portalApiBaseUrl = PORTAL_BASE_URL) => submitCdfaApplication(cdfaForm, {
      portalApiBaseUrl,
      fetcher
    }),
    endpoint: '/api/cdfa-applications',
    expectedPayload: {
      name: 'Avery Chen',
      company: 'Chen Financial',
      email: 'avery@example.test',
      phone: '1-415-555-2345',
      smsOptIn: false,
      address: '88 Elm St, Denver, CO',
      certificationStatus: 'active_cdfa',
      certificationNumber: 'CDFA-9911',
      clientExperience: '3_to_5_years',
      serviceArea: 'Colorado Front Range',
      specializations: ['asset_debt_inventory', 'retirement_qdros'],
      adrNetworks: 'APR',
      clientSource: 'referrals',
      consultationInterest: 'yes',
      termsAccepted: true
    },
    successResponse: { applicationId: 'cdfa_123', status: 'pending' },
    expectedSuccessValue: { applicationId: 'cdfa_123', status: 'pending' },
    malformedSuccessResponses: [
      { label: 'non-string applicationId', response: { applicationId: 12345, status: 'pending' } },
      { label: 'empty applicationId string', response: { applicationId: '', status: 'pending' } },
      { label: 'missing applicationId', response: { status: 'pending' } }
    ],
    fallbackMessage: 'We could not submit your application. Please try again.',
    getErrorMessage: getCdfaApplicationSubmissionErrorMessage
  },
  {
    name: 'submitConsultRequest',
    submit: (fetcher, portalApiBaseUrl = PORTAL_BASE_URL) => submitConsultRequest(consultForm, {
      portalApiBaseUrl,
      fetcher,
      consultType: 'initial',
      referralCode: ' rivera-mediation ',
      sourceUrl: 'https://www.solagree.com/quiz'
    }),
    endpoint: '/api/consult-requests',
    expectedPayload: {
      fullName: 'Casey Smith',
      email: 'casey@example.test',
      phone: '415-555-3456',
      smsOptIn: false,
      state: 'CA',
      preferredContactMethod: 'email',
      bestTimeOfDay: 'morning',
      consultType: 'initial',
      referralCode: 'rivera-mediation',
      sourceUrl: 'https://www.solagree.com/quiz',
      quizAnswers: []
    },
    successResponse: { ok: true, requestId: 'req_123' },
    expectedSuccessValue: { ok: true, requestId: 'req_123' },
    malformedSuccessResponses: [
      { label: 'non-string requestId', response: { ok: true, requestId: 12345 } },
      { label: 'empty requestId string', response: { ok: true, requestId: '' } },
      { label: 'missing requestId', response: { ok: true } }
    ],
    fallbackMessage: 'We could not submit your consult request. Please try again.',
    getErrorMessage: getConsultRequestSubmissionErrorMessage
  },
  {
    name: 'submitCoBrandedConsultRequest',
    submit: (fetcher, portalApiBaseUrl = PORTAL_BASE_URL) => submitCoBrandedConsultRequest(coBrandedForm, {
      portalApiBaseUrl,
      fetcher,
      pageType: 'standard',
      referralCode: ' rivera-mediation ',
      sourceUrl: 'https://www.solagree.com/go/rivera-mediation'
    }),
    endpoint: '/api/consult-requests',
    expectedPayload: {
      firstName: 'Jamie',
      lastName: 'Parker',
      spouseFirstName: 'Taylor',
      spouseLastName: 'Parker',
      email: 'jamie@example.test',
      phone: '415-555-1234',
      smsOptIn: true,
      preferredContactMethod: 'phone',
      consultType: 'initial',
      coBrandedPageType: 'standard',
      referralCode: 'rivera-mediation',
      sourceUrl: 'https://www.solagree.com/go/rivera-mediation',
      quizAnswers: []
    },
    successResponse: { ok: true, requestId: 'req_cobranded_123' },
    expectedSuccessValue: { ok: true, requestId: 'req_cobranded_123' },
    malformedSuccessResponses: [
      { label: 'non-string requestId', response: { ok: true, requestId: 12345 } },
      { label: 'empty requestId string', response: { ok: true, requestId: '' } },
      { label: 'missing requestId', response: { ok: true } }
    ],
    fallbackMessage: 'We could not submit your consult request. Please try again.',
    getErrorMessage: getConsultRequestSubmissionErrorMessage
  },
  {
    name: 'submitContactSubmission',
    submit: (fetcher, portalApiBaseUrl = PORTAL_BASE_URL) => submitContactSubmission(contactForm, {
      portalApiBaseUrl,
      fetcher,
      sourceUrl: 'https://www.solagree.com/contact'
    }),
    endpoint: '/api/contact-submissions',
    expectedPayload: {
      name: 'Sam Doe',
      email: 'sam@example.test',
      message: 'Hello, I need help with my divorce finances.',
      phone: '415-555-4567',
      smsOptIn: true,
      sourceUrl: 'https://www.solagree.com/contact'
    },
    successResponse: { ok: true, submissionId: 'contact_123' },
    expectedSuccessValue: { ok: true, submissionId: 'contact_123' },
    malformedSuccessResponses: [
      { label: 'non-string submissionId', response: { ok: true, submissionId: 12345 } },
      { label: 'empty submissionId string', response: { ok: true, submissionId: '' } },
      { label: 'missing submissionId', response: { ok: true } }
    ],
    fallbackMessage: 'We could not submit your message. Please try again.',
    getErrorMessage: getContactSubmissionErrorMessage
  },
  {
    name: 'submitWebinarRegistration',
    submit: (fetcher, portalApiBaseUrl = PORTAL_BASE_URL) => submitWebinarRegistration(webinarForm, {
      portalApiBaseUrl,
      fetcher,
      submissionType: 'attorney_webinar',
      sourceUrl: 'https://www.solagree.com/webinars/attorney'
    }),
    endpoint: '/api/contact-submissions',
    expectedPayload: {
      submissionType: 'attorney_webinar',
      businessEmail: 'dana@example.test',
      firstName: 'Dana',
      lastName: 'White',
      companyName: 'White Law',
      state: 'NY',
      sourceUrl: 'https://www.solagree.com/webinars/attorney'
    },
    successResponse: { ok: true, submissionId: 'webinar_123' },
    expectedSuccessValue: { ok: true, submissionId: 'webinar_123' },
    malformedSuccessResponses: [
      { label: 'non-string submissionId', response: { ok: true, submissionId: 12345 } },
      { label: 'empty submissionId string', response: { ok: true, submissionId: '' } },
      { label: 'missing submissionId', response: { ok: true } }
    ],
    fallbackMessage: 'We could not register you for the webinar. Please try again.',
    getErrorMessage: getWebinarRegistrationErrorMessage
  }
]

const createRejectionCases = (entry: ServiceEntry): Array<[string, unknown]> => ([
  ['an explicit portal error response without a message', { error: true }],
  ['an explicit portal error response with an empty message', { error: true, message: '' }],
  ['a null response', null],
  ['a string response', 'submitted'],
  ['a number response', 200],
  ['an empty object response', {}],
  ...entry.malformedSuccessResponses.map(
    (malformed): [string, unknown] => [`a malformed success response (${malformed.label})`, malformed.response]
  )
])

const nuxtFetchError = Object.assign(
  new Error('[POST] "https://portal.solagree.test/api/consult-requests": 503 Service Unavailable'),
  {
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    data: { message: 'Portal temporarily unavailable.' }
  }
)

for (const entry of serviceEntries) {
  describe(entry.name, () => {
    it('resolves the validated success value and preserves the POST endpoint and payload', async () => {
      const { fetcher, calls } = createRecordingFetcher(
        () => ({ ...(entry.successResponse as Record<string, unknown>) })
      )

      const result = await entry.submit(fetcher)

      expect(result).toStrictEqual(entry.expectedSuccessValue)
      expect(calls).toHaveLength(1)
      expect(calls[0]?.request).toBe(`${PORTAL_BASE_URL}${entry.endpoint}`)
      expect(calls[0]?.method).toBe('POST')
      expect(calls[0]?.body).toStrictEqual(entry.expectedPayload)
    })

    it('strips trailing slashes from the portal base URL', async () => {
      const { fetcher, calls } = createRecordingFetcher(
        () => ({ ...(entry.successResponse as Record<string, unknown>) })
      )

      await entry.submit(fetcher, `${PORTAL_BASE_URL}/`)

      expect(calls[0]?.request).toBe(`${PORTAL_BASE_URL}${entry.endpoint}`)
    })

    it('surfaces the portal-provided safe error message', async () => {
      const { fetcher } = createRecordingFetcher(() => ({
        error: true,
        message: 'This submission link is no longer active.'
      }))

      const error = asError(await catchSubmissionError(() => entry.submit(fetcher)))

      expect(error.message).toBe('This submission link is no longer active.')
      expect(entry.getErrorMessage(error)).toBe('This submission link is no longer active.')
    })

    it.each(createRejectionCases(entry))(
      'falls back to the user-safe message for %s',
      async (_label, response) => {
        const { fetcher } = createRecordingFetcher(() => response)

        const error = asError(await catchSubmissionError(() => entry.submit(fetcher)))

        expect(error.message).toBe(entry.fallbackMessage)
        expect(error.message).not.toContain("Cannot use 'in' operator")
        expect(entry.getErrorMessage(error)).toBe(entry.fallbackMessage)
        expect(entry.getErrorMessage(error)).not.toContain("Cannot use 'in' operator")
      }
    )

    it('propagates fetch errors so their data.message reaches the user', async () => {
      const { fetcher } = createRecordingFetcher(() => {
        throw nuxtFetchError
      })

      const error = await catchSubmissionError(() => entry.submit(fetcher))

      expect(error).toBe(nuxtFetchError)
      expect(entry.getErrorMessage(error)).toBe('Portal temporarily unavailable.')
    })

    it.each([['an empty string', ''], ['whitespace', '   ']])(
      'throws a configuration error for %s portal base URL without exposing configuration text',
      async (_label, portalApiBaseUrl) => {
        const { fetcher } = createRecordingFetcher(() => ({ ...(entry.successResponse as Record<string, unknown>) }))

        const error = await catchSubmissionError(() => entry.submit(fetcher, portalApiBaseUrl))

        expect(isPortalApiConfigurationError(error)).toBe(true)
        expect(entry.getErrorMessage(error)).toBe(entry.fallbackMessage)
        expect(entry.getErrorMessage(error)).not.toContain('NUXT_PUBLIC_PORTAL_API_BASE_URL')
      }
    )
  })
}

describe('submitAdminIntake slug handling', () => {
  it('encodes the intake slug in the endpoint path', async () => {
    const { fetcher, calls } = createRecordingFetcher(() => ({ ok: true, submissionId: 'intake_123' }))

    await submitAdminIntake(adminIntakeForm, 'rivera & partners', {
      portalApiBaseUrl: PORTAL_BASE_URL,
      fetcher
    })

    expect(calls[0]?.request).toBe(`${PORTAL_BASE_URL}/api/public/admin-intakes/rivera%20%26%20partners`)
  })
})
