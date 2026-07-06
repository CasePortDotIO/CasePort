import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { CAPTURE_SURFACES } from '@/lib/domain/demandCapture'

/**
 * SurfacePresence. Citation ownership tracking (DEMAND_CAPTURE.md Section 9,
 * Section 10 `surfacePresence`).
 *
 * Each row records whether answer engines cite CasePort for a target question on
 * a surface, so citation ownership is measured, not assumed. Derived and
 * recomputable; internal only. No delete.
 */
export const SurfacePresence: CollectionConfig = {
  slug: 'surface-presence',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Demand Capture',
    useAsTitle: 'question',
    defaultColumns: ['question', 'surface', 'market', 'cited', 'checkedAt'],
    description: 'Whether answer engines cite CasePort for a target question. Citation ownership, measured.',
  },
  fields: [
    { name: 'question', type: 'text', required: true, index: true },
    {
      name: 'surface',
      type: 'select',
      options: CAPTURE_SURFACES.map((s) => ({ label: s.label, value: s.value })),
    },
    { name: 'market', type: 'text', index: true },
    { name: 'cited', type: 'checkbox', index: true },
    { name: 'engines', type: 'json', admin: { description: 'Which answer engines cite CasePort for this question.' } },
    { name: 'checkedAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
