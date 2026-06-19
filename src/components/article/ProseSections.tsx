import type { ArticleSection } from "@/lib/accidents-article";

/** Long-form body sections. Mirrors source `CP._prose()`. Each H2 carries the
 *  section id so the in-guide TOC scroll-spy can target it. */
export function ProseSections({
  sections,
  bg = "bg-white",
  container = "container-4",
}: {
  sections: ArticleSection[];
  bg?: string;
  container?: string;
}) {
  return (
    <section className={"section " + bg}>
      <div className={container}>
        {sections.map((s) => (
          <div className="prose-sec r" key={s.id}>
            <div className="prose">
              <h2 id={s.id}>{s.title}</h2>
              {s.paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
