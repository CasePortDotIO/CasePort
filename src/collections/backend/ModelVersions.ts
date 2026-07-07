import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { PROMOTION_TYPES } from '@/lib/domain/intelligenceCore'

/**
 * ModelVersions. Versioned production values (INTELLIGENCE_CORE.md Phase F,
 * Section 7, Section 10 `modelVersions`).
 *
 * Every production value the CIC can change (SCPS weights, the flat price table,
 * qualification weights, a market posture) is versioned here when a promotion is
 * approved. Each version records the data window it learned from and the
 * promotion and approvers that produced it, so any production value traces back
 * to its proposal, evidence, and human approval. Internal only. No delete.
 */
export const ModelVersions: CollectionConfig = {
  slug: 'model-versions',
  access: {
    read: authenticated,
    create: authenticated,
    update: () => false,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence Core',
    useAsTitle: 'version',
    defaultColumns: ['type', 'version', 'dataWindow', 'createdAt'],
    description: 'Versioned production values, each traceable to the promotion and approvers that produced it.',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: PROMOTION_TYPES.map((t) => ({ label: t.label, value: t.value })),
    },
    { name: 'version', type: 'text', required: true },
    { name: 'value', type: 'json' },
    { name: 'dataWindow', type: 'text' },
    { name: 'promotionId', type: 'text', index: true },
    { name: 'approvedBy', type: 'json' },
    { name: 'createdAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
