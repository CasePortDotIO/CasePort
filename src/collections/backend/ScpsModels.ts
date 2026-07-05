import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * ScpsModels. The versioned SCPS weight model (Section 9). Recalibration saves a
 * new version, never mutating an existing one, so every historical score stays
 * reproducible against the exact model that produced it. This is the moat wired
 * from day one: the model that outcomes recalibrate into.
 *
 * Firm only intelligence. Never a routing input (W1), never claimant facing
 * (W2), never derived from or an input to a fee (W3, W4). Append only.
 *
 * Human in the loop promotion (AGENTS.md Section 4.6, Section 3). Recalibration
 * writes a 'proposed' model; it scores nothing. Only an explicit, audited
 * promotion through IntelligenceService.promoteScpsModel flips a proposal to
 * 'active'. The collection blocks all updates from the admin panel and external
 * API, so a version can never be silently self activated; promotion changes the
 * status field only and never the weights, so no historical score is altered.
 */
export const ScpsModels: CollectionConfig = {
  slug: 'scpsModels',
  access: {
    read: authenticated,
    create: authenticated,
    update: () => false,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence',
    useAsTitle: 'version',
    defaultColumns: ['version', 'status', 'sampleCount', 'signedCount', 'createdAt'],
    description: 'Versioned SCPS weight model. Recalibrated from firm reported outcomes. Never a fee input (W4).',
  },
  fields: [
    { name: 'version', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'proposed',
      index: true,
      options: [
        { label: 'Proposed (awaiting human promotion)', value: 'proposed' },
        { label: 'Active (scoring)', value: 'active' },
      ],
      admin: {
        description:
          'Recalibration writes proposed models. A human promotes to active through the intelligence service; a proposed model never scores. Section 4.6.',
      },
    },
    {
      name: 'weights',
      type: 'group',
      admin: { description: 'Factor weights, normalized to sum to one.' },
      fields: [
        { name: 'injuryVerification', type: 'number', required: true },
        { name: 'liabilityClarity', type: 'number', required: true },
        { name: 'statuteStatus', type: 'number', required: true },
        { name: 'caseTypeMatch', type: 'number', required: true },
        { name: 'firmResponseCapacity', type: 'number', required: true },
      ],
    },
    { name: 'sampleCount', type: 'number', defaultValue: 0, admin: { description: 'Outcomes this model was trained on.' } },
    { name: 'signedCount', type: 'number', defaultValue: 0 },
    { name: 'createdAt', type: 'date', required: true, defaultValue: () => new Date(), index: true },
  ],
  timestamps: true,
}
