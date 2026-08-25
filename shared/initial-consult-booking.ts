/** Identifies a bookable Initial Consult path in the website selector. */
export type InitialConsultSelectionId = 'first-available' | 'taj' | 'stacie' | 'jessica' | 'james'

/** Public runtime values used to configure Cal.com Initial Consult event paths. */
export interface InitialConsultBookingRuntimeConfig {
  firstAvailableEventPath?: unknown
  tajEventPath?: unknown
  stacieEventPath?: unknown
  jessicaEventPath?: unknown
  jamesEventPath?: unknown
}

/** Optional client-approved consultant content. Empty fields deliberately render as neutral cards. */
export interface ConsultantProfileContent {
  role?: string
  bio?: string
  headshotUrl?: string
}

/** A configured event and the content that may be shown for it. */
export interface InitialConsultBookingEvent {
  id: InitialConsultSelectionId
  label: string
  eventPath: string
  profile?: ConsultantProfileContent
}

/** Safe marketing context accepted from the website URL by the Cal.com embed. */
export type InitialConsultBookingTrackingContext = Partial<Record<
  'ref' | 'source' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content',
  string
>>

type InitialConsultEventDefinition = {
  id: InitialConsultSelectionId
  label: string
  configKey: keyof InitialConsultBookingRuntimeConfig
}

const initialConsultEventDefinitions = [
  { id: 'first-available', label: 'First Available', configKey: 'firstAvailableEventPath' },
  { id: 'taj', label: 'Taj Johnson Chiu', configKey: 'tajEventPath' },
  { id: 'stacie', label: 'Stacie Sanders', configKey: 'stacieEventPath' },
  { id: 'jessica', label: 'Jessica Urash', configKey: 'jessicaEventPath' },
  { id: 'james', label: 'James Traub', configKey: 'jamesEventPath' }
] as const satisfies readonly InitialConsultEventDefinition[]

/**
 * Client-approved biographies and headshots shown in the Initial Consult selector.
 * First Available intentionally remains neutral because it represents the whole team.
 */
export const initialConsultantProfileContent: Partial<Record<InitialConsultSelectionId, ConsultantProfileContent>> = {
  taj: {
    bio: 'Mediator, divorce & financial coach specializing in neurodivergent and special-needs families. LGBTQ+ affirming, judgment-free, money-savvy support.',
    headshotUrl: '/images/initial-consult-taj-johnson-chiu.webp'
  },
  stacie: {
    bio: 'Former family law paralegal turned client advocate—15+ years guiding clients through the legal and emotional sides of divorce with care.',
    headshotUrl: '/images/initial-consult-stacie-sanders.webp'
  },
  jessica: {
    bio: 'Faith-rooted divorce coach offering trauma-informed, compassionate support for emotional healing and healthy co-parenting through separation.',
    headshotUrl: '/images/initial-consult-jessica-urash.webp'
  },
  james: {
    bio: "Certified Divorce Coach & Kids-First Mediator helping parents avoid court conflict with calm, structured guidance focused on kids' wellbeing.",
    headshotUrl: '/images/initial-consult-james-traub.webp'
  }
}

const safeTrackingKeys = new Set([
  'ref',
  'source',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content'
])

const eventPathPattern = /^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)+$/i
const trackingValuePattern = /^[a-z0-9][a-z0-9._~-]*$/i
const maxTrackingValueLength = 120

/**
 * Validates an event path for Cal.com's embed `calLink` parameter.
 * URLs, query strings, and fragments are intentionally rejected.
 */
export const normalizeInitialConsultEventPath = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const eventPath = value.trim()

  return eventPathPattern.test(eventPath) ? eventPath : null
}

/**
 * Resolves all event paths from public runtime configuration.
 * Returns an empty list when any required event is missing or malformed so the page cannot offer a partial flow.
 */
export const resolveInitialConsultBookingEvents = (
  config: InitialConsultBookingRuntimeConfig
): InitialConsultBookingEvent[] => {
  const events = initialConsultEventDefinitions.map((definition): InitialConsultBookingEvent | null => {
    const eventPath = normalizeInitialConsultEventPath(config[definition.configKey])
    const profile = initialConsultantProfileContent[definition.id]

    if (!eventPath) {
      return null
    }

    return profile
      ? { id: definition.id, label: definition.label, eventPath, profile }
      : { id: definition.id, label: definition.label, eventPath }
  })

  if (events.some((event) => event === null)) {
    return []
  }

  return events.filter((event): event is InitialConsultBookingEvent => event !== null)
}

/** Returns the event associated with a selector choice, or null when configuration is incomplete. */
export const resolveInitialConsultBookingEvent = (
  events: readonly InitialConsultBookingEvent[],
  selectionId: InitialConsultSelectionId
): InitialConsultBookingEvent | null => {
  return events.find(event => event.id === selectionId) ?? null
}

/**
 * Allows only compact marketing identifiers into the Cal.com embed.
 * It ignores repeated values, empty values, arbitrary query keys, and values that could contain PII.
 */
export const getInitialConsultBookingTrackingContext = (
  query: Readonly<Record<string, string | null | readonly (string | null)[] | undefined>>
): InitialConsultBookingTrackingContext => {
  return Object.fromEntries(
    Object.entries(query).flatMap(([key, value]) => {
      if (!safeTrackingKeys.has(key) || typeof value !== 'string') {
        return []
      }

      const normalizedValue = value?.trim() ?? ''

      return normalizedValue.length <= maxTrackingValueLength && trackingValuePattern.test(normalizedValue)
        ? [[key, normalizedValue]]
        : []
    })
  ) as InitialConsultBookingTrackingContext
}
