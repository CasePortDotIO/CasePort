import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * CaptureAttributions. The learning loop linkage (DEMAND_CAPTURE.md Section 9,
 * Section 10 `captureAttribution`).
 *
 * Each row links a signed or unsigned outcome back to the exact surface,
 * phrasing, market, and case type that produced it, resolved through the
 * attribution trace. Aggregated, the signed rows tell the engine which surfaces
 * convert, so it reallocates its next cycle toward them. Derived and
 * recomputable from the trace; internal only. No delete.
 */
export const CaptureAttributions: CollectionConfig = {
  slug: 'capture-attributions',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Demand Capture',
    useAsTitle: 'outcomeId',
    defaultColumns: ['outcomeId', 'signed', 'surface', 'market', 'linkedAt'],
    description: 'Signed cases traced back to the surface and phrasing that produced them. The Answer to Wallet moat.',
  },
  fields: [
    { name: 'outcomeId', type: 'text', required: true, unique: true, index: true },
    { name: 'signed', type: 'checkbox', index: true },
    { name: 'valueCents', type: 'number' },
    { name: 'surface', type: 'text', index: true },
    { name: 'keyword', type: 'text' },
    { name: 'market', type: 'text', index: true },
    { name: 'caseType', type: 'text' },
    { name: 'complete', type: 'checkbox', admin: { description: 'False when the trace broke, so a broken link stays visible.' } },
    { name: 'linkedAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
