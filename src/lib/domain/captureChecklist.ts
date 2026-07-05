import type { CaptureDirection, CaptureInventory } from '@/services/ports'

/**
 * The essential capture checklist. A deterministic, ordered list of the captures
 * that make a personal injury dossier defensible: the wide scene, each vehicle's
 * damage, the plates, the surroundings, any visible injury, the insurance card,
 * the police report, and the spoken account.
 *
 * This is the safe, compliant floor beneath the Evidence and Intake Coaching
 * Agent (AGENTS.md Section 4.1). The agent normally decides the next shot with
 * Claude, but when the model has nothing to add, drifts, or is unavailable, the
 * coaching falls back to the next unmet item here. Every direction is purely
 * photographic and factual: it names the shot, never the case. No item evaluates
 * strength, value, fault, or outcome, so the whole list passes the claimant
 * language guard by construction.
 *
 * Personal injury is spelled in full per the doctrine's quality bar.
 */

interface ChecklistItem {
  focus: string
  /** True when the inventory already satisfies this item. */
  met: (inv: CaptureInventory) => boolean
  /** The single procedural direction to satisfy it. Photographic or factual only. */
  direction: string
}

const hasPhoto = (inv: CaptureInventory, kind: string) => inv.photos.some((p) => p.kind === kind)
const hasDocument = (inv: CaptureInventory, kind: string) => inv.documents.some((d) => d.kind === kind)

/** Ordered by what builds the most defensible record first. */
export const CAPTURE_CHECKLIST: ChecklistItem[] = [
  {
    focus: 'wide',
    met: (inv) => hasPhoto(inv, 'wide'),
    direction:
      'Take one wide photo that shows the whole scene: both vehicles, the road, and where they came to rest.',
  },
  {
    focus: 'damage',
    met: (inv) => hasPhoto(inv, 'damage'),
    direction:
      'Move in close and photograph the damage to each vehicle, one clear shot per area of impact.',
  },
  {
    focus: 'plate',
    met: (inv) => hasPhoto(inv, 'plate'),
    direction: 'Photograph the license plate of the other vehicle so the plate numbers are readable.',
  },
  {
    focus: 'scene',
    met: (inv) => hasPhoto(inv, 'scene'),
    direction:
      'Step back and photograph the surroundings: traffic signals, stop signs, lane markings, and the intersection.',
  },
  {
    focus: 'injury',
    met: (inv) => hasPhoto(inv, 'injury'),
    direction:
      'If you have a visible injury and you are comfortable, take a clear, well lit photo of it. Only if you are comfortable.',
  },
  {
    focus: 'insurance-card',
    met: (inv) => hasDocument(inv, 'insurance-card') || inv.insuranceCardParsed,
    direction:
      'Photograph the front of your insurance card so we can read the details for you. You do not need to write anything down.',
  },
  {
    focus: 'police-report',
    met: (inv) => hasDocument(inv, 'police-report'),
    direction:
      'If you have the police report or an exchange of information slip, add a photo of it.',
  },
  {
    focus: 'voice',
    met: (inv) => inv.voiceCaptured,
    direction:
      'When you are ready, record a short spoken account, in your own words, of what happened.',
  },
]

/** An empty inventory: nothing captured yet. */
export function emptyInventory(): CaptureInventory {
  return { photos: [], documents: [], voiceCaptured: false, insuranceCardParsed: false }
}

/**
 * The next essential capture given what is already in hand, as a compliant
 * CaptureDirection. Returns done when every essential is captured.
 */
export function nextEssentialCapture(inventory: CaptureInventory): CaptureDirection {
  const next = CAPTURE_CHECKLIST.find((item) => !item.met(inventory))
  if (!next) {
    return {
      direction: 'You have the essential photos and details. You can move on whenever you are ready.',
      focus: 'complete',
      done: true,
    }
  }
  return { direction: next.direction, focus: next.focus, done: false }
}

/** How many essential items remain unmet. Used for progress, never for evaluation. */
export function essentialCapturesRemaining(inventory: CaptureInventory): number {
  return CAPTURE_CHECKLIST.filter((item) => !item.met(inventory)).length
}
