/**
 * Generic label/value option used by application and contact forms.
 */
export interface SelectOption<TValue extends string = string> {
  label: string
  value: TValue
}

/**
 * User-facing submission result. Success is a fallback when the accepted
 * request's navigation or presentation hook fails.
 */
export interface ApplicationResult {
  kind: 'error' | 'success'
  title: string
  message: string
}
