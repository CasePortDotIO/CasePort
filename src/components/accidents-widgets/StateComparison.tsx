"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { statesSorted, stateData, NATIONAL } from "@/data";

function CmpRow({
  label,
  av,
  bv,
  delta,
  interp,
}: {
  label: string;
  av: string;
  bv: string;
  delta: number;
  interp: string;
}) {
  const ico =
    Math.abs(delta) < 0.5 ? (
      <Icon name="minus" style={{ color: "#999" }} />
    ) : delta > 0 ? (
      <Icon name="up" style={{ color: "#4a8c7e" }} />
    ) : (
      <Icon name="down" style={{ color: "#c4714a" }} />
    );
  return (
    <div className="cmp-grid cmp-row">
      <div>
        <div className="lbl">{label}</div>
        <div className="interp">{interp}</div>
      </div>
      <div className="va">{av}</div>
      <div className="vb">{bv}</div>
      <div className="cmp-delta">{ico}</div>
    </div>
  );
}

function CmpResult({ aAbbr, bAbbr }: { aAbbr: string; bAbbr: string | null }) {
  const a = stateData[aAbbr];
  const b = bAbbr ? stateData[bAbbr] : null;
  const N = NATIONAL;
  const bn = b ? b.name : "National Avg";

  const rows: ReactNode[] = [];
  const bSettle = b ? b.avgSettlement : N.avgSettlement;
  rows.push(
    <CmpRow
      key="settle"
      label="Average Settlement"
      av={"$" + a.avgSettlement + "K"}
      bv={"$" + bSettle + "K"}
      delta={a.avgSettlement - bSettle}
      interp={
        a.avgSettlement > bSettle
          ? "Higher settlements here"
          : a.avgSettlement < bSettle
            ? "Lower settlements here"
            : "At average"
      }
    />
  );
  const bVerdict = b ? b.medianJuryVerdict : N.medianVerdict;
  rows.push(
    <CmpRow
      key="verdict"
      label="Median Jury Verdict"
      av={"$" + a.medianJuryVerdict + "K"}
      bv={"$" + bVerdict + "K"}
      delta={a.medianJuryVerdict - bVerdict}
      interp={
        a.medianJuryVerdict > bVerdict ? "Juries award more here" : "Juries award less here"
      }
    />
  );
  const bStatute = b ? b.statuteYears : 2.5;
  rows.push(
    <CmpRow
      key="statute"
      label="Statute of Limitations"
      av={a.statuteYears + "yr"}
      bv={b ? b.statuteYears + "yr" : "2–3yr"}
      delta={a.statuteYears - bStatute}
      interp={
        a.statuteYears > bStatute
          ? "More time to file"
          : a.statuteYears < bStatute
            ? "Less time — act faster"
            : "Average window"
      }
    />
  );
  const bUninsured = b ? b.uninsuredRate : N.uninsuredRate;
  rows.push(
    <CmpRow
      key="uninsured"
      label="Uninsured Motorist Rate"
      av={a.uninsuredRate + "%"}
      bv={bUninsured + "%"}
      delta={-(a.uninsuredRate - bUninsured)}
      interp={
        a.uninsuredRate > bUninsured ? "Higher uninsured risk" : "Lower uninsured risk"
      }
    />
  );
  const bFatal = b ? b.fatalCrashRate : N.fatalCrashRate;
  rows.push(
    <CmpRow
      key="fatal"
      label="Fatal Crash Rate"
      av={a.fatalCrashRate + "/100K"}
      bv={bFatal + "/100K"}
      delta={-(a.fatalCrashRate - bFatal)}
      interp={a.fatalCrashRate > bFatal ? "More dangerous roads" : "Safer than average"}
    />
  );

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="cmp-grid cmp-head">
        <div className="h">Metric</div>
        <div className="h" style={{ textAlign: "center", color: "var(--teal)" }}>
          {a.name}
        </div>
        <div className="h" style={{ textAlign: "center" }}>
          {bn}
        </div>
        <div style={{ width: 16 }}></div>
      </div>
      {rows}
      <div
        style={{
          padding: "1.25rem",
          borderTop: "1px solid var(--line)",
          background: "var(--bg-warm)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".6rem",
            marginBottom: ".75rem",
          }}
        >
          <Icon name="chart" style={{ width: 18, height: 18, color: "#1a4a5a" }} />
          <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: ".9rem" }}>
            Negligence Standard
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: b ? "1fr 1fr" : "1fr",
          }}
        >
          <div className="card on-cream" style={{ padding: "1rem" }}>
            <div className="cd-meta" style={{ border: "none", padding: 0, margin: 0, display: "block" }}>
              <div className="k">{a.name}</div>
            </div>
            <p style={{ fontWeight: 700, color: "var(--teal)", fontSize: ".95rem", marginTop: ".25rem" }}>
              {a.label}
            </p>
            <p style={{ fontSize: ".8rem", color: "var(--text-3)", marginTop: ".2rem" }}>
              {a.desc}
            </p>
          </div>
          {b && (
            <div className="card on-cream" style={{ padding: "1rem" }}>
              <div
                className="k"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: ".66rem",
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--text-4)",
                }}
              >
                {b.name}
              </div>
              <p style={{ fontWeight: 700, color: "var(--teal)", fontSize: ".95rem", marginTop: ".25rem" }}>
                {b.label}
              </p>
              <p style={{ fontSize: ".8rem", color: "var(--text-3)", marginTop: ".2rem" }}>
                {b.desc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StateComparison({ initialA = "" }: { initialA?: string }) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState("");
  const options = statesSorted();

  return (
    <section className="section bg-white" data-widget="comparison">
      <div className="container-5">
        <div className="section-head center">
          <h2 className="section-h">How Does Your State Compare?</h2>
          <p className="section-sub center">
            Compare your state&apos;s accident laws, settlement averages, and risk
            factors against the national average — or any other state.
          </p>
        </div>
        <div className="calc-card" style={{ maxWidth: "46rem", margin: "0 auto 2rem" }}>
          <div
            className="cmp-select"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="cmpA">Your State</label>
              <select id="cmpA" value={a} onChange={(e) => setA(e.target.value)}>
                <option value="">Select state…</option>
                {options.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ paddingBottom: ".7rem", fontWeight: 700, color: "var(--text-4)" }}>
              vs
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="cmpB">Compare Against</label>
              <select id="cmpB" value={b} onChange={(e) => setB(e.target.value)}>
                <option value="">National Average</option>
                {options.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div id="cmpResult" style={{ maxWidth: "46rem", margin: "0 auto" }}>
          {a ? (
            <CmpResult aAbbr={a} bAbbr={b || null} />
          ) : (
            <div className="card center" style={{ padding: "3rem 1.5rem" }}>
              <div style={{ color: "var(--line-2)", marginBottom: ".5rem" }}>
                <Icon name="chart" style={{ width: 38, height: 38, margin: "0 auto" }} />
              </div>
              <p style={{ fontWeight: 700, color: "var(--text-4)" }}>
                Select a state to begin
              </p>
              <p style={{ fontSize: ".9rem", color: "var(--text-4)", marginTop: ".4rem" }}>
                Choose your state to see how it compares on settlements, deadlines,
                and risk factors.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
