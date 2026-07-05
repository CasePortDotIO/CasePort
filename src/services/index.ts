/**
 * The domain service layer (Section 4). All business logic lives behind these
 * pure services. Routes, Payload hooks, and Inngest functions call services;
 * they never reach into the database directly for business operations. Each
 * service is designed to become an MCP tool: clean inputs, clean outputs, no
 * hidden side channels.
 *
 * Phase 0 stands up ComplianceService (the wall) and the RoutingService
 * signature (W1). The remaining services are typed skeletons whose bodies are
 * filled in their phases:
 *   IntakeService, QualificationService, DossierService  Phase 1
 *   WalletService                                        Phase 2 and 3
 *   OutcomeService, IntelligenceService                  Phase 4
 */
export { ComplianceService } from './ComplianceService'
export { RoutingService, decideGeographicRoute, createRoutingService } from './RoutingService'
export type { RoutingIntake, GeographicRoutingDecision, RoutingServiceInstance } from './RoutingService'
export { createDeliveryService } from './DeliveryService'
export type { DeliveryService, DeliveryOutcome } from './DeliveryService'
export type * from './deliveryPorts'
export { createIntakeService } from './IntakeService'
export type { IntakeService } from './IntakeService'
export type * from './ports'
export { QualificationService } from './QualificationService'
export { DossierService } from './DossierService'
export { createWalletService } from './WalletService'
export type { WalletService } from './WalletService'
export type * from './walletPorts'
export { createGlassBoxService } from './GlassBoxService'
export type { GlassBoxService } from './GlassBoxService'
export { createOutcomeService } from './OutcomeService'
export type { OutcomeService } from './OutcomeService'
export { createIntelligenceService, nextModelVersion } from './IntelligenceService'
export type { IntelligenceService } from './IntelligenceService'
export * from './scps'
export type * from './intelligencePorts'
