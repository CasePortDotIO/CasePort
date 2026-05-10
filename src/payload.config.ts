import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { CTAButtonFeature } from './features/CTAButton/server'

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
        const errorMessage = error.message || ''

        // Handle validation errors with " | " separator (multiple errors from beforeValidate)
        if (errorMessage.includes(' | ') && result) {
          const messages = errorMessage.split(' | ')
          const formattedErrors = messages.map((msg: string) => ({ message: msg.trim() }))
          return {
            response: {
              ...result,
              data: { errors: formattedErrors },
              message: messages[0],
              status: 400,
            },
          }
        }
        // Handle MongoDB duplicate key error for slug
        if (errorMessage.includes('E11000') || errorMessage.includes('duplicate key')) {
          const formattedErrors = [{ message: 'Slug already exists. Please use a different slug.' }]
          return {
            response: {
              ...result,
              data: { errors: formattedErrors },
              message: 'Slug already exists',
              status: 400,
            },
          }
        }
        // Handle "The following field is invalid: slug" from Payload field validation
        if (errorMessage.includes('The following field is invalid: slug')) {
          const formattedErrors = [{ message: 'Slug already exists. Please use a different slug.' }]
          return {
            response: {
              ...result,
              data: { errors: formattedErrors },
              message: 'Slug already exists',
              status: 400,
            },
          }
        }
        // Handle all other thrown errors (single validation errors without separator)
        if (errorMessage) {
          const formattedErrors = [{ message: errorMessage }]
          return {
            response: {
              ...result,
              data: { errors: formattedErrors },
              message: errorMessage,
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
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature(), CTAButtonFeature()],
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
