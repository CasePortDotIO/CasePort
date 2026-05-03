import 'dotenv/config'
import payload from 'payload'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Articles } from '../src/collections/Articles.js'
import { Authors } from '../src/collections/Authors.js'
import { Categories } from '../src/collections/Categories.js'
import { Users } from '../src/collections/Users.js'
import { Media } from '../src/collections/Media.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const seedConfig = buildConfig({
  admin: { user: Users.slug },
  collections: [Users, Media, Categories, Authors, Articles],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '1eea6729ab53a2e3861e5a18',
  db: mongooseAdapter({ url: process.env.DATABASE_URL }),
  typescript: { outputFile: path.resolve(__dirname, 'src/payload-types.ts') },
})
await payload.init({ config: seedConfig })
const authors = await payload.find({ collection: 'authors', limit: 5, depth: 0 })
const categories = await payload.find({ collection: 'categories', limit: 5, depth: 0 })
const media = await payload.find({ collection: 'media', limit: 5, depth: 0 })
console.log('AUTHORS:', JSON.stringify(authors.docs.map((a) => ({ id: a.id, name: a.name, title: a.title }))))
console.log('CATEGORIES:', JSON.stringify(categories.docs.map((c) => ({ id: c.id, title: c.title }))))
console.log('MEDIA:', JSON.stringify(media.docs.map((m) => ({ id: m.id, filename: m.filename }))))