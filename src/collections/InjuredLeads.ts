import type { CollectionConfig } from 'payload'

export const InjuredLeads: CollectionConfig = {
  slug: 'injured-leads',
  admin: {
    useAsTitle: 'submissionId',
    defaultColumns: ['submissionId', 'firstName', 'phone', 'incidentState', 'caseScore', 'urgencyLevel', 'createdAt'],
    components: {
      beforeList: ['@/components/admin/MarkInjuredLeadsSeen#MarkInjuredLeadsSeen'],
    },
  },
  access: {
    create: () => true, // Anyone can submit the form
    read: ({ req: { user } }) => Boolean(user), // Only authenticated admins can read
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // ─── Submission Identity ───────────────────────────────
    { name: 'submissionId', type: 'text' },
    { name: 'caseScore', type: 'number', defaultValue: 0 },
    { name: 'routingStatus', type: 'text' },
    { name: 'urgencyLevel', type: 'select', options: ['urgent', 'soon', 'standard'] },

    // ─── Incident Details ───────────────────────────────────
    { name: 'incidentType', type: 'text', required: true },
    { name: 'incidentDate', type: 'text' },
    { name: 'incidentDaysSince', type: 'number' },
    { name: 'solFlag', type: 'checkbox', defaultValue: false },
    { name: 'solExpired', type: 'checkbox', defaultValue: false },

    // ─── Location ──────────────────────────────────────────
    { name: 'incidentState', type: 'text', required: true },
    { name: 'incidentCity', type: 'text' },
    { name: 'inMarket', type: 'checkbox', defaultValue: false },
    { name: 'outOfMarket', type: 'checkbox', defaultValue: false },

    // ─── Liability ─────────────────────────────────────────
    { name: 'liabilityStatus', type: 'text' },
    { name: 'liabilityFlag', type: 'select', options: ['confirmed', 'disputed', 'unsure'] },
    { name: 'compNegFlag', type: 'checkbox', defaultValue: false },

    // ─── Medical Treatment ─────────────────────────────────
    { name: 'medicalTreatment', type: 'text' },
    { name: 'treatmentLevel', type: 'select', options: ['er', 'urgentCare', 'specialist', 'primaryCare', 'none'] },
    { name: 'treatmentTypes', type: 'array', fields: [{ name: 'type', type: 'text' }] },
    { name: 'treatmentSeveritySignal', type: 'select', options: ['high', 'moderate', 'low'] },
    { name: 'providerName', type: 'text' },
    { name: 'providerType', type: 'text' },
    { name: 'providerCity', type: 'text' },
    { name: 'providerUnknown', type: 'checkbox', defaultValue: false },
    { name: 'treatmentOngoing', type: 'checkbox' },
    { name: 'awaitingTreatment', type: 'checkbox', defaultValue: false },
    { name: 'treatmentRecency', type: 'text' },

    // ─── Injury Details ─────────────────────────────────────
    { name: 'injuryTypes', type: 'array', fields: [{ name: 'type', type: 'text' }] },
    { name: 'injurySeverityIndex', type: 'number', defaultValue: 0 },

    // ─── Life Impact ────────────────────────────────────────
    { name: 'lifeImpact', type: 'text' },
    { name: 'impactLevel', type: 'select', options: ['serious', 'moderate', 'minimal'] },

    // ─── Insurance ──────────────────────────────────────────
    { name: 'atFaultInsurance', type: 'text' },
    { name: 'ownUMCoverage', type: 'text' },
    { name: 'reportFiled', type: 'checkbox' },

    // ─── Attorney History ──────────────────────────────────
    { name: 'priorAttorney', type: 'checkbox', defaultValue: false },
    { name: 'priorSettlement', type: 'checkbox', defaultValue: false },

    // ─── Contact Info ───────────────────────────────────────
    { name: 'firstName', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'phoneVerified', type: 'checkbox', defaultValue: false },
    { name: 'email', type: 'email' },
    { name: 'preferredContactTime', type: 'array', fields: [{ name: 'time', type: 'text' }] },

    // ─── Compliance ─────────────────────────────────────────
    { name: 'consentGiven', type: 'checkbox', defaultValue: false },
    { name: 'consentTimestamp', type: 'text' },
    { name: 'hipaaSignature', type: 'text' },
    { name: 'hipaaSignatureMode', type: 'select', options: ['draw', 'type'] },
    { name: 'hipaaSignedAt', type: 'text' },

    // ─── Submission Meta ────────────────────────────────────
    { name: 'submittedAt', type: 'text' },
    { name: 'seen', type: 'checkbox', defaultValue: false },

    // ─── Documents ──────────────────────────────────────────
    {
      name: 'uploadedDocuments',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Documents uploaded by the user during form submission.',
      },
    },
  ],
  timestamps: true,
}