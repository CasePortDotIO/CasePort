const fs = require('fs');
const file = 'src/app/(frontend)/markets/[slug]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import \{ markets \} from '@\/lib\/marketData'/g, 'import { useState, useEffect } from "react"');

const match = c.match(/export default function CityMarketPage\(\) \{[\s\S]*?if \(!market\) \{/);
if (match) {
  const replacement = xport default function CityMarketPage() {
  const params = useParams()
  const router = useRouter()
  const cityId = typeof params?.slug === 'string' ? params.slug.toLowerCase() : ''
  const [market, setMarket] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cityId) return
    fetch(\/api/markets?where[slug][equals]=\\)
      .then(res => res.json())
      .then(data => {
        if (data.docs && data.docs.length > 0) setMarket(data.docs[0]);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [cityId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030608]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00B4D8] mx-auto mb-4"></div>
      </div>
    );
  }

  if (!market) {;
  c = c.replace(match[0], replacement);
}

// Ensure the local data variables are assigned if missing
const dictRegex = /\/\/ City-specific copy variations[\s\S]*?const cityData = \(cityId && cityInsights\[cityId\]\) \|\| cityInsights\.default;/;
c = c.replace(dictRegex, const cityData = { 
  headline: market.heroHeadline || \\'s Personal Injury Market\, 
  subline: market.heroSubline || \Exclusive market access. \ cases acquired yearly.\, 
  insight: market.heroInsight || \\ is a key market in the CasePort network.\ 
};);

// Array parsing fixes
c = c.replace(/market\.casesAcquiredYearly\.toLocaleString\(\)/g, '(market.casesAcquiredYearly || 0).toLocaleString()');
c = c.replace(/market\.id/g, 'market.slug');
c = c.replace(/\$\{market\.partnersActive\}/g, '');

// Handle FAQ loops directly over custom arrays if present. 
// Just wrapping the FAQ array into dynamic map!
c = c.replace(/\[\s*\{\s*q: \What's the average case value in \$\{market\.metro\}\?\[\s\S]*?\]\.map/g, 
  (market.faqs && market.faqs.length > 0 ? market.faqs.map((f: any) => ({q: f.question, a: f.answer})) : [
    {
      q: \What's the average case value in \?\,
      a: \The average settlement range is \. This varies based on case type and severity.\
    },
    {
      q: \How many firms are active in \?\,
      a: \Currently \ of \ partner slots are active. The market is capped at \ firms to maintain lead quality.\
    },
    {
      q: "How quickly will I receive leads?",
      a: "Qualified leads are delivered within 15 minutes of your market activation. All leads are pre-qualified based on your contract definition."
    },
    {
      q: "What if a lead doesn't meet my contract definition?",
      a: "You're not charged. The pre-funded wallet model means you only pay for leads that meet your mutually agreed contract definition. Full transparency."
    },
    {
      q: \Is \ a good market for my firm?\,
      a: \\ has \ cases acquired yearly with an MII score of \. Request a strategy call to determine fit.\
    },
    {
      q: "What happens when the market caps?",
      a: "Once all partner slots are filled, the market closes to new applications. You can join the waitlist for priority access if a slot opens."
    }
  ]).map);

c = c.replace(/\[\s*\{\s*title: "Consistent Case Flow"[\s\S]*?\]\.map/g, 
  (market.whyThisMarket && market.whyThisMarket.length > 0 ? market.whyThisMarket : [
    { title: "Consistent Case Flow", desc: cityData.insight },
    { title: "Qualified Partners Only", desc: \\ firms maximum. No dilution. No competition.\ },
    { title: "Pre-Funded Wallet Model", desc: "Only pay for qualified leads. Money stays in your wallet until delivery." },
    { title: "15-Minute Response Time", desc: "Access to leads within 15 minutes of qualification. Speed = conversion." }
  ]).map);

fs.writeFileSync(file, c, 'utf8');
console.log('CityMarketPage.tsx correctly transformed');
