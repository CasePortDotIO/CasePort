import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Applications } from './collections/Applications'
import { Articles } from './collections/Articles'
import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { InjuredLeads } from './collections/InjuredLeads'
import { IntelligenceBriefs } from './collections/IntelligenceBriefs'
import { Markets } from './collections/Markets'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Waitlists } from './collections/Waitlists'

import { FooterNav } from './globals/FooterNav'
import { HeaderNav } from './globals/HeaderNav'
import { MarketsPage } from './globals/MarketsPage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: [
        '@/components/admin/IntelligenceUnseenBadge#IntelligenceUnseenBadge',
        '@/components/admin/InjuredLeadsUnseenBadge#InjuredLeadsUnseenBadge',
        '@/components/admin/ApplicationsUnseenBadge#ApplicationsUnseenBadge',
      ],
    },
  },
  hooks: {
    afterError: [
      ({ error, result }) => {
        if (error.message.includes(' | ') && result) {
          const messages = error.message.split(' | ')
          const formattedErrors = messages.map((msg: string) => ({ message: msg }))
          return {
            response: {
              ...result,
              data: { errors: formattedErrors },
              message: messages[0],
              status: 400,
            },
          }
        }
        return
      },
    ],
  },
  globals: [MarketsPage, SiteSettings, HeaderNav, FooterNav],
  collections: [
    Users,
    Media,
    Markets,
    Applications,
    Waitlists,
    IntelligenceBriefs,
    Categories,
    Authors,
    Articles,
    InjuredLeads,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token:
        process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_12345_123456789012345678901234567890',
    }),
  ],
})
