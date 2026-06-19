"use client";

import { useState } from "react";

export function SettlementEstimator() {
  const [sev, setSev] = useState("2.75");
  const [med, setMed] = useState("");
  const [wage, setWage] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const fmt = (n: number) => "$" + n.toLocaleString();

  const run = () => {
    const sevN = parseFloat(sev) || 2.75;
    const medN = parseFloat(med) || 0;
    const wageN = parseFloat(wage) || 0;
    const econ = medN + wageN;
    let low = Math.round((econ + medN * (sevN - 0.75)) / 1000) * 1000;
    let high = Math.round((econ + medN * (sevN + 0.75)) / 1000) * 1000;
    if (econ === 0) {
      low = 0;
      high = 0;
    }
    setResult(econ === 0 ? "Enter your figures above" : fmt(low) + " – " + fmt(high));
  };

  return (
    <section className="section bg-cream" data-widget="estimator">
      <div className="container-4">
        <div className="section-head center">
          <h2 className="section-h">Estimate Your Settlement Range</h2>
          <p className="section-sub center">
            A free, private estimate using the multiplier method adjusters use.
            Understand what your case may be worth before you make any decisions.
          </p>
        </div>
        <div className="calc-card" style={{ maxWidth: "36rem", margin: "0 auto" }}>
          <div className="field">
            <label htmlFor="estSev">Injury Severity</label>
            <select id="estSev" value={sev} onChange={(e) => setSev(e.target.value)}>
              <option value="1.75">Minor (bruises, sprains)</option>
              <option value="2.75">Moderate (fractures, significant pain)</option>
              <option value="4.25">Severe (permanent disability)</option>
              <option value="5.5">Catastrophic (life-threatening)</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="estMed">Medical Expenses (USD)</label>
            <input
              type="number"
              id="estMed"
              placeholder="e.g. 15000"
              min="0"
              value={med}
              onChange={(e) => setMed(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="estWage">Lost Wages (USD)</label>
            <input
              type="number"
              id="estWage"
              placeholder="e.g. 8000"
              min="0"
              value={wage}
              onChange={(e) => setWage(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" id="estBtn" onClick={run}>
            Calculate Estimate
          </button>
          <div className={"est-result" + (result ? " show" : "")} id="estResult">
            <div className="rl">Estimated Settlement Range</div>
            <div className="rv" id="estVal">
              {result ?? "—"}
            </div>
            <p className="est-note">
              Illustrative only. Your state&apos;s negligence rule is applied before
              any payment — in contributory negligence states, any fault can
              eliminate recovery. Not a guarantee of outcome.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
