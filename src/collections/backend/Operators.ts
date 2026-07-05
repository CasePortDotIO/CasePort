import type { CollectionConfig } from 'payload'
import { authenticated, adminOnly } from '../access'

/**
 * Operators. Internal staff who work the qualify queue and the SLA war room
 * (prototype contract map, internal dashboard). Derived performance metrics
 * live in the intelligence layer and are recomputable; this record holds only
 * the operator facts.
 */
export const Operators: CollectionConfig = {
  slug: 'operators',
  access: {
    read: authenticated,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    group: 'Operations',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'status', 'updatedAt'],
    description: 'Internal operator staff record.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'user', type: 'relationship', relationTo: 'users', admin: { description: 'Backing Payload auth user.' } },
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'select', defaultValue: 'operator', options: ['operator', 'supervisor', 'manager'] },
        { name: 'status', type: 'select', defaultValue: 'active', options: ['active', 'inactive', 'on-leave'] },
      ],
    },
  ],
  timestamps: true,
}
