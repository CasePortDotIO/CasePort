import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * PATCH /api/applications-mark-seen
 * Marks all unseen applications documents as seen.
 */
export async function PATCH(req: Request) {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'applications',
      where: { seen: { equals: false } },
      limit: 0,
      depth: 0,
    })

    await Promise.all(
      docs.map((doc) =>
        payload.update({
          collection: 'applications',
          id: doc.id,
          data: { seen: true },
        }),
      ),
    )

    return Response.json({ updated: docs.length })
  } catch (err) {
    console.error('applications-mark-seen error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
