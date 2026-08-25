/**
 * Generic label/value option used by application and contact forms.
 */
export interface SelectOption<TValue extends string = string> {
  label: string
  value: TValue
}

/**
 * User-facing submission failure shown below a form. Successful submissions
 * never produce an inline result — their `onSuccess` hook either navigates to
 * a destination page or swaps in the form's own success view — so `success`
 * is not a representable variant.
 */
export interface ApplicationResult {
  kind: 'error'
  title: string
  message: string
}
