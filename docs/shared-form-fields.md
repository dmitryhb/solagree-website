# Shared form field contract

The public forms use neutral controls for common browser behavior while each form keeps its own data model, payload builder, result state, and domain-specific validation.

## Components

- `ApplicationTextField` forwards native input and textarea attributes. Its bounded variants (`default`, `contact`, `webinar`, and `co-branded`) reproduce the layouts already used by those forms.
- `ApplicationSelectField` forwards select attributes and supports disabled domain options. Its placeholder can be disabled for required selects or enabled when an empty value is a valid choice.
- `FormCheckboxGroup` provides the repeated accessible fieldset, hint, error, and checkbox wiring. Attorney bar states and CDFA specializations still own their labels, options, and validation rules.
- `FormCheckboxField` provides the simple required terms checkbox used by partner applications.

The neutral class contract lives in `_form-controls.scss`. Shared controls must not depend on attorney, CDFA, consult, contact, webinar, admin, or co-branded selectors.

## Validation and submission

`validateNativeForm` centralizes the repeated `checkValidity()` and `reportValidity()` sequence. Attorney and CDFA composables add their own checkbox and license rules after native validation and keep the first invalid control focus behavior.

`usePortalFormSubmissionOptions` centralizes the portal base URL and website fetch adapter. The seven form components and composables still call their existing submission service, build the same payload, send to the same destination, and retain their own success, error, analytics, busy, and reset behavior.
