/**
 * Generic label/value option used by application and contact forms.
 */
export interface SelectOption<TValue extends string = string> {
  label: string
  value: TValue
}

/**
 * User-facing application submission status shown below a form.
 */
export interface ApplicationResult {
  kind: 'success' | 'error'
  title: string
  message: string
}
