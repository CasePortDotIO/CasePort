import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import { Articles } from './payload/collections/Articles'
import { FAQItems } from './payload/collections/FAQItems'
import { Markets } from './payload/collections/Markets'
import { Media } from './payload/collections/Media'

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [Articles, FAQItems, Markets, Media],
  editor: slateEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/caseport',
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})
