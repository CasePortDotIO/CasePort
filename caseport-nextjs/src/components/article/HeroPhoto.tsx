import type { ReactNode } from "react";

/** Editorial hero with manufactured photographic background. Mirrors `CP.ui.heroPhoto()`.
 *  On dark photo heroes, the byline is placed AFTER the subtitle (passed as `byline`). */
export function HeroPhoto({
  eyebrow,
  title,
  sub,
  scene,
  crumbs,
  img = "/accidents/img/road.png",
  byline,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  scene?: string;
  crumbs?: ReactNode;
  img?: string;
  byline?: ReactNode;
}) {
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
    </section>
  );
}
