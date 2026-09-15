import { nextTick } from 'vue'

type NativeFormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export const validateNativeForm = (form: HTMLFormElement | null): boolean => {
  if (!form) {
    return false
  }

  if (form.checkValidity()) {
    return true
  }

  form.reportValidity()
  return false
}

export const focusFirstNativeInvalidControl = async (form: HTMLFormElement | null): Promise<void> => {
  await nextTick()

  const controls = form?.querySelectorAll<NativeFormControl>('input, select, textarea')
  const firstInvalidControl = controls && Array.from(controls).find(control => !control.validity.valid)

  firstInvalidControl?.focus()
}
