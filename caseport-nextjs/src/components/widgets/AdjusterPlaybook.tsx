"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { adjusterPlaybook } from "@/data";

export function AdjusterPlaybook() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section bg-white" data-widget="playbook">
      <div className="container-4">
        <div className="section-head center">
          <h2 className="section-h">The Insurance Adjuster Playbook</h2>
          <p className="section-sub center">
            Every question they ask is designed to reduce or deny your claim. Here
            is exactly what they will say, what it means, and what you should say
            instead.
          </p>
          <p className="note" style={{ justifyContent: "center", marginTop: ".9rem" }}>
            Based on analysis of insurance industry training materials and
            claims-handling procedures.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {adjusterPlaybook.map((p, i) => {
            const isOpen = open === i;
            return (
              <div
                key={p.id}
                className={"pb-card" + (isOpen ? " open" : "")}
                data-pb={p.id}
              >
                <button
                  className="pb-head"
                  data-pb-toggle
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <div style={{ flex: 1 }}>
                    <div className="pb-meta">
                      <span className={"danger-badge dg-" + p.danger}>
                        {p.danger === "critical"
                          ? "CRITICAL"
                          : p.danger === "high"
                            ? "HIGH RISK"
                            : "MODERATE"}
                      </span>
                      <span className="pb-ctx">{p.context}</span>
                    </div>
                    <p className="q">“{p.whatTheySay}”</p>
                  </div>
                  <span className="pb-toggle">
                    <Icon name={isOpen ? "chevUp" : "chevDown"} />
                  </span>
                </button>
                <div className="pb-body">
                  <div className="pb-line">
                    <span className="pb-ic" style={{ background: "rgba(196,113,74,0.12)" }}>
                      <Icon name="alert" style={{ color: "#c4714a" }} />
                    </span>
                    <div>
                      <div className="k" style={{ color: "#c4714a" }}>
                        What it actually means
                      </div>
                      <p>{p.whatItMeans}</p>
                    </div>
                  </div>
                  <div className="pb-line">
                    <span className="pb-ic" style={{ background: "rgba(74,140,126,0.14)" }}>
                      <Icon name="shield" style={{ color: "#4a8c7e" }} />
                    </span>
                    <div>
                      <div className="k" style={{ color: "#4a8c7e" }}>
                        What you should say instead
                      </div>
                      <p className="pb-say">“{p.whatYouSay}”</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card on-cream center" style={{ marginTop: "2rem" }}>
          <p style={{ fontSize: ".95rem", color: "var(--text-3)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Remember:</strong> You are never
            required to give a recorded statement to the other driver&apos;s insurance
            company. You are never required to sign a blanket medical authorization.
            You are never required to accept their first offer. These are your rights.
          </p>
        </div>
      </div>
    </section>
  );
}
