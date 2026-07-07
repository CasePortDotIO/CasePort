/**
 * Barrel export for the CasePort backend collections (Section 5). The existing
 * content and marketing collections stay where they are; these are the system
 * of record surface for the case acquisition network.
 */
export { Events } from './Events'
export { Claimants } from './Claimants'
export { IntakeSessions } from './IntakeSessions'
export { Dossiers } from './Dossiers'
export { Firms } from './Firms'
export { Wallets } from './Wallets'
export { LedgerEntries } from './LedgerEntries'
export { Deliveries } from './Deliveries'
export { Outcomes } from './Outcomes'
export { ScpsScores } from './ScpsScores'
export { ScpsModels } from './ScpsModels'
export { Disputes } from './Disputes'
export { Consents } from './Consents'
export { HipaaAuthorizations } from './HipaaAuthorizations'
export { Disclosures } from './Disclosures'
export { AuditLog } from './AuditLog'
export { Operators } from './Operators'
// CasePort Intelligence Core (INTELLIGENCE_CORE.md). System of intelligence,
// recomputable, internal only. Never a source of truth for any fact.
export { IntelligenceSources } from './IntelligenceSources'
export { IntelligenceSignals } from './IntelligenceSignals'
export { IntelligenceArtifacts } from './IntelligenceArtifacts'
export { Recommendations } from './Recommendations'
export { RecommendationOutcomes } from './RecommendationOutcomes'
export { Briefings } from './Briefings'
export { Promotions } from './Promotions'
export { ModelVersions } from './ModelVersions'
// CasePort Demand Capture Engine (DEMAND_CAPTURE.md). The reach layer.
// Recomputable, internal control surface. Harvest, never intercept.
export { DemandCells } from './DemandCells'
export { CaptureAssets } from './CaptureAssets'
export { B2BTargets } from './B2BTargets'
export { CaptureAttributions } from './CaptureAttributions'
export { SurfacePresence } from './SurfacePresence'
