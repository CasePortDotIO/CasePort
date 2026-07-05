import type { CollectionConfig } from 'payload'
import { authenticated, firmOnlyFieldRead } from '../access'

/**
 * ScpsScores. Versioned (Section 5, Section 9). Every score records the model
 * version that produced it so a v2 recalibration is auditable.
 *
 * SCPS lives entirely in the intelligence layer and the firm only dossier
 * fields. It is never a routing input (W1). It is never claimant facing (W2).
 * The whole record is firm only; every value field carries firm only read.
 * Append only so recalibration writes a new version rather than mutating one.
 */
export const ScpsScores: CollectionConfig = {
  slug: 'scpsScores',
  access: {
    read: authenticated,
    create: authenticated,
    update: () => false,
    delete: () => false,
  },
  admin: {
    group: 'Case Pipeline',
    useAsTitle: 'id',
    defaultColumns: ['dossier', 'modelVersion', 'score', 'computedAt'],
    description: 'Versioned SCPS. Firm facing triage only. Never a routing input (W1).',
  },
  fields: [
    { name: 'dossier', type: 'relationship', relationTo: 'dossiers', required: true, index: true },
    { name: 'modelVersion', type: 'text', required: true, defaultValue: 'v1', index: true },
    { name: 'score', type: 'number', required: true, access: { read: firmOnlyFieldRead } },
    {
      name: 'breakdown',
      type: 'array',
      access: { read: firmOnlyFieldRead },
      admin: { description: 'The 5 layer factor set: Signal Integrity, Geographic Fit, Case Viability, Contactability, Buyer Fit.' },
      fields: [
        { name: 'layer', type: 'text' },
        { name: 'score', type: 'number' },
        { name: 'max', type: 'number' },
      ],
    },
    { name: 'computedAt', type: 'date', required: true, defaultValue: () => new Date() },
  ],
  timestamps: true,
}
