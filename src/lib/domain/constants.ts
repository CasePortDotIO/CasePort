/**
 * Shared domain constants for the CasePort backend. Single source of truth for
 * enums used across collections, services, and the price table.
 */

/**
 * Case types. The full personal injury list (decision D3). Personal injury is
 * spelled in full everywhere per Section 14. Values are stable slugs; labels
 * are human facing.
 */
export const CASE_TYPES = [
  { label: 'Motor Vehicle Accident', value: 'motor-vehicle-accident' },
  { label: 'Commercial Trucking Accident', value: 'commercial-trucking-accident' },
  { label: 'Premises Liability (Slip and Fall)', value: 'premises-liability' },
  { label: 'Medical Malpractice', value: 'medical-malpractice' },
  { label: 'Wrongful Death', value: 'wrongful-death' },
  { label: 'Dog Bite and Animal Attack', value: 'dog-bite' },
] as const

export type CaseTypeValue = (typeof CASE_TYPES)[number]['value']

/**
 * Market type (decision D5). Set per market. Launch ships single firm routing
 * only. The multi firm panel type is the W8 deferred seam.
 */
export const MARKET_TYPES = [
  { label: 'Single Firm Exclusive', value: 'single-firm-exclusive' },
  { label: 'Multi Firm Panel (deferred, W8)', value: 'multi-firm-panel' },
] as const

/**
 * Market tier drives the price table premium for competition driven case types
 * (decision D3).
 */
export const MARKET_TIERS = [
  { label: 'Standard', value: 'standard' },
  { label: 'Premium Metro', value: 'premium' },
] as const

/**
 * Jurisdictions for disclosure serving (W6). Launch states plus the states
 * named by the doctrine for attorney advertising and no representation
 * language, plus a general fallback.
 */
export const JURISDICTIONS = [
  { label: 'Virginia', value: 'VA' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Washington DC', value: 'DC' },
  { label: 'Georgia', value: 'GA' },
  { label: 'New York', value: 'NY' },
  { label: 'Florida (deferred, W8)', value: 'FL' },
  { label: 'Texas', value: 'TX' },
  { label: 'General', value: 'general' },
] as const

/**
 * Outcome not retained reason codes, from the prototype contract map. Feed
 * intelligence only, never billing (W4).
 */
export const NOT_RETAINED_REASONS = [
  { label: 'Client Declined', value: 'NR-001' },
  { label: 'Conflict of Interest', value: 'NR-002' },
  { label: 'Outside Practice Area', value: 'NR-003' },
  { label: 'No Liability', value: 'NR-004' },
  { label: 'Insufficient Damages', value: 'NR-005' },
] as const

/**
 * The canonical event type names emitted across the claimant and firm journeys
 * (Sections 6 and 7). The events collection stores these on the append only
 * global log.
 */
export const EVENT_TYPES = [
  'AttributionCaptured',
  'IntakeSubmitted',
  'PhotoUploaded',
  'VisionParsed',
  'VoiceCaptured',
  'VoiceTranscribed',
  'DocumentParsed',
  'EvidenceCoachingShown',
  'PlaybackShown',
  'PlaybackConfirmed',
  'ConsentCaptured',
  'TrustedFormCertified',
  'HIPAATemplateSigned',
  'IntakeValidated',
  'ProtectionPlanGenerated',
  'StatusViewed',
  'GeographicRouteResolved',
  'DossierDelivered',
  'DeliveryHeld',
  'WalletFunded',
  'WalletDebited',
  'LowBalanceAlerted',
  'OutcomeReported',
  'SCPSRecalibrated',
  'SCPSPromoted',
  'SpeedCallbackNotified',
  'FirmResponded',
  'SlaBreached',
  'DecayInterrupt',
  'OutcomeRequested',
] as const

export type EventType = (typeof EVENT_TYPES)[number]
