import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * PATCH /api/intelligence-mark-seen
 * Marks all unseen intelligence-briefs documents as seen.
 */
export async function PATCH(req: Request) {
  try {
    const payload = await getPayload({ config })

    // Find all unseen subscribers
    const { docs } = await payload.find({
      collection: 'intelligence-briefs',
      where: { seen: { equals: false } },
      limit: 0,
      depth: 0,
    })

    // Bulk mark each as seen
    await Promise.all(
      docs.map((doc) =>
        payload.update({
          collection: 'intelligence-briefs',
          id: doc.id,
          data: { seen: true },
        }),
      ),
    )

    return Response.json({ marked: docs.length }, { status: 200 })
  } catch (error) {
    console.error('Mark seen error:', error)
    return Response.json({ error: 'Failed to mark as seen' }, { status: 500 })
  }
}
