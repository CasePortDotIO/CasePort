import type { StatLabelValue } from "@/data";

/** "At a glance" stat tiles. Mirrors the accident-type statBlock. */
export function StatTiles({
  category,
  stats,
}: {
  category: string;
  stats: StatLabelValue[];
}) {
  return (
    <section className="section bg-cream" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className="container-4">
        <span
          className="pill-rule"
          style={{ background: "rgba(26,74,90,0.08)", color: "var(--teal)", marginBottom: "1.25rem" }}
        >
          {category} · At a glance
        </span>
        <div className="stat-tiles" style={{ marginTop: "1.25rem" }}>
          {stats.map((s, i) => (
            <div className="stat-tile" key={i}>
              <div className="lbl">{s.label}</div>
              <div className="val">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
