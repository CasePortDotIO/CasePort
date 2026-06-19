/** Full-bleed editorial image band. Mirrors source `CP.ui.imageBand()`. */
export function ImageBand({
  line,
  scene,
  img = "/accidents/img/evidence.png",
  eyebrow,
}: {
  line: string;
  scene?: string;
  img?: string;
  eyebrow?: string;
}) {
  return (
    <section className="img-band">
      <div
        className="img-band-img"
        style={{ backgroundImage: `url('${img}')` }}
        aria-hidden="true"
      ></div>
      <div className="img-band-grad" aria-hidden="true"></div>
      {scene && (
        <span className="hero-photo-scene" aria-hidden="true">
          ◷ {scene}
        </span>
      )}
      <div className="img-band-inner">
        {eyebrow && (
          <div className="eyebrow" style={{ color: "#d9c489", marginBottom: "1rem" }}>
            {eyebrow}
          </div>
        )}
        <p className="ln">{line}</p>
      </div>
    </section>
  );
}
