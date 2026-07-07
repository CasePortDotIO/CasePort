import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { INTELLIGENCE_DOMAINS } from '@/lib/domain/intelligenceCore'

/**
 * RecommendationOutcomes. The CIC self scoring record (INTELLIGENCE_CORE.md
 * Section 9, Section 10 `recommendationOutcomes`).
 *
 * Each row grades one executed recommendation: what it predicted, what actually
 * happened, and whether it paid off. Aggregated by type, these calibrate the
 * CIC's future confidence, so the engine learns which of its recommendation
 * classes produce revenue. Derived and recomputable; internal only. No delete.
 */
export const RecommendationOutcomes: CollectionConfig = {
  slug: 'recommendation-outcomes',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence Core',
    useAsTitle: 'recommendationId',
    defaultColumns: ['domain', 'recommendationId', 'paidOff', 'actualValue', 'measuredAt'],
    description: 'Predicted versus actual for executed recommendations. Calibrates the CIC confidence by type.',
  },
  fields: [
    { name: 'recommendationId', type: 'text', required: true, index: true },
    {
      name: 'domain',
      type: 'select',
      required: true,
      index: true,
      options: INTELLIGENCE_DOMAINS.map((d) => ({ label: d.label, value: d.value })),
    },
    { name: 'predicted', type: 'text' },
    { name: 'actualValue', type: 'number' },
    { name: 'paidOff', type: 'checkbox' },
    { name: 'note', type: 'textarea' },
    { name: 'measuredAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
