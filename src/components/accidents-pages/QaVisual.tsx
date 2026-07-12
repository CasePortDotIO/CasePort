/** Quick-answer diagrammatic visuals. Mirrors source `CP._qaVisual()`. */
export function QaVisual({ kind }: { kind: string }) {
  let inner: React.ReactNode = null;

  if (kind === "contributory") {
    inner = (
      <>
        <div className="section-head center">
          <h2 className="section-h">1% Fault, Two Very Different Outcomes</h2>
        </div>
        <div className="grid grid-2" style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <div className="card" style={{ borderColor: "rgba(196,113,74,0.4)" }}>
            <span className="pill-rule" style={{ background: "rgba(196,113,74,0.1)", color: "var(--terra)" }}>
              Contributory (VA · MD · DC · NC · AL)
            </span>
            <p style={{ fontFamily: "var(--serif)", fontSize: "2.6rem", fontWeight: 700, color: "var(--terra)", marginTop: "1rem", lineHeight: 1 }}>
              $0
            </p>
            <p style={{ marginTop: ".5rem", fontSize: ".95rem" }}>
              Found 1% at fault on a $100,000 claim → you recover <strong>nothing</strong>.
            </p>
          </div>
          <div className="card" style={{ borderColor: "rgba(74,140,126,0.4)" }}>
            <span className="pill-rule" style={{ background: "rgba(74,140,126,0.1)", color: "var(--sage)" }}>
              Pure Comparative (CA · NY · WA…)
            </span>
            <p style={{ fontFamily: "var(--serif)", fontSize: "2.6rem", fontWeight: 700, color: "var(--sage)", marginTop: "1rem", lineHeight: 1 }}>
              $99,000
            </p>
            <p style={{ marginTop: ".5rem", fontSize: ".95rem" }}>
              Found 1% at fault on a $100,000 claim → you recover <strong>$99,000</strong>.
            </p>
          </div>
        </div>
      </>
    );
  } else if (kind === "statute") {
    const rows: [string, string][] = [
      ["1 year", "KY · LA · TN"],
      ["2 years", "VA · GA · TX · CA · FL"],
      ["3 years", "MD · DC · NY · WA"],
      ["4–6 years", "NE · WY · UT · MO · ME · ND"],
    ];
    const widths = [18, 40, 62, 100];
    inner = (
      <>
        <div className="section-head center">
          <h2 className="section-h">Filing Windows Across the States</h2>
        </div>
        <div className="card" style={{ maxWidth: "42rem", margin: "0 auto" }}>
          {rows.map((r, i) => (
            <div
              key={i}
              style={{ display: "grid", gridTemplateColumns: "7rem 1fr", gap: "1rem", alignItems: "center", marginBottom: ".75rem" }}
            >
              <div style={{ fontFamily: "var(--mono)", fontSize: ".8rem", fontWeight: 700, color: "var(--ink)" }}>
                {r[0]}
              </div>
              <div>
                <div className="cd-bar" style={{ height: 14 }}>
                  <div style={{ width: widths[i] + "%", background: "linear-gradient(90deg,#1a4a5a,#4a8c7e)" }}></div>
                </div>
                <div style={{ fontSize: ".74rem", color: "var(--text-4)", marginTop: ".25rem" }}>{r[1]}</div>
              </div>
            </div>
          ))}
          <p className="sample-label" style={{ marginTop: ".5rem" }}>
            Illustrative · See the state map for your exact deadline
          </p>
        </div>
      </>
    );
  } else if (kind === "evidence") {
    const items: [string, string, string][] = [
      ["0–3 hrs", "Skid marks fade · debris cleared", "#c4714a"],
      ["24–72 hrs", "Surveillance footage overwritten", "#c4714a"],
      ["Days", "Witness memory degrades", "#d4a853"],
      ["Weeks", "Witnesses become unreachable", "#d4a853"],
      ["Months", "Only documented evidence survives", "#4a8c7e"],
    ];
    inner = (
      <>
        <div className="section-head center">
          <h2 className="section-h">How Fast Evidence Disappears</h2>
        </div>
        <div className="card" style={{ maxWidth: "40rem", margin: "0 auto" }}>
          {items.map((it, i) => (
            <div
              key={i}
              className="map-row"
              style={{ marginTop: 0, padding: ".85rem 0", borderBottom: "1px solid var(--line)" }}
            >
              <div style={{ fontFamily: "var(--mono)", fontSize: ".78rem", fontWeight: 700, color: it[2], width: "5rem", flexShrink: 0 }}>
                {it[0]}
              </div>
              <div className="mv">{it[1]}</div>
            </div>
          ))}
        </div>
      </>
    );
  } else if (kind === "settlement") {
    inner = (
      <>
        <div className="section-head center">
          <h2 className="section-h">How the Number Is Built</h2>
        </div>
        <div className="card" style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: "var(--ink)", lineHeight: 1.5 }}>
            <span style={{ color: "var(--teal)", fontWeight: 700 }}>Economic damages</span>{" "}
            <span style={{ color: "var(--text-4)" }}>×</span>{" "}
            <span style={{ color: "var(--terra)", fontWeight: 700 }}>1.5–5× multiplier</span>
          </p>
          <p style={{ marginTop: "1rem", fontSize: ".95rem", color: "var(--text-2)" }}>
            $30,000 in medical bills × a 2.5× multiplier = <strong>$75,000</strong> — before
            your state&apos;s fault rule is applied.
          </p>
          <p className="sample-label" style={{ justifyContent: "center", marginTop: "1rem" }}>
            Illustrative example
          </p>
        </div>
      </>
    );
  }

  if (!inner) return null;
  return (
    <section className="section bg-warm">
      <div className="container">{inner}</div>
    </section>
  );
}
