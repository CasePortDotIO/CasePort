import type { OpsCockpit } from './cockpit'

/**
 * A representative sample snapshot for the /ops design preview only. Not used by
 * the live console, which renders real records. Every value here is illustrative,
 * chosen to exercise the full layout at realistic magnitudes (the five funded
 * firms scenario), so the design can be reviewed without a seeded database.
 */
export const SAMPLE_COCKPIT: OpsCockpit = {
  online: true,
  generatedAt: '2026-07-06T14:20:00.000Z',
  flywheel: {
    activeSignals: 148,
    sources: 14,
    pursuedCells: 63,
    publishedAssets: 27,
    fundedMarkets: 4,
    eventsTotal: 5120,
  },
  cic: {
    sources: {
      total: 14,
      byRating: { A: 6, B: 6, C: 2 },
      active: 12,
      prohibited: 1,
      retired: 1,
      rows: [
        { sourceKey: 'va-bar-ethics', name: 'Virginia State Bar ethics opinions', reliability: 'A', status: 'active', origin: 'rented', lastCheckedAt: '2026-07-06T06:00:00.000Z' },
        { sourceKey: 'ga-bar-ethics', name: 'State Bar of Georgia ethics opinions', reliability: 'A', status: 'active', origin: 'rented', lastCheckedAt: '2026-07-06T06:00:00.000Z' },
        { sourceKey: 'caseport-event-log', name: 'CasePort first party event log', reliability: 'A', status: 'active', origin: 'owned', lastCheckedAt: '2026-07-06T14:19:00.000Z' },
        { sourceKey: 'semrush-mcp', name: 'Semrush (search and keyword trends)', reliability: 'B', status: 'active', origin: 'rented', lastCheckedAt: '2026-07-06T07:00:00.000Z' },
        { sourceKey: 'clay-enrichment', name: 'Clay B2B firmographic enrichment', reliability: 'B', status: 'active', origin: 'rented', lastCheckedAt: '2026-07-05T07:00:00.000Z' },
        { sourceKey: 'competitor-pricing', name: 'Competitor positioning (inferred)', reliability: 'C', status: 'active', origin: 'rented', lastCheckedAt: '2026-07-04T07:00:00.000Z' },
      ],
    },
    signals: {
      total: 210,
      active: 148,
      superseded: 62,
      byDomain: { demand: 52, supply: 41, regulatory: 33, market: 22 },
      recent: [
        { claim: 'Virginia contributory negligence question cluster is growing on answer engines.', sourceKey: 'semrush-mcp', domain: 'demand', reliability: 'B', status: 'active', observedAt: '2026-07-06T11:00:00.000Z' },
        { claim: 'Georgia bar published a new advertising opinion affecting referral language.', sourceKey: 'ga-bar-ethics', domain: 'regulatory', reliability: 'A', status: 'active', observedAt: '2026-07-06T09:30:00.000Z' },
        { claim: 'Firm profile with a dedicated intake director converts to a funded wallet more often.', sourceKey: 'caseport-event-log', domain: 'supply', reliability: 'A', status: 'active', observedAt: '2026-07-06T08:15:00.000Z' },
        { claim: 'Exclusive lead pricing in premium metros drifted up quarter over quarter.', sourceKey: 'competitor-pricing', domain: 'market', reliability: 'C', status: 'active', observedAt: '2026-07-05T16:00:00.000Z' },
      ],
    },
    synthesis: { artifacts: 12, recommendationsProposed: 9, recommendationsRejected: 3 },
    loop: { measured: 22, paidOff: 15, confidence: 0.68 },
    briefing: { briefings: 34, alerts: 6, lastBriefingAt: '2026-07-06T07:00:00.000Z' },
  },
  demand: {
    cells: {
      total: 118,
      pursue: 63,
      ignore: 55,
      byIgnoreReason: { 'unfunded-market': 31, 'not-unique': 18, 'low-intent': 6 },
      topPursued: [
        { cellKey: 'va:mva:contributory-negligence', market: 'va', surface: 'answer-engine', score: 0.86 },
        { cellKey: 'ga:mva:sb-68', market: 'ga', surface: 'search', score: 0.81 },
        { cellKey: 'dc:pedestrian:carve-outs', market: 'dc', surface: 'answer-engine', score: 0.77 },
        { cellKey: 'md:premises:notice', market: 'md', surface: 'question-platform', score: 0.72 },
        { cellKey: 'va:trucking:fmcsa', market: 'va', surface: 'search', score: 0.69 },
      ],
    },
    assets: {
      total: 40,
      byStatus: { draft: 6, 'pending-approval': 7, published: 27 },
      recentPublished: [
        { title: 'Virginia contributory negligence, explained', surface: 'answer-engine', canonicalQuestion: 'What is contributory negligence in Virginia personal injury cases?', url: '', publishedAt: '2026-07-06T10:00:00.000Z' },
        { title: 'Georgia SB 68 and your personal injury claim', surface: 'search', canonicalQuestion: 'How does Georgia SB 68 affect a personal injury claim?', url: '', publishedAt: '2026-07-05T15:00:00.000Z' },
        { title: 'DC pedestrian right of way carve outs', surface: 'answer-engine', canonicalQuestion: 'What are the DC pedestrian right of way rules?', url: '', publishedAt: '2026-07-05T12:00:00.000Z' },
        { title: 'What to do after a slip and fall in Maryland', surface: 'question-platform', canonicalQuestion: 'What should I do after a slip and fall in Maryland?', url: '', publishedAt: '2026-07-04T18:00:00.000Z' },
      ],
    },
    fundedMarkets: ['va', 'md', 'dc', 'ga'],
    b2b: { targets: 240, outboundPending: 18, outboundSent: 62 },
    learning: { signedTraced: 41, topSurface: 'answer-engine', topSurfaceSigned: 23, citedQuestions: 17 },
  },
  events: [
    { id: 'e1', eventType: 'IntelligenceSignalIngested', lane: 'intelligence', aggregateType: 'intelligence-signal', aggregateId: 's_2211', actor: 'cic', occurredAt: '2026-07-06T14:19:40.000Z' },
    { id: 'e2', eventType: 'CaptureAssetPublished', lane: 'demand', aggregateType: 'capture-asset', aggregateId: 'a_181', actor: 'Martha', occurredAt: '2026-07-06T14:12:10.000Z' },
    { id: 'e3', eventType: 'RecommendationProposed', lane: 'intelligence', aggregateType: 'recommendation', aggregateId: 'r_44', actor: 'cic', occurredAt: '2026-07-06T14:05:00.000Z' },
    { id: 'e4', eventType: 'OutboundDrafted', lane: 'demand', aggregateType: 'b2b-target', aggregateId: 't_1902', actor: 'demand-capture', occurredAt: '2026-07-06T13:58:22.000Z' },
    { id: 'e5', eventType: 'IntelligenceArtifactSynthesized', lane: 'intelligence', aggregateType: 'intelligence-artifact', aggregateId: 'art_31', actor: 'cic', occurredAt: '2026-07-06T13:40:00.000Z' },
    { id: 'e6', eventType: 'DossierDelivered', lane: 'core', aggregateType: 'delivery', aggregateId: 'd_771', actor: 'system', occurredAt: '2026-07-06T13:22:41.000Z' },
    { id: 'e7', eventType: 'DemandCellScored', lane: 'demand', aggregateType: 'demand-cell', aggregateId: 'c_640', actor: 'demand-capture', occurredAt: '2026-07-06T13:10:05.000Z' },
    { id: 'e8', eventType: 'RecommendationRejected', lane: 'intelligence', aggregateType: 'recommendation', aggregateId: 'r_43', actor: 'cic', occurredAt: '2026-07-06T12:55:00.000Z' },
    { id: 'e9', eventType: 'OutboundSent', lane: 'demand', aggregateType: 'b2b-target', aggregateId: 't_1877', actor: 'a-principal', occurredAt: '2026-07-06T12:30:00.000Z' },
    { id: 'e10', eventType: 'WalletDebited', lane: 'core', aggregateType: 'ledger', aggregateId: 'l_5521', actor: 'system', occurredAt: '2026-07-06T12:22:41.000Z' },
    { id: 'e11', eventType: 'OutcomeReported', lane: 'core', aggregateType: 'outcome', aggregateId: 'o_312', actor: 'firm', occurredAt: '2026-07-06T11:48:00.000Z' },
    { id: 'e12', eventType: 'KeywordQuestionClaimed', lane: 'demand', aggregateType: 'keyword-ownership', aggregateId: 'contributory-negligence-va', actor: 'Martha', occurredAt: '2026-07-06T10:00:05.000Z' },
    { id: 'e13', eventType: 'IntelligenceSignalSuperseded', lane: 'intelligence', aggregateType: 'intelligence-signal', aggregateId: 's_2103', actor: 'cic', occurredAt: '2026-07-06T09:31:00.000Z' },
    { id: 'e14', eventType: 'AuthorityDrafted', lane: 'demand', aggregateType: 'capture-asset', aggregateId: 'a_180', actor: 'demand-capture', occurredAt: '2026-07-06T09:05:00.000Z' },
  ],
}
