/** Identifies a bookable Initial Consult path in the website selector. */
export type InitialConsultSelectionId = 'first-available' | 'taj' | 'stacie' | 'jessica' | 'james'

export type InitialConsultMeetingMethod = 'phone' | 'zoom'
export type InitialConsultMeetingMethodMode = 'mixed' | 'separate'

/** Public runtime values used to configure Cal.com Initial Consult event paths. */
export interface InitialConsultBookingRuntimeConfig {
  meetingMethodMode?: unknown
  unpublishedConsultants?: unknown
  firstAvailableEventPath?: unknown
  tajEventPath?: unknown
  stacieEventPath?: unknown
  jessicaEventPath?: unknown
  jamesEventPath?: unknown
  firstAvailablePhoneEventPath?: unknown
  tajPhoneEventPath?: unknown
  staciePhoneEventPath?: unknown
  jessicaPhoneEventPath?: unknown
  jamesPhoneEventPath?: unknown
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
  /** Existing mixed route, or the Zoom route when separate mode is enabled. */
  eventPath: string
  /** Required for every published option in separate mode. */
  phoneEventPath?: string
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
  phoneConfigKey: keyof InitialConsultBookingRuntimeConfig
}

const initialConsultEventDefinitions = [
  { id: 'first-available', label: 'First Available', configKey: 'firstAvailableEventPath', phoneConfigKey: 'firstAvailablePhoneEventPath' },
  { id: 'taj', label: 'Taj Johnson Chiu', configKey: 'tajEventPath', phoneConfigKey: 'tajPhoneEventPath' },
  { id: 'stacie', label: 'Stacie Sanders', configKey: 'stacieEventPath', phoneConfigKey: 'staciePhoneEventPath' },
  { id: 'james', label: 'James Traub', configKey: 'jamesEventPath', phoneConfigKey: 'jamesPhoneEventPath' },
  { id: 'jessica', label: 'Jessica Urash', configKey: 'jessicaEventPath', phoneConfigKey: 'jessicaPhoneEventPath' }
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
    bio: 'Former family law paralegal turned client advocate – 15+ years guiding clients through the legal and emotional sides of divorce with care.',
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

/** Keeps the current provider flow until separate routing is explicitly enabled. */
export const resolveInitialConsultMeetingMethodMode = (
  config: InitialConsultBookingRuntimeConfig
): InitialConsultMeetingMethodMode | null => {
  const mode = config.meetingMethodMode === undefined ? 'mixed' : config.meetingMethodMode
  return mode === 'mixed' || mode === 'separate' ? mode : null
}

/** Resolves one native event after the booker explicitly chooses a meeting method. */
export const resolveInitialConsultBookingMethodEvent = (
  event: InitialConsultBookingEvent,
  method: InitialConsultMeetingMethod | null
): InitialConsultBookingEvent | null => {
  if (!method) return null
  if (method === 'zoom') return event
  return event.phoneEventPath ? { ...event, eventPath: event.phoneEventPath } : null
}

/**
 * Resolves all event paths from public runtime configuration.
 * Unpublished consultants keep their content but are excluded before event validation.
 * Returns an empty list when any published event is missing or malformed.
 */
export const resolveInitialConsultBookingEvents = (
  config: InitialConsultBookingRuntimeConfig
): InitialConsultBookingEvent[] => {
  const meetingMethodMode = resolveInitialConsultMeetingMethodMode(config)
  if (!meetingMethodMode) return []

  const unpublishedValue = config.unpublishedConsultants ?? 'jessica'
  if (typeof unpublishedValue !== 'string') return []

  const unpublished = unpublishedValue.split(',').map(id => id.trim()).filter(Boolean)
  if (unpublished.some(id => !initialConsultEventDefinitions.some(
    definition => definition.id !== 'first-available' && definition.id === id
  ))) return []

  const publishedDefinitions = initialConsultEventDefinitions.filter(definition => !unpublished.includes(definition.id))
  if (publishedDefinitions.length === 1) return []

  const events = publishedDefinitions.map((definition): InitialConsultBookingEvent | null => {
    const eventPath = normalizeInitialConsultEventPath(config[definition.configKey])
    const phoneEventPath = meetingMethodMode === 'separate'
      ? normalizeInitialConsultEventPath(config[definition.phoneConfigKey])
      : null
    const profile = initialConsultantProfileContent[definition.id]

    if (!eventPath || (meetingMethodMode === 'separate' && !phoneEventPath)) {
      return null
    }

    return {
      id: definition.id,
      label: definition.label,
      eventPath,
      ...(phoneEventPath ? { phoneEventPath } : {}),
      ...(profile ? { profile } : {})
    }
  })

  if (events.some((event) => event === null)) {
    return []
  }

  const validEvents = events.filter((event): event is InitialConsultBookingEvent => event !== null)
  if (meetingMethodMode === 'separate') {
    const paths = validEvents.flatMap(event => [event.eventPath, event.phoneEventPath!].map(path => path.toLowerCase()))
    if (new Set(paths).size !== paths.length) return []
  }

  return validEvents
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
