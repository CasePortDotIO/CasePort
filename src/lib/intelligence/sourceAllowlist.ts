import type { SourceRecordInput } from '@/services/intelligenceCorePorts'

/**
 * The provisional CasePort Intelligence Core source allowlist (decision D7,
 * INTELLIGENCE_CORE.md Section 5 and Section 14 item 2).
 *
 * Every source here is derived directly from the sources the doctrine names in
 * Section 4, rated by the H5 discipline (A primary or institutional, B industry
 * research, C synthesized or estimated). It is provisional and reversible in the
 * same manner as the D3 price table: the founder can add, retune the rating of,
 * or retire any entry, and new sources are added only through human review.
 *
 * This is seed data, not code behavior. The epistemic gate is source agnostic;
 * changing this list changes what may be ingested, never how ingestion works.
 */
export const SEED_SOURCE_ALLOWLIST: readonly SourceRecordInput[] = [
  // Demand and B2C (Section 4.1). Search and answer-engine landscape.
  {
    sourceKey: 'semrush-mcp',
    name: 'Semrush (search and keyword trends via MCP)',
    origin: 'rented',
    reliability: 'B',
    domains: ['demand', 'market'],
    addedBy: 'founder',
    notes: 'Search and voice query trends, keyword volume, competitor organic footprint.',
  },
  {
    sourceKey: 'answer-engine-citations',
    name: 'Answer-engine citation presence (synthesized)',
    origin: 'rented',
    reliability: 'C',
    domains: ['demand', 'market'],
    addedBy: 'founder',
    notes: 'Citation-gap observations across major AI answer engines. Synthesized, low confidence.',
  },

  // Supply and B2B (Section 4.2). Firmographics, lead pricing, competitor moves.
  {
    sourceKey: 'clay-enrichment',
    name: 'Clay B2B firmographic enrichment',
    origin: 'rented',
    reliability: 'B',
    domains: ['supply'],
    addedBy: 'founder',
    notes: 'Firm size, practice area, marketing-spend signals for firm-fit modeling.',
  },
  {
    sourceKey: 'lead-market-rates',
    name: 'Personal injury lead market rate benchmarks',
    origin: 'rented',
    reliability: 'B',
    domains: ['supply', 'market'],
    addedBy: 'founder',
    notes: 'Exclusive and shared lead pricing by tier and metro. Industry research.',
  },
  {
    sourceKey: 'competitor-pricing',
    name: 'Competitor positioning and pricing (inferred)',
    origin: 'rented',
    reliability: 'C',
    domains: ['supply', 'market'],
    addedBy: 'founder',
    notes: 'Inferred competitor moves and pricing. Synthesized, verify before action.',
  },

  // Regulatory and compliance (Section 4.3). The highest-leverage domain.
  {
    sourceKey: 'aba-model-rules',
    name: 'American Bar Association model rules and opinions',
    origin: 'rented',
    reliability: 'A',
    domains: ['regulatory'],
    addedBy: 'founder',
    notes: 'Primary institutional source for Rule 5.4 and advertising rules.',
  },
  {
    sourceKey: 'va-bar-ethics',
    name: 'Virginia State Bar ethics opinions',
    origin: 'rented',
    reliability: 'A',
    domains: ['regulatory'],
    addedBy: 'founder',
  },
  {
    sourceKey: 'md-bar-ethics',
    name: 'Maryland State Bar ethics opinions',
    origin: 'rented',
    reliability: 'A',
    domains: ['regulatory'],
    addedBy: 'founder',
  },
  {
    sourceKey: 'dc-bar-ethics',
    name: 'District of Columbia Bar ethics opinions',
    origin: 'rented',
    reliability: 'A',
    domains: ['regulatory'],
    addedBy: 'founder',
  },
  {
    sourceKey: 'ga-bar-ethics',
    name: 'State Bar of Georgia ethics opinions',
    origin: 'rented',
    reliability: 'A',
    domains: ['regulatory'],
    addedBy: 'founder',
  },
  {
    sourceKey: 'state-legislatures',
    name: 'State legislature tort reform and statute trackers',
    origin: 'rented',
    reliability: 'A',
    domains: ['regulatory', 'market'],
    addedBy: 'founder',
    notes: 'Statute of limitations and tort reform changes in operating and target states.',
  },
  {
    sourceKey: 'tcpa-consent-tracker',
    name: 'Mini-TCPA and consent-rule development tracker',
    origin: 'rented',
    reliability: 'B',
    domains: ['regulatory'],
    addedBy: 'founder',
  },

  // Market and competitive (Section 4.4). Benchmark reference data.
  {
    sourceKey: 'injury-settlement-benchmarks',
    name: 'Medical, injury, and settlement benchmark data',
    origin: 'rented',
    reliability: 'B',
    domains: ['market'],
    addedBy: 'founder',
    notes: 'Keeps the published benchmark reference current per the Data Standards schedule.',
  },

  // Owned first party intelligence (Section 1). The moat. Fed by the event log.
  {
    sourceKey: 'caseport-event-log',
    name: 'CasePort first party event log',
    origin: 'owned',
    reliability: 'A',
    domains: ['demand', 'supply', 'regulatory', 'market'],
    addedBy: 'founder',
    notes: 'Signed-case outcomes joined by the attribution tuple. Unrentable. The moat.',
  },
] as const
