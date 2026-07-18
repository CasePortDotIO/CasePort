/** Long-form body sections. Mirrors source `CP._prose()`. Each H2 carries the
 *  section id so the in-guide TOC scroll-spy can target it. */
export function ProseSections({
  sections,
  bg = "bg-white",
  container = "container-4",
}: {
  sections?: { id?: string; title: string; paras?: string[]; content?: string | string[]; image?: string; images?: string[] }[] | null
  bg?: string
  container?: string
}) {
  if (!sections?.length) return null
  return (
    <section className={"section " + bg}>
      <div className={container}>
        {sections.map((s, i) => {
          const paras: string[] = s.paras ?? (Array.isArray(s.content) ? s.content : s.content ? [s.content] : [])
          const id = s.id ?? `section-${i}`
          const imageUrls = s.images?.length ? s.images : s.image ? [s.image] : []
          return (
            <div className="prose-sec r" key={id}>
              <div className="prose">
                <h2 id={id}>{s.title}</h2>
                {paras.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {imageUrls.length > 0 && (
                  <div className={imageUrls.length > 1 ? "img-compare" : ""} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {imageUrls.map((url, k) => (
                      url.startsWith('http') || url.startsWith('/')
                        ? <img key={k} src={url} alt="" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        : <img key={k} src={`https://d2xsxph8kpxj0f.cloudfront.net${url}`} alt="" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
