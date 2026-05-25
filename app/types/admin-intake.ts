/**
 * Form state held by the admin intake form component.
 */
export interface AdminIntakeFormState {
  /** Primary party first name. */
  primaryFirstName: string
  /** Primary party last name. */
  primaryLastName: string
  /** Primary party email address. */
  primaryEmail: string
  /** Spouse / other party first name. */
  spouseFirstName: string
  /** Spouse / other party last name. */
  spouseLastName: string
  /** Spouse / other party email address. */
  spouseEmail: string
  /**
   * Privacy preference controlling whether the spouse is contacted immediately.
   *
   * - `'hold'` — do not contact spouse yet.
   * - `'open'` — spouse may be included in emails.
   */
  privacyPreference: 'hold' | 'open'
}

/**
 * Static copy and configuration passed to the admin intake page component.
 */
export interface AdminIntakePageContent {
  /** Short eyebrow label displayed above the heading. */
  eyebrow: string
  /** Primary heading rendered as `<h1>`. */
  title: string
  /** Supporting paragraph rendered beneath the heading. */
  description: string
  /** Route path to navigate to on successful submission. */
  thankYouPath: string
}

/**
 * JSON payload sent to `POST /api/public/admin-intakes/:slug`.
 * All field names must match the portal contract exactly.
 */
export interface AdminIntakeSubmissionPayload {
  primaryFirstName: string
  primaryLastName: string
  primaryEmail: string
  spouseFirstName: string
  spouseLastName: string
  spouseEmail: string
  privacyPreference: 'hold' | 'open'
  /** Source URL captured from `window.location.href` (hash stripped). */
  sourceUrl?: string | null
}

/**
 * Inline result displayed below the form when a submission error occurs.
 * Mirrors `ConsultRequestResult`.
 */
export interface AdminIntakeResult {
  /** Short, user-facing error heading. */
  title: string
  /** Detailed error message. */
  message: string
}
