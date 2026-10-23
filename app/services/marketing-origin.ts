/** Browser-only proof never belongs in links, analytics or provider metadata. */
export interface BrowserMarketingContext { journeyId: string, proof: string }
interface CaptureResponse { context: BrowserMarketingContext, expiresAt: string }
interface PendingSubmission { submissionId: string, context: BrowserMarketingContext }
interface MarketingRuntime {
  capture: () => Promise<BrowserMarketingContext>
  clear: () => void
  storage: Storage
}
let runtime: MarketingRuntime | null = null
/** Installs a single browser runtime; SSR and dependency-injected service tests stay isolated. */
export const installMarketingOriginRuntime = (value: MarketingRuntime): void => { runtime = value }
/** Carries retry identity through failed responses/reloads without matching people or email. */
export const prepareWebsiteMarketingSubmission = async (endpoint: string, payload: unknown): Promise<{ body: unknown, complete: () => void }> => {
  if (!runtime || !['/api/consult-requests', '/api/contact-submissions'].includes(endpoint) || !payload || typeof payload !== 'object') {
    return { body: payload, complete: () => {} }
  }
  const active = runtime
  // A digest avoids putting a second raw form/PII copy into persistent browser storage.
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)))))
    .map(byte => byte.toString(16).padStart(2, '0')).join('')
  const key = `solagree-submission:${endpoint}:${digest}`
  let pending: PendingSubmission | null = null
  try { pending = JSON.parse(active.storage.getItem(key) ?? 'null') as PendingSubmission | null } catch { /* Damaged retry state starts a fresh identity. */ }
  if (!pending || !/^[0-9a-f-]{36}$/i.test(pending.submissionId) || !pending.context?.proof) {
    pending = { submissionId: crypto.randomUUID(), context: await active.capture() }
    active.storage.setItem(key, JSON.stringify(pending))
  }
  return {
    body: { ...payload, marketingContext: pending.context, submissionId: pending.submissionId },
    complete: () => { active.storage.removeItem(key); active.clear() }
  }
}
/** Validates persisted context before sending it to the server for authoritative validation. */
export const parseBrowserMarketingCapture = (raw: string | null): CaptureResponse | null => {
  try {
    const value = JSON.parse(raw ?? 'null') as CaptureResponse | null
    if (!value || !/^[0-9a-f-]{36}$/i.test(value.context?.journeyId) || !/^[a-f0-9]{64}$/.test(value.context?.proof)
      || !Number.isFinite(Date.parse(value.expiresAt))) return null
    return value
  } catch { return null }
}
