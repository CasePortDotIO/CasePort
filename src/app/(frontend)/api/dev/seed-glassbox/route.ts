import config from '@payload-config'
import { getPayload } from 'payload'
import { createWalletService } from '@/services/WalletService'
import { createPayloadWalletDeps } from '@/services/adapters/payloadWallet'

/**
 * Development seed for the Glass Box dashboard. Creates a live market, a founding
 * firm with a price table, funds the wallet with real Stripe-style credits
 * through the WalletService, and seeds a few redacted market dossiers so the
 * dashboard shows live, auditable data.
 *
 * Guarded: requires ?secret= matching SEED_SECRET, or runs only outside
 * production. This is a demo convenience, never a production data path.
 */
export async function POST(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  const allowed =
    process.env.NODE_ENV !== 'production' ||
    (process.env.SEED_SECRET && secret === process.env.SEED_SECRET)
  if (!allowed) {
    return Response.json({ error: 'seeding not allowed' }, { status: 403 })
  }

  const payload = await getPayload({ config })

  // 1. Find or create a live Atlanta market.
  const existingMarket = await payload.find({
    collection: 'markets',
    where: { slug: { equals: 'atlanta-ga' } },
    limit: 1,
  })
  let marketId: string
  if (existingMarket.docs[0]) {
    marketId = String(existingMarket.docs[0].id)
    await payload.update({ collection: 'markets', id: marketId, data: { liveForIntake: true, marketType: 'single-firm-exclusive', marketTier: 'premium' } as never })
  } else {
    const market = await payload.create({
      collection: 'markets',
      data: {
        metro: 'Atlanta', slug: 'atlanta-ga', state: 'GA', status: 'active',
        mii: 88, casesAcquiredYearly: 1200, partnersActive: 1, maxPartners: 1,
        population: '6.1M+', monthlySearchVolume: '18,000+', responseTime: '15 mins',
        activatedDate: new Date().toISOString(),
        avgSettlement: '$285K-$420K', avgCaseValue: '$350K',
        heroHeadline: 'Personal injury case flow in Atlanta.',
        heroSubline: 'Exclusive, worked-up personal injury cases delivered inside the golden window.',
        faqs: [{ question: 'How are cases delivered?', answer: 'As a worked-up dossier inside the golden window.' }],
        marketType: 'single-firm-exclusive', marketTier: 'premium', liveForIntake: true, partnerCap: 1,
      } as never,
    })
    marketId = String(market.id)
  }

  // 2. Find or create the founding firm with a price table.
  const existingFirm = await payload.find({ collection: 'firms', where: { name: { equals: 'Peachtree Injury Partners' } }, limit: 1 })
  let firmId: string
  if (existingFirm.docs[0]) {
    firmId = String(existingFirm.docs[0].id)
  } else {
    const firm = await payload.create({
      collection: 'firms',
      data: {
        name: 'Peachtree Injury Partners', assignedMarket: marketId,
        email: 'partner@peachtreeinjury.example', phone: '(404) 555-0142',
        foundingPartner: true, slaCallbackMinutes: 15, status: 'active',
        priceTable: [
          { caseType: 'motor-vehicle-accident', feeCents: 90000 },
          { caseType: 'commercial-trucking-accident', feeCents: 180000 },
          { caseType: 'premises-liability', feeCents: 84000 },
          { caseType: 'medical-malpractice', feeCents: 250000 },
          { caseType: 'wrongful-death', feeCents: 300000 },
          { caseType: 'dog-bite', feeCents: 54000 },
        ],
      } as never,
    })
    firmId = String(firm.id)
  }

  // 3. Fund the wallet through the WalletService (real ledger credits).
  const wallet = createWalletService(createPayloadWalletDeps(payload))
  await wallet.topUp({ firmId, amountCents: 5000000, idempotencyKey: `seed_${firmId}_1`, stripeRef: 'seed_topup_1' })
  await wallet.topUp({ firmId, amountCents: 2500000, idempotencyKey: `seed_${firmId}_2`, stripeRef: 'seed_topup_2' })

  // 4. Seed a few redacted dossiers as market activity.
  const seededActivity = await payload.count({ collection: 'dossiers', where: { market: { equals: marketId } } })
  if (seededActivity.totalDocs < 3) {
    const claimant = await payload.create({ collection: 'claimants', data: { firstName: 'Sample', lastName: 'Claimant', marketZip: '30303' } as never })
    const types = ['motor-vehicle-accident', 'premises-liability', 'commercial-trucking-accident']
    for (let i = 0; i < types.length; i++) {
      await payload.create({
        collection: 'dossiers',
        data: {
          claimant: String(claimant.id), market: marketId, caseType: types[i] as never, status: 'received',
          plainLanguageSummary: 'Organized from what the claimant told us, for a firm in their area to review.',
          protectionPlan: [{ step: 'Keep every medical appointment.' }],
          receivedAt: new Date(Date.now() - i * 86400000).toISOString(),
        } as never,
      })
    }
  }

  const balance = await wallet.balance(firmId)
  return Response.json({
    ok: true,
    firmId,
    marketId,
    walletBalanceCents: balance,
    dashboardUrl: `/firm/${firmId}`,
    glassBoxApi: `/api/firm/${firmId}/glassbox`,
  })
}
