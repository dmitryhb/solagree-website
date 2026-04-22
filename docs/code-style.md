# Code Style

These conventions apply to Vue components, composables, utilities, service modules, data modules, and server route helpers.

## Arrow Functions

Use arrow-function constants instead of regular function declarations.

Preferred:

```ts
export const normalizePortalApiBaseUrl = (portalApiBaseUrl: string): string => {
  return String(portalApiBaseUrl || '').replace(/\/+$/, '')
}
```

Avoid:

Do not use regular function declarations for helpers, handlers, composables, or service methods.

Inside Vue `<script setup>`, declare handlers the same way:

```ts
const handleSubmit = async () => {
  // ...
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
```

The main benefit is consistency: exported helpers, local helpers, and component handlers all read the same way and do not rely on hoisting.

## Ordering

Because arrow-function constants are not hoisted, define helpers before the code that calls them during module initialization.

It is safe for one helper to reference another helper declared later when the reference only runs after the module has finished evaluating, but prefer top-down ordering when practical.

## TSDoc

Add TSDoc to exported functions, exported interfaces, and exported type aliases when they are intended for reuse.

Preferred:

```ts
/**
 * Creates the API payload from form state and trims repeatable license fields.
 */
export const createAttorneyApplicationSubmissionPayload = (
  form: AttorneyApplicationFormState
): AttorneyApplicationSubmissionPayload => {
  return {
    ...form,
    licenseNumbers: form.licenseNumbers.map((licenseNumber) => licenseNumber.trim())
  }
}
```

Keep TSDoc concise and focused on what a caller needs to know:

- what the helper returns
- what the helper normalizes or transforms
- what dependencies/options are expected
- what errors can be thrown

Do not add comments that restate the implementation line by line.

## Component Handlers

Component event handlers do not need TSDoc unless they are exported or contain non-obvious behavior.

Preferred:

```ts
const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', {
    value: props.value,
    checked: target.checked
  })
}
```

## Type Annotations

Add explicit return types to exported arrow functions when the return type is part of the module contract.

Local component handlers can rely on inference unless explicit typing improves readability.
