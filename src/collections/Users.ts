import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  hooks: {
    // Bootstrap: the very first internal user is an admin, so a fresh deployment
    // is never locked out of the admin only tooling. Only an admin can change a
    // role afterward, so this is the single sanctioned path to the first admin.
    // Every subsequent user defaults to operator.
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation !== 'create') return data
        const existing = await req.payload.count({ collection: 'users' })
        if (existing.totalDocs === 0) return { ...data, role: 'admin' }
        return data
      },
    ],
  },
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
