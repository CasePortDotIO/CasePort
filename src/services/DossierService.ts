import { notImplemented } from './notImplemented'
import {
  toClaimantDossier,
  toFirmDossier,
  type Dossier,
  type ClaimantSafeDossier,
} from '@/lib/compliance/dossierProjections'

/**
 * DossierService. Section 4, Section 5. Assembles the case file and produces the
 * two audience projections. The projections are the enforced audience split
 * (W2). The claimant projection never carries an evaluative field; the
 * compliance leak test guards it.
 *
 * The projection methods are live now because the wall depends on them. assemble
 * is filled in Phase 1.
 */
export const DossierService = {
  /** The claimant safe projection. Structurally omits the evaluation half (W2). */
  claimantProjection(dossier: Dossier): ClaimantSafeDossier {
    return toClaimantDossier(dossier)
  },

  /** The firm facing projection. Both halves, gated to the market firm elsewhere. */
  firmProjection(dossier: Dossier): Dossier {
    return toFirmDossier(dossier)
  },

  assemble: (_dossierId: string): never =>
    notImplemented('DossierService', 'assemble', 'Phase 1'),
}
