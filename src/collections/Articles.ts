import type { CollectionConfig, FieldHook } from 'payload'

// ─── Lexical Content Helpers ───────────────────────────────────────────────

const extractTextFromRichText = (nodes: any[]): string => {
  if (!Array.isArray(nodes)) return ''
  let text = ''
  for (const node of nodes) {
    if (node.type === 'text' && node.text) {
      text += node.text + ' '
    } else if (node.children) {
      text += extractTextFromRichText(node.children) + ' '
    }
  }
  return text
}

const countHeadingsInLexical = (nodes: any[], tag: string): number => {
  let count = 0
  for (const node of nodes) {
    if (node.type === 'heading' && node.tag === tag) count++
    if (node.children) count += countHeadingsInLexical(node.children, tag)
  }
  return count
}

// ─── Score Generators ────────────────────────────────────────────────────────

const generateAeoScore: FieldHook = async ({ data }) => {
  let score = 0
  const d = data || {}

  const directAnswer = d.directAnswer || ''
  if (directAnswer.length >= 40) {
    if (directAnswer.toLowerCase().includes('caseport')) {
      score += 25
    } else {
      score += 12
    }
  }

  const aiSummary = d.aiCitationSummary || ''
  if (aiSummary.length >= 80) score += 15

  const faqs = d.faqSection || []
  const validFaqs = faqs.filter((f: any) => f.question && f.answer && f.answer.length >= 40).length
  if (validFaqs >= 4) score += 20
  else if (validFaqs >= 2) score += 10
  else if (validFaqs === 1) score += 5

  const stats = d.keyStatistics || []
  const validStats = stats.filter((s: any) => s.text && s.sourceName).length
  if (validStats >= 3) score += 15
  else if (validStats === 2) score += 10
  else if (validStats === 1) score += 5

  const voiceAnswer = d.voiceAnswer || ''
  const words = voiceAnswer.split(' ').filter(Boolean).length
  if (voiceAnswer.length >= 10 && words < 35) score += 10

  const terms = d.termDefinitions || []
  if (terms.length >= 2) score += 5

  const metaTitle = d.metaTitle || ''
  const metaDesc = d.metaDescription || ''
  if (metaTitle.length > 0 && metaDesc.length > 0) score += 5

  const quotes = d.expertQuotes || []
  const validQuotes = quotes.filter((q: any) => q.speakerName && q.quote).length
  if (validQuotes >= 1) score += 5

  return score
}

const calculateReadTime: FieldHook = async ({ data }) => {
  if (!data?.content?.root?.children) return 0
  const text = extractTextFromRichText(data.content.root.children)
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200) || 1
}

const generateSeoScore = async (d: any, heroImageAlt = ''): Promise<number> => {
  let score = 0

  const keyword = (d.focusKeyword ?? '').toLowerCase().trim()
  const title = (d.title ?? '').toLowerCase()
  const metaTitle = d.metaTitle ?? ''
  const metaDesc = d.metaDescription ?? ''
  const slug = (d.slug ?? '').toLowerCase()

  const bodyText = d.content?.root?.children
    ? extractTextFromRichText(d.content.root.children).toLowerCase().slice(0, 300)
    : ''
  // Use passed heroImageAlt if available, otherwise fall back to inline object check
  const altText = heroImageAlt ?? (typeof d.heroImage === 'object' ? (d.heroImage?.alt ?? '') : '')
  const related = d.relatedArticles ?? []
  const secondary = d.secondaryKeywords ?? []

  const mt = metaTitle.trim().length
  if (mt >= 50 && mt <= 60) score += 15
  else if (mt >= 45 && mt <= 65) score += 7

  const md = metaDesc.trim().length
  if (md >= 140 && md <= 160) score += 15
  else if (md >= 120 && md <= 170) score += 7

  if (keyword && title.includes(keyword)) score += 15
  if (keyword && bodyText.includes(keyword)) score += 10
  if (keyword && slug.includes(keyword.replace(/\s+/g, '-'))) score += 10
  if (altText.trim().length > 10) score += 10
  if (related.length >= 3) score += 10
  else if (related.length >= 1) score += 5
  if (secondary.length >= 4) score += 10
  else if (secondary.length >= 2) score += 5

  const fullBody = d.content?.root?.children
    ? extractTextFromRichText(d.content.root.children).toLowerCase()
    : ''
  if (keyword && fullBody.includes(keyword)) score += 5

  return Math.min(score, 100)
}

const calculateNextReviewDue: FieldHook = async ({ data }) => {
  if (!data?.publishedDate || !data?.reviewCycle) return null
  const pubDate = new Date(data.publishedDate)
  if (isNaN(pubDate.getTime())) return null

  if (data.reviewCycle === '3months') pubDate.setMonth(pubDate.getMonth() + 3)
  else if (data.reviewCycle === '6months') pubDate.setMonth(pubDate.getMonth() + 6)
  else if (data.reviewCycle === '12months') pubDate.setMonth(pubDate.getMonth() + 12)
  else if (data.reviewCycle === 'evergreen') return null

  return pubDate.toISOString()
}

// ─── Auto-Calculate GEO Score ─────────────────────────────────────────────────

const calculateGeoScore = (data: any): number => {
  let score = 0
  if (data.geoOptimization?.targetStates?.length > 0) score += 30
  if (data.geoOptimization?.targetCities?.length > 0) score += 20
  if (data.geoOptimization?.stateSpecificDeadline) score += 20
  if (data.geoOptimization?.tollingProvisions?.length > 0) score += 30
  return Math.min(score, 100)
}

// ─── Auto-Calculate SGE Score ─────────────────────────────────────────────────

const calculateSgeScore = (data: any): number => {
  let score = 0
  if (data.sgeOptimization?.sgeOptimizedAnswer?.length > 40) score += 40
  if (data.sgeOptimization?.uniqueContentSignals?.length > 0) score += 30
  if (data.sgeOptimization?.freshnessSignal) score += 20
  if (data.sgeOptimization?.competitorComparison) score += 10
  return Math.min(score, 100)
}

// ─── Auto-Calculate Voice Search Score ──────────────────────────────────────

const calculateVoiceScore = (data: any): number => {
  let score = 0
  if (data.voiceAnswer?.length > 30) score += 40
  if (data.speakableCssSelectors?.length > 0) score += 30
  if (data.conversationalQueryVariants?.length > 0) score += 30
  return Math.min(score, 100)
}

// ─── Content Quality Score ────────────────────────────────────────────────────

const calculateContentQualityScore = (data: any, h2Count: number, h3Count: number): number => {
  let score = 0
  if (h2Count >= 3) score += 10
  if (h3Count >= 6) score += 10
  if (data.directAnswer?.length > 40) score += 10
  if ((data.faqSection?.length || 0) >= 5) score += 10
  if (data.sgeOptimization?.sgeOptimizedAnswer?.length > 40) score += 10
  if (data.sgeOptimization?.uniqueContentSignals?.length > 0) score += 5
  if (data.geoOptimization?.targetStates?.length > 0) score += 8
  if (data.geoOptimization?.stateSpecificDeadline) score += 7
  if (data.voiceAnswer?.length > 30) score += 10
  if (data.speakableCssSelectors?.length > 0) score += 5
  if (data.expertReviewer) score += 8
  if ((data.externalSources?.length || 0) > 0) score += 7
  return Math.min(score, 100)
}

// ─── Featured Snippet Score ───────────────────────────────────────────────────

const calculateSnippetScore = (data: any): number => {
  let score = 0
  if (data.featuredSnippetOptimization?.snippetContent?.length > 40) score += 50
  if (data.featuredSnippetOptimization?.targetSnippetType) score += 30
  if (
    data.featuredSnippetOptimization?.currentSnippetRank &&
    data.featuredSnippetOptimization.currentSnippetRank <= 3
  )
    score += 20
  return Math.min(score, 100)
}

// ─── Content Freshness ────────────────────────────────────────────────────────

const calculateFreshness = (
  data: any,
): { daysOld: number; freshnessStatus: string; nextReviewDue: Date } => {
  const lastReviewRaw = data.contentFreshness?.lastReviewDate || data.updatedAt
  const lastReview = new Date(lastReviewRaw)
  const today = new Date()

  // Handle invalid date case (new document with no dates yet)
  if (isNaN(lastReview.getTime())) {
    return {
      daysOld: 0,
      freshnessStatus: 'fresh',
      nextReviewDue: new Date(),
    }
  }

  const daysOld = Math.floor((today.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24))

  let freshnessStatus = 'fresh'
  if (daysOld > 180) freshnessStatus = 'stale'
  else if (daysOld > 90) freshnessStatus = 'aging'
  else if (daysOld > 30) freshnessStatus = 'current'

  const nextReviewDue = new Date(lastReview.getTime() + 90 * 24 * 60 * 60 * 1000)

  return { daysOld, freshnessStatus, nextReviewDue }
}

// ─── Collection Config ─────────────────────────────────────────────────────────

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedDate', 'aeoScore', 'seoScore'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc.slug) {
          doc._previewUrl = `/api/preview?slug=${doc.slug}`
        }
        return doc
      },
    ],
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title
        if (!data?.slug && data?.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }
        return data
      },
      // HOOK 1: Content Validation (only when publishing, not for drafts)
      async ({ data }) => {
        if (!data || data._isSeeding) return

        // Skip validation for drafts — only validate when publishing
        if (data._status !== 'published') return data

        const issues: string[] = []

        // ── Required field checks ──────────────────────────────────────
        if (!data.title?.trim()) issues.push('Title is required')
        else if (data.title.length < 10) issues.push(`Title too short (${data.title.length}/10 chars)`)
        if (!data.slug?.trim()) issues.push('Slug is required')
        if (!data.author) issues.push('Author is required — select an author')
        if (!data.category) issues.push('Category/Content Pillar is required — select one')
        if (!data.heroImage) issues.push('Hero Image is required — upload one')
        if (!data.excerpt?.trim()) issues.push('Excerpt is required')
        else if (data.excerpt.length < 50) issues.push(`Excerpt too short (${data.excerpt.length}/50 chars)`)
        if (!data.contentFormat) issues.push('Content Format is required — select one')
        if (!data.focusKeyword?.trim()) issues.push('Focus Keyword is required')
        if (!data.metaTitle?.trim()) issues.push('Meta Title is required')
        else if (data.metaTitle.length > 60) issues.push(`Meta Title too long (${data.metaTitle.length}/60 chars)`)
        if (!data.metaDescription?.trim()) issues.push('Meta Description is required')
        else if (data.metaDescription.length < 120) issues.push(`Meta Description too short (${data.metaDescription.length}/120 chars)`)
        if (!data.directAnswer?.trim()) issues.push('Direct Answer (AEO) is required')
        else if (data.directAnswer.length < 40) issues.push(`Direct Answer: ${data.directAnswer.length}/40 chars`)
        if (!data.voiceAnswer?.trim()) issues.push('Voice Answer is required')
        if (!data.schemaType) issues.push('Schema Type is required — select one')
        if (!data.legalDisclaimer) issues.push('Legal Disclaimer is required')

        // ── Array min rows ─────────────────────────────────────────────
        const keyTakeaways = data.keyTakeaways || []
        if (keyTakeaways.length < 3) issues.push(`Key Takeaways: ${keyTakeaways.length}/3 — add ${3 - keyTakeaways.length} more`)
        const relatedArticles = data.relatedArticles || []
        if (relatedArticles.length < 3) issues.push(`Related Articles: ${relatedArticles.length}/3 — link ${3 - relatedArticles.length} more articles`)
        const secondaryKeywords = data.secondaryKeywords || []
        if (secondaryKeywords.length < 2) issues.push(`Secondary Keywords: ${secondaryKeywords.length}/2 — add ${2 - secondaryKeywords.length} more`)
        const keyStats = data.keyStatistics || []
        if (keyStats.length < 2) issues.push(`Key Statistics: ${keyStats.length}/2 — add ${2 - keyStats.length} more`)
        const faqs = data.faqSection || []
        if (faqs.length < 5) issues.push(`FAQ items: ${faqs.length}/5 — add ${5 - faqs.length} more`)
        const sameAsUrls = data.sameAsEntityUrls || []
        if (sameAsUrls.length < 1) issues.push('At least 1 Same-As URL is required')
        const extSources = data.externalSources || []
        if (extSources.length < 1) issues.push('At least 1 External Source is required')
        const speakable = data.speakableCssSelectors || []
        if (speakable.length < 1) issues.push('At least 1 Speakable CSS Selector is required')

        // ── Rich text content ──────────────────────────────────────────
        const contentNodes = data.content?.root?.children || []
        const bodyText = extractTextFromRichText(contentNodes)
        if (!data.content || bodyText.length < 50) issues.push('Article content is required')
        else {
          if (bodyText.length < 2000) issues.push(`Content too short (${bodyText.length}/2000 chars)`)
          const h2Count = countHeadingsInLexical(contentNodes, 'h2')
          const h3Count = countHeadingsInLexical(contentNodes, 'h3')
          if (h2Count < 3) issues.push(`H2 Headings: ${h2Count}/3 — add ${3 - h2Count} more`)
          if (h3Count < 6) issues.push(`H3 Headings: ${h3Count}/6 — add ${6 - h3Count} more`)
        }

        // ── SGE / AI ────────────────────────────────────────────────────
        const sgeAnswer = data.sgeOptimizedAnswer || ''
        if (!sgeAnswer.trim()) issues.push('SGE Optimized Answer is required')
        else if (sgeAnswer.length < 40) issues.push(`SGE Answer: ${sgeAnswer.length}/40 chars`)

        // ── GEO ─────────────────────────────────────────────────────────
        // targetStates and targetCities are optional — no validation required

        if (issues.length > 0) {
          throw new Error(issues.join(' | '))
        }

        return data
      },
    ],
    beforeChange: [
      // HOOK 1: Calculate scores on EVERY save (not just publish)
      async ({ data, operation }) => {
        if (data._isSeeding) return data

        // Auto-set publishedDate on first publish
        if (operation === 'update' && data._status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
        }

        try {
          data.aeoScore = await generateAeoScore({ data } as any)
          data.readTime = await calculateReadTime({ data } as any)
          data.nextReviewDue = await calculateNextReviewDue({ data } as any)
        } catch (err) {
          console.error('Score calculation error:', err)
        }

        return data
      },
      // HOOK 2: Auto-Calculate Dominance Scores on EVERY save
      async ({ data, req }) => {
        if (data._isSeeding) return data
        try {
          const contentNodes = data.content?.root?.children || []
          const h2Count = countHeadingsInLexical(contentNodes, 'h2')
          const h3Count = countHeadingsInLexical(contentNodes, 'h3')
          const bodyText = extractTextFromRichText(contentNodes)

          // Resolve hero image alt text when stored as ObjectId
          let heroImageAlt = ''
          if (typeof data.heroImage === 'object' && data.heroImage?.alt) {
            heroImageAlt = data.heroImage.alt
          } else if (typeof data.heroImage === 'string') {
            try {
              const mediaDoc = await req.payload.findByID({
                collection: 'media',
                id: data.heroImage,
              })
              heroImageAlt = mediaDoc?.alt ?? ''
            } catch {
              // Media lookup failed — alt stays empty
            }
          }

          // GEO Score
          const geoScore = calculateGeoScore(data)

          // SGE Score
          const sgeScore = calculateSgeScore(data)

          // Voice Search Score
          const voiceScore = calculateVoiceScore(data)

          // Existing scores — pass resolved alt text
        const seoScore = await generateSeoScore(data, heroImageAlt)
        const aeoScore = data.aeoScore || 0

        // Overall Dominance Score
        const overallScore = Math.round(
          seoScore * 0.25 + aeoScore * 0.25 + geoScore * 0.25 + sgeScore * 0.15 + voiceScore * 0.1,
        )

        // Dominance Rank
        let dominanceRank = 'critical'
        if (overallScore >= 80) dominanceRank = 'dominant'
        else if (overallScore >= 60) dominanceRank = 'strong'
        else if (overallScore >= 40) dominanceRank = 'weak'

        // Competitive Advantage Score
        let competitiveAdvantageScore = 0
        if (data.competitorAnalysis?.uniqueAdvantages?.length > 0) {
          competitiveAdvantageScore = Math.min(
            50 + data.competitorAnalysis.uniqueAdvantages.length * 10,
            100,
          )
        }

        // Set dominanceScoring group
        data.dominanceScoring = {
          seoScore,
          aeoScore,
          geoScore,
          sgeScore,
          voiceSearchScore: voiceScore,
          overallDominanceScore: overallScore,
          dominanceRank,
          competitiveAdvantageScore,
        }

        // Also update the top-level seoScore so sidebar and dominance tab match
        data.seoScore = seoScore

        // Content Quality Score
        data.contentQualityScore = calculateContentQualityScore(data, h2Count, h3Count)

        // Content Validation
        data.contentValidation = {
          contentLength: bodyText.length,
          h2Count,
          h3Count,
          faqCount: data.faqSection?.length || 0,
          validationStatus:
            data.contentQualityScore >= 80
              ? 'pass'
              : data.contentQualityScore >= 60
                ? 'warning'
                : 'fail',
          validationErrors: [],
        }

        // Content Freshness
        const freshness = calculateFreshness(data)
        data.contentFreshness = {
          ...(data.contentFreshness || {}),
          daysOld: freshness.daysOld,
          freshnessStatus: freshness.freshnessStatus,
          nextReviewDue: freshness.nextReviewDue,
        }

        // Featured Snippet Score
        const snippetScore = calculateSnippetScore(data)
        data.featuredSnippetOptimization = {
          ...(data.featuredSnippetOptimization || {}),
          snippetOptimizationScore: snippetScore,
        }

        // Auto-generate internal links
        if (data.id) {
          const relatedArticles = await req.payload.find({
            collection: 'articles',
            where: {
              and: [
                { id: { not_equals: data.id } },
                {
                  'geoOptimization.targetStates': { in: data.geoOptimization?.targetStates || [] },
                },
              ],
            },
            limit: 10,
          })

          data.internalLinks = relatedArticles.docs.map((article: any) => ({
            linkedArticleId: article.id,
            anchorText: article.title,
            relevanceScore: 75,
          }))
        }
        } catch (err) {
          console.error('Hook 2 score calc error:', err)
          // Don't crash publish — continue without derived scores
        }

        return data
      },
      // HOOK 3: Semrush Keyword Auto-Enrichment
      async ({ data }) => {
        if (data._isSeeding || !data.focusKeyword) return data

        // Only fetch if keyword fields are missing (not already populated)
        if (typeof data.keywordDifficulty === 'number' && typeof data.monthlySearchVolume === 'number') {
          return data
        }

        try {
          const { getKeywordOverview } = await import('@/lib/semrush')
          const results = await getKeywordOverview(data.focusKeyword)
          if (results && results.length > 0) {
            const kw = results[0]
            if (typeof data.keywordDifficulty !== 'number') {
              data.keywordDifficulty = Math.round(kw.phrasedifficulty)
            }
            if (typeof data.monthlySearchVolume !== 'number') {
              data.monthlySearchVolume = kw.vol
            }
          }
        } catch (err) {
          console.error('Semrush keyword enrichment error:', err)
        }

        return data
      },
      // HOOK 4: Conversion Funnel Rates
      async ({ data }) => {
        if (!data || data._status !== 'published') return
        const visitors = data.conversionFunnel?.uniqueVisitors || 1
        const forms = data.conversionFunnel?.formSubmissions || 0
        const leads = data.conversionFunnel?.confirmedLeads || 0
        const cases = data.conversionFunnel?.confirmedCases || 0

        data.conversionFunnel = {
          ...(data.conversionFunnel || {}),
          visitorToFormRate: Math.round((forms / visitors) * 100),
          formToLeadRate: forms > 0 ? Math.round((leads / forms) * 100) : 0,
          leadToCaseRate: leads > 0 ? Math.round((cases / leads) * 100) : 0,
        }

        return data
      },
    ],
    afterChange: [
      // Existing hook: revalidatePath
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/insights')
          if (doc.slug) {
            revalidatePath(`/insights/${doc.slug}`)
          }
        } catch {
          // If we are not in a Next.js server context, quietly ignore
        }
      },
      // HOOK 3: Performance Metrics
      // Note: formSubmissions and cases collections must exist for this to work
      async ({ doc, req }) => {
        if (doc._status !== 'published') return
        try {
          const formSubmissions = await req.payload.find({
            collection: 'formSubmissions' as unknown as any,
            where: { article: { equals: doc.id } },
            limit: 1000,
          })

          const cases = await req.payload.find({
            collection: 'cases' as unknown as any,
            where: { article: { equals: doc.id } },
            limit: 1000,
          })

          const totalSubmissions = formSubmissions.totalDocs || 0
          const totalCases = cases.totalDocs || 0
          const conversionRate =
            totalSubmissions > 0 ? Math.round((totalCases / totalSubmissions) * 100) : 0

          let avgLeadQuality = 0
          if (formSubmissions.docs.length > 0) {
            const qualityScores = formSubmissions.docs.map((d: any) => d.leadQualityScore || 0)
            avgLeadQuality = Math.round(
              qualityScores.reduce((a: number, b: number) => a + b, 0) / qualityScores.length,
            )
          }

          const totalRevenue = cases.docs.reduce(
            (sum: number, c: any) => sum + (c.caseValue || 0) * 0.33,
            0,
          )
          const productionCost = doc.productionCost || 500
          const monthlyMaintenance = doc.monthlyMaintenance || 50
          const totalCost = productionCost + monthlyMaintenance * 12
          const profit = totalRevenue - totalCost
          const roi = totalCost > 0 ? Math.round((profit / totalCost) * 100) : 0

          let performanceStatus = 'loss'
          if (profit >= 5000) performanceStatus = 'highly_profitable'
          else if (profit >= 1000) performanceStatus = 'profitable'
          else if (profit >= 0) performanceStatus = 'breakeven'

          let recommendedAction = 'remove'
          if (performanceStatus === 'highly_profitable') recommendedAction = 'expand'
          else if (performanceStatus === 'profitable') recommendedAction = 'maintain'
          else if (performanceStatus === 'breakeven') recommendedAction = 'optimize'

          await req.payload.update({
            collection: 'articles',
            id: doc.id,
            data: {
              performanceMetrics: {
                totalFormSubmissions: totalSubmissions,
                totalEmailCaptures: 0,
                averageLeadQualityScore: avgLeadQuality,
                leadToCaseConversionRate: conversionRate,
                estimatedRevenue: Math.round(totalRevenue),
                estimatedProfit: Math.round(profit),
                roi,
                performanceStatus: performanceStatus as any,
                recommendedAction: recommendedAction as any,
              },
            },
          })
        } catch {
          // If formSubmissions or cases collections don't exist, quietly ignore
        }
      },
      // HOOK 5: Search Engine Submission (Bing IndexNow + Google Indexing)
      async ({ doc, req, operation }) => {
        if ((operation === 'create' || operation === 'update') && doc.published === true) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'
          const articleUrl = `${siteUrl}/insights/${doc.slug}`

          // Submit to Bing IndexNow
          if (!doc.searchEngineSubmission?.bingSubmitted) {
            const bingApiKey = process.env.BING_INDEXNOW_API_KEY
            let bingMessage = 'Not submitted - API key not configured'
            let bingSuccess = false

            if (bingApiKey) {
              try {
                const urlObj = new URL(siteUrl)
                const host = urlObj.hostname

                const response = await fetch('https://www.bing.com/indexnow', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    host,
                    key: bingApiKey,
                    urlList: [articleUrl],
                  }),
                })

                if (response.ok) {
                  bingSuccess = true
                  bingMessage = `Submitted to Bing IndexNow at ${new Date().toISOString()}`
                } else {
                  const errorText = await response.text()
                  bingMessage = `Bing returned ${response.status}: ${errorText}`
                }
              } catch (error) {
                bingMessage = `Bing submission error: ${error instanceof Error ? error.message : 'Unknown'}`
              }
            }

            await req.payload.update({
              collection: 'articles',
              id: doc.id,
              data: {
                searchEngineSubmission: {
                  googleSubmitted: doc.searchEngineSubmission?.googleSubmitted || false,
                  googleSubmissionTime: doc.searchEngineSubmission?.googleSubmissionTime || null,
                  googleSubmissionMessage: doc.searchEngineSubmission?.googleSubmissionMessage || '',
                  bingSubmitted: bingSuccess,
                  bingSubmissionTime: bingSuccess ? new Date().toISOString() : null,
                  bingSubmissionMessage: bingMessage,
                },
              },
            })
          }
        }
      },
      // HOOK 6: Existing Hooks — verify these functions exist in your codebase
      // async ({ doc }) => {
      //   await revalidateSitemap()
      //   await pingIndexNow()
      //   await requestGoogleIndex(doc.slug)
      //   await revalidateIndex()
      // },
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── Existing Tabs ────────────────────────────────────────────────────
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: { description: '50-80 chars. Auto slug.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'currentReaders',
                  type: 'number',
                  defaultValue: 1247,
                  admin: { description: 'Live reading now counter' },
                },
                {
                  name: 'citationCount',
                  type: 'number',
                  defaultValue: 47,
                  admin: { description: 'Cited by X firms' },
                },
                {
                  name: 'signalStrength',
                  type: 'number',
                  min: 0,
                  max: 100,
                  defaultValue: 94,
                  admin: { description: 'Signal Strength (0-100)' },
                },
              ],
            },
            { name: 'slug', type: 'text', index: true },
            { name: 'author', type: 'relationship', relationTo: 'authors' },
            {
              name: 'category',
              label: 'Content Pillar',
              type: 'relationship',
              relationTo: 'categories',
            },
            {
              name: 'contentFormat',
              type: 'select',
              options: [
                'Pillar Page',
                'Cluster Article',
                'FAQ Article',
                'How-To Guide',
                'News',
                'Research Report',
                'Case Study',
                'Comparison',
                'Definition',
              ],
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'excerpt', type: 'textarea', maxLength: 300 },
            { name: 'subtitle', type: 'text' },
            { name: 'executiveSummary', type: 'textarea' },
            {
              name: 'keyTakeaways',
              type: 'array',
              fields: [{ name: 'point', type: 'text' }],
            },
            {
              name: 'roiTable',
              type: 'group',
              admin: {
                description: 'Customizable Table with editable headers and rows for ROI matrix.',
              },
              fields: [
                {
                  name: 'enableTable',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Include this table in the article?',
                },
                { name: 'tableName', type: 'text', defaultValue: 'ROI Calculator Matrix' },
                {
                  name: 'headers',
                  type: 'group',
                  fields: [
                    {
                      name: 'col1',
                      type: 'text',
                      required: true,
                      defaultValue: 'Monthly lead spend',
                    },
                    { name: 'col2', type: 'text', required: true, defaultValue: 'Leads/month' },
                    {
                      name: 'col3',
                      type: 'text',
                      required: true,
                      defaultValue: 'Current sign rate',
                    },
                    {
                      name: 'col4',
                      type: 'text',
                      required: true,
                      defaultValue: 'Additional cases/month at 5-min response',
                    },
                    {
                      name: 'col5',
                      type: 'text',
                      required: true,
                      defaultValue: 'Additional annual revenue',
                    },
                  ],
                },
                {
                  name: 'rows',
                  type: 'array',
                  fields: [
                    { name: 'col1', type: 'text', label: 'Column 1' },
                    { name: 'col2', type: 'text', label: 'Column 2' },
                    { name: 'col3', type: 'text', label: 'Column 3' },
                    { name: 'col4', type: 'text', label: 'Column 4' },
                    { name: 'col5', type: 'text', label: 'Column 5' },
                  ],
                },
              ],
            },
            { name: 'content', type: 'richText' },
            { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
            {
              name: 'relatedArticles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
            },
          ],
        },
        {
          label: 'SEO Core',
          fields: [
            { name: 'focusKeyword', type: 'text' },
            { name: 'keywordDifficulty', type: 'number', min: 0, max: 100 },
            { name: 'monthlySearchVolume', type: 'number' },
            { name: 'currentRankingPosition', type: 'number' },
            {
              name: 'secondaryKeywords',
              type: 'array',
              fields: [{ name: 'keyword', type: 'text' }],
            },
            { name: 'metaTitle', type: 'text', maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', maxLength: 160 },
            { name: 'canonicalUrl', type: 'text' },
            { name: 'socialHeadline', type: 'text' },
            { name: 'socialDescription', type: 'textarea' },
            { name: 'socialShareImage', type: 'upload', relationTo: 'media' },
            { name: 'xCardType', type: 'select', options: ['summary_large_image', 'summary'] },
            { name: 'xCardTitle', type: 'text' },
            { name: 'xCardDescription', type: 'textarea' },
            { name: 'xCardImage', type: 'upload', relationTo: 'media' },
            { name: 'competingUrl', type: 'text' },
            { name: 'contentGap', type: 'array', fields: [{ name: 'gap', type: 'text' }] },
          ],
        },
        {
          label: 'AEO and AI Citation',
          fields: [
            { name: 'directAnswer', type: 'textarea' },
            { name: 'aiCitationSummary', type: 'textarea' },
            { name: 'primaryAiQuery', type: 'text' },
            {
              name: 'keyStatistics',
              type: 'array',
              fields: [
                { name: 'text', type: 'text' },
                { name: 'sourceName', type: 'text' },
                { name: 'sourceUrl', type: 'text' },
                { name: 'year', type: 'text' },
              ],
            },
            {
              name: 'faqSection',
              type: 'array',
              fields: [
                { name: 'question', type: 'text' },
                { name: 'answer', type: 'textarea' },
              ],
            },
            {
              name: 'termDefinitions',
              type: 'array',
              fields: [
                { name: 'term', type: 'text' },
                { name: 'definition', type: 'textarea' },
                { name: 'isProprietary', type: 'checkbox' },
              ],
            },
            {
              name: 'expertQuotes',
              type: 'array',
              fields: [
                { name: 'quote', type: 'textarea' },
                { name: 'speakerName', type: 'text' },
                { name: 'credentials', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Voice Search',
          fields: [
            { name: 'voiceAnswer', type: 'textarea' },
            {
              name: 'speakableCssSelectors',
              type: 'array',
              fields: [{ name: 'selector', type: 'text' }],
            },
            {
              name: 'conversationalQueryVariants',
              type: 'array',
              fields: [{ name: 'query', type: 'text' }],
            },
            { name: 'targetsSpecificLocation', type: 'checkbox' },
            {
              name: 'locationTargets',
              type: 'array',
              admin: { condition: (data) => data.targetsSpecificLocation },
              fields: [
                { name: 'state', type: 'text' },
                { name: 'city', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Schema',
          fields: [
            {
              name: 'schemaType',
              type: 'select',
              options: ['Article', 'FAQPage', 'HowTo', 'NewsArticle', 'LegalScholarlyArticle'],
            },
            {
              name: 'howToSteps',
              type: 'array',
              admin: { condition: (data) => data.schemaType === 'HowTo' },
              fields: [
                { name: 'name', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'sameAsEntityUrls',
              type: 'array',
              fields: [{ name: 'url', type: 'text' }],
            },
            { name: 'articleSection', type: 'text' },
            { name: 'apaCitation', type: 'text' },
          ],
        },
        {
          label: 'Authority & Compliance',
          fields: [
            {
              name: 'legalDisclaimer',
              type: 'select',
              options: ['Standard', 'No Legal Advice', 'CasePort Platform', 'None'],
              defaultValue: 'Standard',
            },
            { name: 'abaComplianceVerified', type: 'checkbox' },
            { name: 'expertReviewer', type: 'text' },
            {
              name: 'externalSources',
              type: 'array',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'url', type: 'text' },
                { name: 'credibilityTier', type: 'select', options: ['High', 'Medium', 'Low'] },
              ],
            },
            {
              name: 'pressMentions',
              type: 'array',
              fields: [
                { name: 'source', type: 'text' },
                { name: 'url', type: 'text' },
                { name: 'date', type: 'date' },
              ],
            },
            {
              name: 'ctaOverride',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'primaryLabel', type: 'text' },
                { name: 'primaryUrl', type: 'text' },
                { name: 'secondaryLabel', type: 'text' },
                { name: 'secondaryUrl', type: 'text' },
              ],
            },
            {
              name: 'contentUpdateHistory',
              type: 'array',
              fields: [
                { name: 'date', type: 'date' },
                { name: 'summary', type: 'text' },
                { name: 'updatedBy', type: 'text' },
              ],
            },
          ],
        },

        // ─── New Tabs from Client Spec ─────────────────────────────────────

        // 1. GEO OPTIMIZATION
        {
          label: 'GEO Optimization',
          fields: [
            {
              name: 'targetStates',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Alabama', value: 'AL' },
                { label: 'Alaska', value: 'AK' },
                { label: 'Arizona', value: 'AZ' },
                { label: 'Arkansas', value: 'AR' },
                { label: 'California', value: 'CA' },
                { label: 'Colorado', value: 'CO' },
                { label: 'Connecticut', value: 'CT' },
                { label: 'Delaware', value: 'DE' },
                { label: 'Florida', value: 'FL' },
                { label: 'Georgia', value: 'GA' },
                { label: 'Hawaii', value: 'HI' },
                { label: 'Idaho', value: 'ID' },
                { label: 'Illinois', value: 'IL' },
                { label: 'Indiana', value: 'IN' },
                { label: 'Iowa', value: 'IA' },
                { label: 'Kansas', value: 'KS' },
                { label: 'Kentucky', value: 'KY' },
                { label: 'Louisiana', value: 'LA' },
                { label: 'Maine', value: 'ME' },
                { label: 'Maryland', value: 'MD' },
                { label: 'Massachusetts', value: 'MA' },
                { label: 'Michigan', value: 'MI' },
                { label: 'Minnesota', value: 'MN' },
                { label: 'Mississippi', value: 'MS' },
                { label: 'Missouri', value: 'MO' },
                { label: 'Montana', value: 'MT' },
                { label: 'Nebraska', value: 'NE' },
                { label: 'Nevada', value: 'NV' },
                { label: 'New Hampshire', value: 'NH' },
                { label: 'New Jersey', value: 'NJ' },
                { label: 'New Mexico', value: 'NM' },
                { label: 'New York', value: 'NY' },
                { label: 'North Carolina', value: 'NC' },
                { label: 'North Dakota', value: 'ND' },
                { label: 'Ohio', value: 'OH' },
                { label: 'Oklahoma', value: 'OK' },
                { label: 'Oregon', value: 'OR' },
                { label: 'Pennsylvania', value: 'PA' },
                { label: 'Rhode Island', value: 'RI' },
                { label: 'South Carolina', value: 'SC' },
                { label: 'South Dakota', value: 'SD' },
                { label: 'Tennessee', value: 'TN' },
                { label: 'Texas', value: 'TX' },
                { label: 'Utah', value: 'UT' },
                { label: 'Vermont', value: 'VT' },
                { label: 'Virginia', value: 'VA' },
                { label: 'Washington', value: 'WA' },
                { label: 'West Virginia', value: 'WV' },
                { label: 'Wisconsin', value: 'WI' },
                { label: 'Wyoming', value: 'WY' },
              ],
              label: 'Target States',
              admin: { description: 'Select all states this article targets' },
            },
            {
              name: 'targetCities',
              type: 'select',
              hasMany: true,
              label: 'Target Cities',
              admin: {
                description: 'Select all target cities for this article',
              },
              options: [
                { label: 'Houston, TX', value: 'Houston, TX' },
                { label: 'Dallas, TX', value: 'Dallas, TX' },
                { label: 'Austin, TX', value: 'Austin, TX' },
                { label: 'San Antonio, TX', value: 'San Antonio, TX' },
                { label: 'Fort Worth, TX', value: 'Fort Worth, TX' },
                { label: 'El Paso, TX', value: 'El Paso, TX' },
                { label: 'Arlington, TX', value: 'Arlington, TX' },
                { label: 'Corpus Christi, TX', value: 'Corpus Christi, TX' },
                { label: 'Miami, FL', value: 'Miami, FL' },
                { label: 'Tampa, FL', value: 'Tampa, FL' },
                { label: 'Orlando, FL', value: 'Orlando, FL' },
                { label: 'Jacksonville, FL', value: 'Jacksonville, FL' },
                { label: 'Fort Lauderdale, FL', value: 'Fort Lauderdale, FL' },
                { label: 'St. Petersburg, FL', value: 'St. Petersburg, FL' },
                { label: 'Tallahassee, FL', value: 'Tallahassee, FL' },
                { label: 'Los Angeles, CA', value: 'Los Angeles, CA' },
                { label: 'San Diego, CA', value: 'San Diego, CA' },
                { label: 'San Francisco, CA', value: 'San Francisco, CA' },
                { label: 'Riverside, CA', value: 'Riverside, CA' },
                { label: 'Sacramento, CA', value: 'Sacramento, CA' },
                { label: 'San Jose, CA', value: 'San Jose, CA' },
                { label: 'Fresno, CA', value: 'Fresno, CA' },
                { label: 'Long Beach, CA', value: 'Long Beach, CA' },
                { label: 'New York, NY', value: 'New York, NY' },
                { label: 'Brooklyn, NY', value: 'Brooklyn, NY' },
                { label: 'Queens, NY', value: 'Queens, NY' },
                { label: 'Bronx, NY', value: 'Bronx, NY' },
                { label: 'Albany, NY', value: 'Albany, NY' },
                { label: 'Rochester, NY', value: 'Rochester, NY' },
                { label: 'Syracuse, NY', value: 'Syracuse, NY' },
                { label: 'Buffalo, NY', value: 'Buffalo, NY' },
                { label: 'Chicago, IL', value: 'Chicago, IL' },
                { label: 'Springfield, IL', value: 'Springfield, IL' },
                { label: 'Rockford, IL', value: 'Rockford, IL' },
                { label: 'Philadelphia, PA', value: 'Philadelphia, PA' },
                { label: 'Pittsburgh, PA', value: 'Pittsburgh, PA' },
                { label: 'Allentown, PA', value: 'Allentown, PA' },
                { label: 'Harrisburg, PA', value: 'Harrisburg, PA' },
                { label: 'Scranton, PA', value: 'Scranton, PA' },
                { label: 'Reading, PA', value: 'Reading, PA' },
                { label: 'Columbus, OH', value: 'Columbus, OH' },
                { label: 'Cleveland, OH', value: 'Cleveland, OH' },
                { label: 'Cincinnati, OH', value: 'Cincinnati, OH' },
                { label: 'Dayton, OH', value: 'Dayton, OH' },
                { label: 'Toledo, OH', value: 'Toledo, OH' },
                { label: 'Akron, OH', value: 'Akron, OH' },
                { label: 'Atlanta, GA', value: 'Atlanta, GA' },
                { label: 'Augusta, GA', value: 'Augusta, GA' },
                { label: 'Savannah, GA', value: 'Savannah, GA' },
                { label: 'Macon, GA', value: 'Macon, GA' },
                { label: 'Columbus, GA', value: 'Columbus, GA' },
              ],
            },
            { name: 'jurisdiction', type: 'text', label: 'Primary Jurisdiction' },
            { name: 'serviceAreaDescription', type: 'textarea', label: 'Service Area Description' },
            {
              name: 'localSchemaType',
              type: 'select',
              options: [
                { label: 'LocalBusiness', value: 'LocalBusiness' },
                { label: 'Attorney', value: 'Attorney' },
                { label: 'ServiceArea', value: 'ServiceArea' },
              ],
              label: 'Local Schema Type',
            },
            {
              name: 'stateSpecificDeadline',
              type: 'number',
              label: 'Statute of Limitations (years)',
            },
            {
              name: 'stateSpecificExceptions',
              type: 'textarea',
              label: 'State-Specific Exceptions',
            },
            {
              name: 'tollingProvisions',
              type: 'array',
              label: 'Tolling Provisions',
              fields: [
                { name: 'state', type: 'text', label: 'State' },
                { name: 'tollingRule', type: 'textarea', label: 'Tolling Rule' },
              ],
            },
          ],
        },

        // 2. SGE OPTIMIZATION
        {
          label: 'SGE Optimization',
          fields: [
            {
              name: 'sgeAnswerability',
              type: 'number',
              label: 'SGE Answerability Score (0-100)',
              admin: { readOnly: true },
            },
            {
              name: 'sgeOptimizedAnswer',
              type: 'textarea',
              label: 'SGE Optimized Answer (40-60 words)',
              admin: { description: 'Direct, extractable answer for Google SGE' },
            },
            {
              name: 'uniqueContentSignals',
              type: 'array',
              label: 'Unique Content Signals',
              fields: [
                { name: 'signal', type: 'text', label: 'Signal' },
                { name: 'description', type: 'textarea', label: 'Description' },
              ],
            },
            {
              name: 'freshnessSignal',
              type: 'select',
              options: [
                { label: 'Breaking News', value: 'breaking' },
                { label: 'Recent Update', value: 'recent' },
                { label: 'Evergreen', value: 'evergreen' },
              ],
              label: 'Freshness Signal',
            },
            {
              name: 'competitorComparison',
              type: 'textarea',
              label: 'How is this better than competitors?',
            },
          ],
        },

        // 3. DOMINANCE SCORING
        {
          label: 'Dominance Scoring',
          fields: [
            {
              name: 'dominanceScoring',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                {
                  name: 'seoScore',
                  type: 'number',
                  label: 'SEO Score (0-100)',
                  admin: { readOnly: true },
                },
                {
                  name: 'aeoScore',
                  type: 'number',
                  label: 'AEO Score (0-100)',
                  admin: { readOnly: true },
                },
                {
                  name: 'geoScore',
                  type: 'number',
                  label: 'GEO Score (0-100)',
                  admin: { readOnly: true },
                },
                {
                  name: 'sgeScore',
                  type: 'number',
                  label: 'SGE Score (0-100)',
                  admin: { readOnly: true },
                },
                {
                  name: 'voiceSearchScore',
                  type: 'number',
                  label: 'Voice Search Score (0-100)',
                  admin: { readOnly: true },
                },
                {
                  name: 'overallDominanceScore',
                  type: 'number',
                  label: 'Overall Dominance Score (0-100)',
                  admin: { readOnly: true },
                },
                {
                  name: 'dominanceRank',
                  type: 'select',
                  options: [
                    { label: 'Critical', value: 'critical' },
                    { label: 'Weak', value: 'weak' },
                    { label: 'Strong', value: 'strong' },
                    { label: 'Dominant', value: 'dominant' },
                  ],
                  label: 'Dominance Rank',
                  admin: { readOnly: true },
                },
                {
                  name: 'competitiveAdvantageScore',
                  type: 'number',
                  label: 'Competitive Advantage (0-100)',
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },

        // 4. COMPETITOR ANALYSIS
        {
          label: 'Competitor Analysis',
          fields: [
            {
              name: 'topCompetitors',
              type: 'array',
              label: 'Top 3 Competitors',
              fields: [
                { name: 'url', type: 'text', label: 'URL' },
                { name: 'estimatedScore', type: 'number', label: 'Estimated Score (0-100)' },
                { name: 'yourAdvantage', type: 'textarea', label: 'Your Advantage' },
              ],
            },
            { name: 'competitiveGapAnalysis', type: 'textarea', label: 'Competitive Gap Analysis' },
            {
              name: 'uniqueAdvantages',
              type: 'array',
              label: 'Unique Advantages',
              fields: [{ name: 'advantage', type: 'text' }],
            },
          ],
        },

        // 5. PERFORMANCE METRICS
        {
          label: 'Performance Metrics',
          fields: [
            {
              name: 'performanceMetrics',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'totalFormSubmissions', type: 'number', label: 'Total Form Submissions' },
                { name: 'totalEmailCaptures', type: 'number', label: 'Total Email Captures' },
                {
                  name: 'averageLeadQualityScore',
                  type: 'number',
                  label: 'Average Lead Quality Score (0-100)',
                },
                {
                  name: 'leadToCaseConversionRate',
                  type: 'number',
                  label: 'Lead-to-Case Conversion Rate (%)',
                },
                { name: 'estimatedRevenue', type: 'number', label: 'Estimated Revenue ($)' },
                { name: 'estimatedProfit', type: 'number', label: 'Estimated Profit ($)' },
                { name: 'roi', type: 'number', label: 'ROI (%)' },
                {
                  name: 'performanceStatus',
                  type: 'select',
                  options: [
                    { label: 'Loss', value: 'loss' },
                    { label: 'Breakeven', value: 'breakeven' },
                    { label: 'Profitable', value: 'profitable' },
                    { label: 'Highly Profitable', value: 'highly_profitable' },
                  ],
                  label: 'Performance Status',
                  admin: { readOnly: true },
                },
                {
                  name: 'recommendedAction',
                  type: 'select',
                  options: [
                    { label: 'Remove', value: 'remove' },
                    { label: 'Optimize', value: 'optimize' },
                    { label: 'Maintain', value: 'maintain' },
                    { label: 'Expand', value: 'expand' },
                  ],
                  label: 'Recommended Action',
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },

        // 6. SEARCH ENGINE SUBMISSION
        {
          label: 'Search Engine Submission',
          fields: [
            {
              name: 'searchEngineSubmission',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                {
                  name: 'googleSubmitted',
                  type: 'checkbox',
                  label: 'Submitted to Google Indexing API',
                },
                { name: 'googleSubmissionTime', type: 'date', label: 'Google Submission Time' },
                {
                  name: 'googleSubmissionMessage',
                  type: 'textarea',
                  label: 'Google Submission Response',
                },
                { name: 'bingSubmitted', type: 'checkbox', label: 'Submitted to Bing Webmaster' },
                { name: 'bingSubmissionTime', type: 'date', label: 'Bing Submission Time' },
                {
                  name: 'bingSubmissionMessage',
                  type: 'textarea',
                  label: 'Bing Submission Response',
                },
              ],
            },
          ],
        },

        // 7. ENTITY EXTRACTION
        {
          label: 'Entity Extraction',
          fields: [
            { name: 'primaryEntity', type: 'text', label: 'Primary Entity' },
            {
              name: 'entityDefinition',
              type: 'textarea',
              label: 'Entity Definition (1-2 sentences)',
            },
            {
              name: 'relatedEntities',
              type: 'array',
              label: 'Related Entities',
              fields: [{ name: 'entity', type: 'text' }],
            },
            {
              name: 'entityImportance',
              type: 'select',
              options: [
                { label: 'Critical', value: 'critical' },
                { label: 'Important', value: 'important' },
                { label: 'Supporting', value: 'supporting' },
              ],
              label: 'Entity Importance',
            },
          ],
        },

        // 8. CONTENT VALIDATION
        {
          label: 'Content Validation',
          fields: [
            {
              name: 'contentValidation',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                {
                  name: 'contentLength',
                  type: 'number',
                  label: 'Content Length (characters)',
                  admin: { readOnly: true },
                },
                {
                  name: 'h2Count',
                  type: 'number',
                  label: 'H2 Headings',
                  admin: { readOnly: true },
                },
                {
                  name: 'h3Count',
                  type: 'number',
                  label: 'H3 Headings',
                  admin: { readOnly: true },
                },
                { name: 'faqCount', type: 'number', label: 'FAQ Items', admin: { readOnly: true } },
                {
                  name: 'validationStatus',
                  type: 'select',
                  options: [
                    { label: 'Pass', value: 'pass' },
                    { label: 'Warning', value: 'warning' },
                    { label: 'Fail', value: 'fail' },
                  ],
                  label: 'Validation Status',
                  admin: { readOnly: true },
                },
                {
                  name: 'validationErrors',
                  type: 'array',
                  label: 'Validation Errors',
                  admin: { readOnly: true },
                  fields: [{ name: 'error', type: 'text' }],
                },
              ],
            },
          ],
        },

        // 9. INTERNAL LINKING
        {
          label: 'Internal Linking',
          fields: [
            {
              name: 'internalLinks',
              type: 'array',
              admin: { readOnly: true },
              fields: [
                { name: 'linkedArticleId', type: 'relationship', relationTo: 'articles' },
                { name: 'anchorText', type: 'text', label: 'Anchor Text' },
                { name: 'relevanceScore', type: 'number', label: 'Relevance Score (0-100)' },
              ],
            },
          ],
        },

        // 10. CONTENT FRESHNESS
        {
          label: 'Content Freshness',
          fields: [
            {
              name: 'contentFreshness',
              type: 'group',
              fields: [
                { name: 'lastReviewDate', type: 'date', label: 'Last Review Date' },
                {
                  name: 'nextReviewDue',
                  type: 'date',
                  label: 'Next Review Due',
                  admin: { readOnly: true },
                },
                {
                  name: 'daysOld',
                  type: 'number',
                  label: 'Days Since Last Update',
                  admin: { readOnly: true },
                },
                {
                  name: 'freshnessStatus',
                  type: 'select',
                  options: [
                    { label: 'Fresh (0-30 days)', value: 'fresh' },
                    { label: 'Current (31-90 days)', value: 'current' },
                    { label: 'Aging (91-180 days)', value: 'aging' },
                    { label: 'Stale (180+ days)', value: 'stale' },
                  ],
                  label: 'Freshness Status',
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },

        // 11. FEATURED SNIPPET OPTIMIZATION
        {
          label: 'Featured Snippet Optimization',
          fields: [
            {
              name: 'featuredSnippetOptimization',
              type: 'group',
              fields: [
                {
                  name: 'targetSnippetType',
                  type: 'select',
                  options: [
                    { label: 'Paragraph', value: 'paragraph' },
                    { label: 'List', value: 'list' },
                    { label: 'Table', value: 'table' },
                    { label: 'Definition', value: 'definition' },
                  ],
                  label: 'Target Snippet Type',
                },
                {
                  name: 'snippetContent',
                  type: 'textarea',
                  label: 'Optimized Snippet Content (40-60 words)',
                  admin: { description: 'Content optimized for featured snippet' },
                },
                {
                  name: 'currentSnippetRank',
                  type: 'number',
                  label: 'Current Snippet Position',
                  admin: { description: 'Position in Google featured snippets (if ranked)' },
                },
                {
                  name: 'snippetOptimizationScore',
                  type: 'number',
                  label: 'Snippet Optimization Score (0-100)',
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },

        // 12. BACKLINK TRACKING
        {
          label: 'Backlink Tracking',
          fields: [
            {
              name: 'backlinkTracking',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'totalBacklinks', type: 'number', label: 'Total Backlinks' },
                {
                  name: 'highQualityBacklinks',
                  type: 'number',
                  label: 'High-Quality Backlinks (DA > 50)',
                },
                { name: 'referringDomains', type: 'number', label: 'Referring Domains' },
                { name: 'backlinkGrowth', type: 'number', label: 'Backlink Growth (last 30 days)' },
                { name: 'backlinkLastUpdated', type: 'date', label: 'Last Updated' },
              ],
            },
          ],
        },

        // 13. KEYWORD RANKING TRACKING
        {
          label: 'Keyword Rankings',
          fields: [
            {
              name: 'keywordRankings',
              type: 'array',
              admin: { readOnly: true },
              fields: [
                { name: 'keyword', type: 'text', label: 'Keyword' },
                { name: 'currentRank', type: 'number', label: 'Current Rank' },
                { name: 'previousRank', type: 'number', label: 'Previous Rank' },
                { name: 'rankChange', type: 'number', label: 'Rank Change' },
                { name: 'searchVolume', type: 'number', label: 'Monthly Search Volume' },
                { name: 'lastUpdated', type: 'date', label: 'Last Updated' },
              ],
            },
          ],
        },

        // 14. TRAFFIC & ENGAGEMENT
        {
          label: 'Traffic & Engagement',
          fields: [
            {
              name: 'trafficMetrics',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'monthlyVisitors', type: 'number', label: 'Monthly Visitors' },
                { name: 'bounceRate', type: 'number', label: 'Bounce Rate (%)' },
                {
                  name: 'averageTimeOnPage',
                  type: 'number',
                  label: 'Average Time on Page (seconds)',
                },
                { name: 'scrollDepth', type: 'number', label: 'Average Scroll Depth (%)' },
                {
                  name: 'trafficSources',
                  type: 'array',
                  label: 'Traffic Sources',
                  fields: [
                    { name: 'source', type: 'text', label: 'Source (organic/direct/referral)' },
                    { name: 'visitors', type: 'number', label: 'Visitors' },
                    { name: 'percentage', type: 'number', label: 'Percentage (%)' },
                  ],
                },
              ],
            },
          ],
        },

        // 15. AI CITATION TRACKING
        {
          label: 'AI Citation Tracking',
          fields: [
            {
              name: 'aiCitationTracking',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'claudeCitations', type: 'number', label: 'Claude Citations (estimated)' },
                {
                  name: 'chatgptCitations',
                  type: 'number',
                  label: 'ChatGPT Citations (estimated)',
                },
                {
                  name: 'perplexityCitations',
                  type: 'number',
                  label: 'Perplexity Citations (estimated)',
                },
                {
                  name: 'totalAiCitations',
                  type: 'number',
                  label: 'Total AI Citations',
                  admin: { readOnly: true },
                },
                {
                  name: 'shareOfVoice',
                  type: 'number',
                  label: 'Share of Voice (% vs top 3 competitors)',
                  admin: { readOnly: true },
                },
                { name: 'lastUpdated', type: 'date', label: 'Last Updated' },
              ],
            },
          ],
        },

        // 16. CONVERSION FUNNEL
        {
          label: 'Conversion Funnel',
          fields: [
            {
              name: 'conversionFunnel',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'uniqueVisitors', type: 'number', label: 'Unique Visitors' },
                { name: 'formViews', type: 'number', label: 'Form Views' },
                { name: 'formSubmissions', type: 'number', label: 'Form Submissions' },
                { name: 'emailCaptures', type: 'number', label: 'Email Captures' },
                { name: 'confirmedLeads', type: 'number', label: 'Confirmed Leads' },
                { name: 'confirmedCases', type: 'number', label: 'Confirmed Cases' },
                {
                  name: 'visitorToFormRate',
                  type: 'number',
                  label: 'Visitor to Form Rate (%)',
                  admin: { readOnly: true },
                },
                {
                  name: 'formToLeadRate',
                  type: 'number',
                  label: 'Form to Lead Rate (%)',
                  admin: { readOnly: true },
                },
                {
                  name: 'leadToCaseRate',
                  type: 'number',
                  label: 'Lead to Case Rate (%)',
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─── Sidebar Fields ───────────────────────────────────────────────────
    {
      name: 'previewButton',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/PreviewButton',
        },
      },
    },
    {
      name: 'keywordResearch',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/KeywordResearchPanel',
        },
      },
    },
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar', description: 'Date the article was published' } },
    { name: 'updatedAt', type: 'date', admin: { position: 'sidebar', readOnly: true, description: 'Last time this article was saved' } },
    { name: 'aeoScore', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'seoScore',
      label: 'SEO Score (auto-calculated)',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-calculated on every save. 0-100. Target 80+ before publishing.',
      },
    },
    { name: 'readTime', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'searchIntent',
      type: 'select',
      admin: { position: 'sidebar' },
      options: ['Informational', 'Commercial Investigation', 'Transactional', 'Navigational'],
    },
    { name: 'targetSerpFeature', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'contentConfidence',
      type: 'select',
      admin: { position: 'sidebar' },
      options: ['High', 'Medium', 'Low'],
    },
    { name: 'hideFromSearchEngines', type: 'checkbox', admin: { position: 'sidebar' } },
    {
      name: 'reviewCycle',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: '3 Months', value: '3months' },
        { label: '6 Months', value: '6months' },
        { label: '12 Months', value: '12months' },
        { label: 'Evergreen', value: 'evergreen' },
      ],
    },
    { name: 'nextReviewDue', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'lastFactVerified', type: 'date', admin: { position: 'sidebar' } },

    // 17. CONTENT QUALITY SCORE (single field, not a group)
    {
      name: 'contentQualityScore',
      type: 'number',
      label: 'Content Quality Score (0-100)',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
