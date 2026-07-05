import type { CollectionConfig } from 'payload'
import { authenticated, firmOnlyFieldRead } from '../access'
import { CASE_TYPES } from '@/lib/domain/constants'

/**
 * Dossiers. The assembled case file (Section 5). The single most compliance
 * bearing collection after routing and the wallet.
 *
 * Fields are split by audience and the split is enforced structurally, not by
 * convention:
 *
 *   Claimant safe fields (status, plain language summary, protection plan,
 *   procedural and geographic facts) may be shown to the claimant (W2, W6).
 *
 *   The evaluation group (SCPS, 5LQS reasoning, severity, statute status,
 *   estimated value, signed case probability) is firm facing only. Its fields
 *   carry field level read access so a claimant context cannot read them, and
 *   the compliance projection layer strips them from any claimant surface that
 *   does not run through Payload auth. Two layers, defense in depth.
 *
 * Routing is geographic only and never reads any field in the evaluation group
 * (W1). SCPS is attached here after routing, as firm facing triage.
 */
export const Dossiers: CollectionConfig = {
  slug: 'dossiers',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Case Pipeline',
    useAsTitle: 'id',
    defaultColumns: ['id', 'caseType', 'market', 'status', 'receivedAt'],
    description: 'Assembled case file. Claimant safe fields and firm only evaluation are physically separated.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Claimant Safe',
          description: 'Procedural and geographic only. Safe to show a claimant (W2, W6).',
          fields: [
            { name: 'claimant', type: 'relationship', relationTo: 'claimants', required: true },
            { name: 'market', type: 'relationship', relationTo: 'markets', required: true, index: true },
            { name: 'caseType', type: 'select', options: CASE_TYPES.map((c) => ({ label: c.label, value: c.value })) },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'received',
              admin: { description: 'Geographic and procedural language only.' },
              options: [
                { label: 'Received, pending firm contact', value: 'received' },
                { label: 'Delivered to firm', value: 'delivered' },
                { label: 'Firm contacted claimant', value: 'contacted' },
                { label: 'Closed', value: 'closed' },
              ],
            },
            { name: 'plainLanguageSummary', type: 'textarea', admin: { description: 'Reflective playback. Organization of the claimant words, never legal evaluation.' } },
            { name: 'protectionPlan', type: 'array', fields: [{ name: 'step', type: 'text', required: true }] },
            { name: 'statuteOfLimitationsDate', type: 'date' },
            { name: 'receivedAt', type: 'date', defaultValue: () => new Date() },
          ],
        },
        {
          label: 'Firm Only Evaluation',
          description: 'Firm facing triage. Never claimant facing (W2). Never a routing input (W1).',
          fields: [
            {
              name: 'evaluation',
              type: 'group',
              access: { read: firmOnlyFieldRead },
              fields: [
                { name: 'scpsScore', type: 'number', admin: { description: 'Firm facing triage percentage. Attached after routing.' } },
                { name: 'scpsVersion', type: 'text', defaultValue: 'v1' },
                { name: 'qualificationTier', type: 'select', options: ['A', 'B', 'C', 'D'] },
                { name: 'qualificationScore', type: 'number' },
                {
                  name: 'qualificationBreakdown',
                  type: 'array',
                  fields: [
                    { name: 'layer', type: 'text' },
                    { name: 'score', type: 'number' },
                    { name: 'max', type: 'number' },
                  ],
                },
                { name: 'estimatedValue', type: 'number' },
                { name: 'injurySeverity', type: 'text' },
                { name: 'liabilityAssessment', type: 'textarea' },
                { name: 'statuteStatus', type: 'text' },
                { name: 'signedCaseProbability', type: 'number' },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
