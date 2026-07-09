import type { ReactNode } from "react";

type TableData = {
  label?: string
  head?: string[]
  rows: string[][]
}

/** Editorial hero with manufactured photographic background. Mirrors `CP.ui.heroPhoto()`.
 *  On dark photo heroes, the byline is placed AFTER the subtitle (passed as `byline`).
 *  Optionally renders a data table below the byline when `table` is provided. */
export function HeroPhoto({
  eyebrow,
  title,
  sub,
  scene,
  crumbs,
  img = "/accidents/img/road.png",
  byline,
  table,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  scene?: string;
  crumbs?: ReactNode;
  img?: string;
  byline?: ReactNode;
  table?: TableData;
}) {
  const num = (v: string) => <span className="num">{v}</span>

  return (
    <section className="hero-photo">
      <div
        className="hero-photo-img"
        style={{ backgroundImage: `url('${img}')` }}
        aria-hidden="true"
      ></div>
      <div className="hero-photo-grad" aria-hidden="true"></div>
      {scene && (
        <span className="hero-photo-scene" aria-hidden="true">
          ◷ {scene}
        </span>
      )}
      <div className="hero-photo-inner">
        {crumbs}
        {eyebrow && (
          <div className="eyebrow" style={{ color: "#d9c489", margin: "0 0 .9rem" }}>
            {eyebrow}
          </div>
        )}
        <h1 className="hero-photo-h1">{title}</h1>
        {sub && <p className="hero-photo-sub">{sub}</p>}
        {byline}
      </div>
      {table && table.rows && table.rows.length > 0 && (
        <div className="container-4" style={{ position: "relative", zIndex: 2, paddingBottom: "2rem" }}>
          <div className="hero-table">
            {table.label && <div className="hero-table-label">{table.label}</div>}
            <div className="table-wrap">
              <table className="data">
                {table.head && table.head.length > 0 && (
                  <thead>
                    <tr>
                      {table.head.map((cell, i) => (
                        <th key={i}>{cell}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci}>
                          {typeof cell === "string" && /\$?\d+/.test(cell) ? num(cell) : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
