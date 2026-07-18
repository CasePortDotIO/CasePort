import { Icon } from '@/components/Icon'
import Link from 'next/link'

type InjuryType = {
  slug: string
  title: string
  category: string | null
  icon: string | null
}

/* ─── "Where Does It Hurt?" — all injury types ─── */
export function InjuryTypeFilterGrid({ injuries }: { injuries: InjuryType[] }) {
  return (
    <section className="section bg-cream">
      <div className="container-5">
        <div className="section-head">
          <h2 className="section-h">Where Does It Hurt?</h2>
          <p className="section-sub">
            Select a body area or injury category to find guides tailored to your symptoms.
          </p>
        </div>

        <div className="inj-grid">
          {injuries.map((inj) => (
            <Link key={inj.slug} href={`/injuries/${inj.slug}`} className="card link r">
              <div className="card-ic">
                <Icon name={inj.icon || 'steth'} />
              </div>
              <h3>{inj.title}</h3>
              <p style={{ fontSize: '.95rem' }}>{inj.category}</p>
              <span className="card-link" style={{ marginTop: '1rem' }}>
                Symptoms, treatment &amp; value
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── "Browse by Injury Type" — injury types only ─── */
export function InjuryTypeBrowseGrid({
  injuryTypes,
}: {
  injuryTypes: InjuryType[]
}) {
  return (
    <section className="section bg-cream">
      <div className="container-5">
        <div className="section-head">
          <h2 className="section-h">Browse by Injury Type</h2>
          <p className="section-sub">
            Twelve medically-reviewed injury guides — each with symptoms, treatment, a recovery
            timeline, and the factors that drive claim value.
          </p>
        </div>
        <div className="inj-grid">
          {injuryTypes.map((inj) => (
            <Link key={inj.slug} href={`/injuries/${inj.slug}`} className="card link r">
              <div className="card-ic">
                <Icon name={inj.icon || 'steth'} />
              </div>
              <h3>{inj.title}</h3>
              <p style={{ fontSize: '.95rem' }}>{inj.category}</p>
              <span className="card-link" style={{ marginTop: '1rem' }}>
                Symptoms, treatment &amp; value
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
