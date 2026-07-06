import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { ASSET_STATUSES, CAPTURE_SURFACES } from '@/lib/domain/demandCapture'

/**
 * CaptureAssets. Every produced asset or answer (DEMAND_CAPTURE.md Section 10
 * `captureAssets`).
 *
 * Each asset carries its surface, its target cell, its owning real identity, its
 * canonical question, its publish status, and its human approver. A human
 * publishes anything under a real identity (HL4), so the pre publish gate in
 * DemandCaptureService is the only path from draft to published, and the
 * approver is always recorded. Internal control surface; the published artifact
 * lives on the public surface it names. No delete.
 */
export const CaptureAssets: CollectionConfig = {
  slug: 'capture-assets',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Demand Capture',
    useAsTitle: 'title',
    defaultColumns: ['title', 'surface', 'canonicalQuestion', 'status', 'approvedBy', 'publishedAt'],
    description:
      'Produced capture assets and answers. A human approves and publishes anything under a real identity (HL4).',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'cellKey', type: 'text', required: true, index: true },
    {
      name: 'surface',
      type: 'select',
      required: true,
      options: CAPTURE_SURFACES.map((s) => ({ label: s.label, value: s.value })),
    },
    {
      name: 'canonicalQuestion',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'The one question this asset owns across the domain (Section 7).' },
    },
    { name: 'url', type: 'text', required: true, admin: { description: 'The canonical URL that owns the question.' } },
    {
      name: 'owningIdentity',
      type: 'text',
      required: true,
      admin: { description: 'The real named identity for identity based surfaces (HL2). Never an AI or anonymous author.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: ASSET_STATUSES.map((s) => ({ label: s.label, value: s.value })),
    },
    {
      name: 'approvedBy',
      type: 'text',
      admin: { description: 'The human who approved publication (HL4). Set only when published.' },
    },
    { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    {
      name: 'structure',
      type: 'json',
      admin: { description: 'The asset structure validated by the deterministic placement gate (Section 7).' },
    },
  ],
  timestamps: true,
}
