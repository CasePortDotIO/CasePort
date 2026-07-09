import type { CollectionConfig } from 'payload'

/**
 * FirmUsers. The auth identity for a partner logging into the firm dashboard
 * (Section 7). Each firm user belongs to exactly one firm, and that binding is
 * what scopes every read on the Glass Box to the firm's own data: the session
 * resolves the firm, not a path parameter a caller could tamper with.
 *
 * Separate from the internal `users` collection (operators and admins) so firm
 * partners never touch internal tooling and the two auth surfaces stay isolated.
 */
export const FirmUsers: CollectionConfig = {
  slug: 'firmUsers',
  auth: {
    // A provisioned partner may open the activation email later, so the set your
    // password token lasts three days. Reset links are single use and consumed on
    // use, so this window is comfortable without being loose.
    forgotPassword: { expiration: 1000 * 60 * 60 * 24 * 3 },
  },
  admin: {
    group: 'Firms',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'firm', 'role'],
    description: 'Partner logins for the firm dashboard. Each belongs to one firm.',
  },
  access: {
    // Internal staff manage firm users; a firm user reads only their own record.
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Email + password added by auth.
    { name: 'name', type: 'text', required: true },
    {
      name: 'firm',
      type: 'relationship',
      relationTo: 'firms',
      required: true,
      index: true,
      saveToJWT: true, // bind the firm into the session so scoping needs no lookup
      admin: { description: 'The firm this partner belongs to. Scopes all their reads.' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'partner',
      options: [
        { label: 'Managing Partner', value: 'partner' },
        { label: 'Staff', value: 'staff' },
      ],
    },
  ],
  timestamps: true,
}
