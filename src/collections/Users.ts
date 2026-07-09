import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default.
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'operator',
      saveToJWT: true, // include in the JWT so access checks avoid a DB lookup
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Operator', value: 'operator' },
      ],
      access: {
        // Only an admin can change a role, so operators cannot self promote.
        update: ({ req: { user } }) => Boolean(user && (user as { role?: string }).role === 'admin'),
      },
      admin: { description: 'Admins can promote SCPS model versions and manage roles.' },
    },
  ],
}
