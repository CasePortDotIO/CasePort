import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * PATCH /api/injured-leads-mark-seen
 * Marks all unseen injured-leads documents as seen.
 */
export async function PATCH(req: Request) {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'injured-leads',
      where: { seen: { equals: false } },
      limit: 0,
      depth: 0,
    })

    await Promise.all(
      docs.map((doc) =>
        payload.update({
          collection: 'injured-leads',
          id: doc.id,
          data: { seen: true },
        }),
      ),
    )

    return Response.json({ updated: docs.length })
  } catch (err) {
    console.error('injured-leads-mark-seen error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
