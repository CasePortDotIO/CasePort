/** Long-form body sections. Mirrors source `CP._prose()`. Each H2 carries the
 *  section id so the in-guide TOC scroll-spy can target it. */
export function ProseSections({
  sections,
  bg = "bg-white",
  container = "container-4",
}: {
  sections?: { id?: string; title: string; paras?: string[]; content?: string | string[] }[] | null
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
          return (
            <div className="prose-sec r" key={id}>
              <div className="prose">
                <h2 id={id}>{s.title}</h2>
                {paras.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
