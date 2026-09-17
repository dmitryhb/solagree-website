/** Public catalogue metadata; recording destinations are never part of this contract. */
export interface WebinarCatalogItem {
  id: string
  title: string
  description: string
  host: string
  startsAt: string | null
  timeZone: string | null
  format: 'live' | 'on_demand'
  audience: 'public'
  state: 'upcoming' | 'live' | 'recording_coming_soon' | 'on_demand'
}

/** Expiring Portal access route returned after lead capture. */
export interface WebinarAccessResponse {
  ok: true
  accessPath: string
  expiresAt: string
}
