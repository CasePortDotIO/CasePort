import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, role, market } = body

    if (!email || !role || !market) {
      return Response.json({ error: 'email, role, and market are required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check for duplicate subscription
    const existing = await payload.find({
      collection: 'intelligence-briefs',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      // Already subscribed — redirect gracefully
      return Response.json({ ok: true }, { status: 200 })
    }

    await payload.create({
      collection: 'intelligence-briefs',
      data: { email, role, market, status: 'active' },
    })

    return Response.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('Intelligence subscribe error:', error)
    return Response.json({ error: 'Subscription failed' }, { status: 500 })
  }
}

