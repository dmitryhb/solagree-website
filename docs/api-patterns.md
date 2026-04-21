# API Patterns

Use this pattern when a page or component needs to call an API. The goal is to keep Vue components focused on UI state and validation while API details live in reusable, typed modules.

## Module Location

Put client-side API modules in `app/services`.

Use one module per API domain:

```text
app/services/attorney-application-api.ts
app/services/contact-api.ts
app/services/webinar-api.ts
```

Keep shared TypeScript interfaces in `app/types`. Do not define reusable payload or response types inside Vue components.

## Component Responsibilities

Vue components should own:

- form state
- UI-only validation state
- disabled/loading state
- success/error presentation
- accessibility attributes and live regions

Vue components should not own:

- endpoint path construction
- runtime API URL normalization
- request payload normalization
- `$fetch` response parsing
- API error normalization
- reusable request/response types

## Service Responsibilities

API service modules should own:

- endpoint constants
- request payload builders
- response and error handling
- exported submit/load/update functions
- TSDoc for exported functions and interfaces

Example shape:

```ts
export interface SubmitThingOptions {
  portalApiBaseUrl: string
  fetcher: Fetcher
}

export function createThingPayload(form: ThingFormState): ThingPayload {
  return {
    ...form,
    name: form.name.trim()
  }
}

export async function submitThing(form: ThingFormState, options: SubmitThingOptions) {
  const response = await options.fetcher<ThingApiResponse>(url, {
    method: 'POST',
    body: createThingPayload(form)
  })

  return response
}
```

## Runtime Config

Components may read runtime config, but they should pass config values into services rather than making services call Nuxt composables directly.

Preferred:

```ts
const runtimeConfig = useRuntimeConfig()

await submitAttorneyApplication(form, {
  portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
  fetcher: $fetch
})
```

Avoid:

```ts
export async function submitAttorneyApplication(form: AttorneyApplicationFormState) {
  const runtimeConfig = useRuntimeConfig()
  // ...
}
```

This keeps service modules reusable in tests, composables, server utilities, and future pages.

## Fetcher Injection

Pass `$fetch` into the service instead of importing or assuming it globally. This makes the service easy to reuse and mock.

Use a typed fetcher contract in the service module when the request body shape matters.

## Endpoint Construction

Store endpoint paths as constants inside the service module.

Normalize API base URLs before appending endpoint paths:

```ts
export function normalizePortalApiBaseUrl(portalApiBaseUrl: string) {
  return String(portalApiBaseUrl || '').replace(/\/+$/, '')
}
```

Runtime config should contain the API origin, not the endpoint path. For example:

```text
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://localhost:3001
```

The service appends:

```text
/api/attorney-applications
```

## Payload Normalization

Normalize request payloads in the service module, not in the component submit handler.

Examples:

- trim repeated text fields
- remove empty optional array items if the API expects that
- convert UI-only state into API values
- preserve raw form state in the component

## Error Handling

Expose a reusable error-message helper for each API domain when user-facing errors are needed.

The helper should handle:

- Nuxt `$fetch` errors with `data.message`
- HTTP errors with `statusMessage`
- native `Error`
- fallback copy

Components should only decide where and how to display the message.

## TSDoc

Add TSDoc to exported service interfaces and functions. Keep comments concise and consumer-focused.

Document:

- what payload builders normalize
- what a submit function returns
- what errors a submit function throws
- what dependencies/options the service expects

## Verification

For API service refactors:

- run `npm run build`
- run `git diff --check`
- check that components no longer contain endpoint strings or payload-normalization logic

## Current Example

Use `app/services/attorney-application-api.ts` as the reference implementation for this pattern.
