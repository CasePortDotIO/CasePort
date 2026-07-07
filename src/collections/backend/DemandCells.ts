import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { CAPTURE_SURFACES, CELL_IGNORE_REASONS, CELL_STATUSES } from '@/lib/domain/demandCapture'

/**
 * DemandCells. The Demand Capture Engine's defensible data cell store
 * (DEMAND_CAPTURE.md Section 10 `demandCells`).
 *
 * A cell is a geography by case-type by legal-concept unit, scored on
 * uniqueness, distinct intent, and funded monetizability (Section 6). Pursue or
 * ignore is decided by all three gates, with funded market gating a hard gate
 * (HL3): a cell in an unfunded market is always ignore. Lives in the reach
 * layer, recomputable, internal only. No delete.
 */
export const DemandCells: CollectionConfig = {
  slug: 'demand-cells',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Demand Capture',
    useAsTitle: 'cellKey',
    defaultColumns: ['cellKey', 'market', 'surface', 'status', 'score', 'scoredAt'],
    description:
      'Geography by case-type by legal-concept cells, scored by defensible data cell logic. Vanity volume scores zero.',
  },
  fields: [
    {
      name: 'cellKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'market:caseType:legalConcept, for example va:mva:contributory-negligence.' },
    },
    { name: 'market', type: 'text', required: true, index: true },
    { name: 'caseType', type: 'text', required: true },
    { name: 'legalConcept', type: 'text', required: true },
    {
      name: 'surface',
      type: 'select',
      required: true,
      options: CAPTURE_SURFACES.map((s) => ({ label: s.label, value: s.value })),
    },
    { name: 'uniqueness', type: 'number', required: true, admin: { description: '0 to 1. Uniquely or better than any other source.' } },
    { name: 'intent', type: 'number', required: true, admin: { description: '0 to 1. Distinct high intent.' } },
    {
      name: 'fundedMonetizable',
      type: 'checkbox',
      admin: { description: 'Resolved from the funded market state (HL3). Not a stored judgment.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: CELL_STATUSES.map((s) => ({ label: s.label, value: s.value })),
      index: true,
    },
    { name: 'score', type: 'number', admin: { description: 'Base score in 0 to 1. Zero when any gate fails. Never volume derived.' } },
    {
      name: 'ignoreReason',
      type: 'select',
      options: CELL_IGNORE_REASONS.map((r) => ({ label: r.label, value: r.value })),
      admin: { description: 'Why an ignored cell was deprioritized.' },
    },
    { name: 'scoredAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
