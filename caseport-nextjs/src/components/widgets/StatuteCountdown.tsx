"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { statesSorted, stateData } from "@/data";

function CdResult({ abbr, dateStr }: { abbr: string; dateStr: string }) {
  const s = stateData[abbr];
  const accident = new Date(dateStr);
  const deadline = new Date(accident);
  deadline.setFullYear(deadline.getFullYear() + s.statuteYears);
  const now = new Date();
  const days = Math.ceil((deadline.getTime() - now.getTime()) / 86400000);
  const total = s.statuteYears * 365;
  const pct = Math.min(100, Math.max(0, ((total - days) / total) * 100));
  const expired = days <= 0;
  const urgent = days > 0 && days <= 180;
  const warning = days > 180 && days <= 365;
  const color = expired || urgent ? "#c4714a" : warning ? "#d4a853" : "#1a4a5a";
  const barBg = urgent
    ? "linear-gradient(90deg,#d4a853,#c4714a)"
    : warning
      ? "linear-gradient(90deg,#4a8c7e,#d4a853)"
      : "linear-gradient(90deg,#1a4a5a,#4a8c7e)";
  const deadlineStr = deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ marginTop: "1.5rem" }}>
      {expired ? (
        <div
          className="cd-display"
          style={{
            background: "rgba(196,113,74,0.06)",
            border: "1px solid rgba(196,113,74,0.25)",
          }}
        >
          <Icon
            name="alert"
            style={{ width: 32, height: 32, color: "#c4714a", margin: "0 auto .6rem" }}
          />
          <p className="cd-num" style={{ color: "#c4714a", fontSize: "2.6rem" }}>
            EXPIRED
          </p>
          <p style={{ fontSize: ".9rem", color: "#c4714a", marginTop: ".5rem" }}>
            Your filing window has passed. Consult a representative immediately —
            limited exceptions may apply.
          </p>
        </div>
      ) : (
        <div
          className="cd-display"
          style={{ background: color + "0d", border: "1px solid " + color + "33" }}
        >
          <p className="cd-num" style={{ color }}>
            {days.toLocaleString()}
          </p>
          <p className="cd-label">days remaining</p>
        </div>
      )}

      {!expired && (
        <div style={{ marginTop: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: ".74rem",
              fontWeight: 700,
              color: "var(--text-4)",
              marginBottom: ".5rem",
            }}
          >
            <span>ACCIDENT</span>
            <span>DEADLINE: {deadlineStr}</span>
          </div>
          <div className="cd-bar">
            <div style={{ width: pct + "%", background: barBg }}></div>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: ".76rem",
              fontWeight: 700,
              color: "var(--text-4)",
              marginTop: ".5rem",
            }}
          >
            {Math.round(pct)}% of your filing window has elapsed
          </p>
        </div>
      )}

      <div className="cd-meta">
        <div>
          <div className="k">Filing Deadline</div>
          <div className="v">
            {s.statuteYears} year{s.statuteYears > 1 ? "s" : ""}
          </div>
        </div>
        <div>
          <div className="k">Negligence Rule</div>
          <div className="v">{s.label}</div>
        </div>
      </div>

      {urgent && !expired && (
        <div className="map-warn" style={{ marginTop: "1.1rem" }}>
          <p>
            <strong>Critical:</strong> With fewer than 180 days remaining, evidence
            is degrading daily. Surveillance footage is already overwritten. Witness
            memories are fading. The insurance company knows your deadline is
            approaching.
          </p>
        </div>
      )}
    </div>
  );
}

export function StatuteCountdown() {
  const [abbr, setAbbr] = useState("");
  const [date, setDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="section bg-cream" data-widget="countdown">
      <div className="container-4">
        <div className="section-head center">
          <h2 className="section-h">How Much Time Do You Have Left?</h2>
          <p className="section-sub center">
            Enter your accident date and state. See exactly how many days remain
            before your right to file expires permanently.
          </p>
        </div>
        <div className="calc-card" style={{ maxWidth: "38rem", margin: "0 auto" }}>
          <div
            className="cd-inputs"
            style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "1fr 1fr" }}
          >
            <div className="field">
              <label htmlFor="cdState">Your State</label>
              <select
                id="cdState"
                value={abbr}
                onChange={(e) => setAbbr(e.target.value)}
              >
                <option value="">Select your state…</option>
                {statesSorted().map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cdDate">Accident Date</label>
              <input
                type="date"
                id="cdDate"
                max={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div id="cdResult">
            {abbr && date && <CdResult abbr={abbr} dateStr={date} />}
          </div>
          <p className="est-note" style={{ textAlign: "center", marginTop: "1.25rem" }}>
            100% private. No data is stored or transmitted. This calculation runs
            entirely in your browser.
          </p>
        </div>
      </div>
    </section>
  );
}
