$content = Get-Content -Path "src/app/(frontend)/markets/page.tsx" -Raw

$faqDef = @"
    const dynamicFaqs = useMemo(() => {
      const allFaqs = markets.flatMap((m) => m.faqs || [])
      const unique = new Map()
      allFaqs.forEach((faq) => {
        if (faq.question && faq.answer && !unique.has(faq.question)) {
          unique.set(faq.question, { q: faq.question, a: faq.answer })
        }
      })
      const arr = Array.from(unique.values())
      if (arr.length > 0) return arr
      return [
        {
          q: 'What markets does CasePort serve for personal injury leads?',
          a: 'CasePort serves ' + stats.total + ' metropolitan areas across the United States. Each market is capped at 3 partner firms.',
        },
        {
          q: 'How does the 3-firm market cap actually work?',
          a: 'Each CasePort market is limited to exactly 3 partner firms. This is not artificial scarcity — it is a structural requirement. When a market reaches 3 firms, it is capped and new firms are placed on a waitlist.',
        },
        {
          q: 'What is the Market Intelligence Index?',
          a: 'The MII is a proprietary scoring system (0–100) that combines search intent volume, competition density, average case settlement values, and population growth trajectory. Higher MII scores indicate more attractive markets.',
        },
        {
          q: 'Can I operate in multiple CasePort markets?',
          a: 'Yes. Multi-market access is available for firms with the capacity to handle case flow across multiple territories. Each market requires a separate partner slot.',
        },
        {
          q: 'How do I request access for a market not yet listed?',
          a: 'Submit a priority access request at www.caseport.io/request-access. Markets are evaluated based on demand density, average case values, population size, and infrastructure readiness.',
        },
        {
          q: 'How is CasePort different from other PI lead generation companies?',
          a: 'CasePort differs in three ways: (1) Market Cap — each metro is limited to 3 firms; (2) Dedicated Infrastructure — market-specific demand capture; (3) Pre-Funded Wallet — no manual invoicing.',
        },
      ]
    }, [markets, stats.total])

    // ============================================
    // SCHEMA.ORG JSON-LD — Comprehensive AEO/GEO
