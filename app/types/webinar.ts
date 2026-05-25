export interface WebinarFeature {
  label: string
}

export interface WebinarPresenter {
  imageSrc: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  name: string
  title: string
  captionSeparator?: string
  titleLineBreak?: boolean
}

export interface WebinarRegistrationContent {
  title: string
  summaryLabel: string
  summary: string
  features: readonly WebinarFeature[]
  presenter: WebinarPresenter
  formSubtitle: string
  formRedirectPath: string
  submissionType: 'attorney_webinar' | 'cdfa_webinar'
}

export interface WebinarFormState {
  businessEmail: string
  firstName: string
  lastName: string
  companyName: string
  state: string
}
