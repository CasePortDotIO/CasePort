import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { reviewer } from "@/lib/constants";

export interface CapsuleTable {
  label?: string;
  head: string[];
  rows: ReactNode[][];
}

/**
 * Short-Answer capsule (the AEO/GEO featured-answer block). Mirrors `CP.ui.capsule()`.
 * On article pages `facts` is omitted — the Key Takeaways box owns the bullets and
 * the capsule is the prose lead only.
 */
export function Capsule({
  label = "Direct Answer",
  heading,
  lead,
  facts,
  table,
  container = "container-4",
}: {
  label?: string;
  heading?: string;
  lead: string;
  facts?: [string, string][];
  table?: CapsuleTable;
  container?: string;
}) {
  return (
    <section className="section bg-white" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className={container}>
        <div className="capsule r">
          <div className="cap-label">{label}</div>
          {heading && <h2>{heading}</h2>}
          <p className="cap-lead">{lead}</p>
          {facts && facts.length > 0 && (
            <div className="cap-grid">
              {facts.map((f, i) => (
                <div className="cap-fact" key={i}>
                  <Icon name="check2" />
                  <span>
                    <b>{f[0]}.</b> {f[1]}
                  </span>
                </div>
              ))}
            </div>
          )}
          {table && (
            <>
              {table.label && <div className="cap-table-label">{table.label}</div>}
              <div className="table-wrap">
                <table className="data">
                  <thead>
                    <tr>
                      {table.head.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td
                            key={ci}
                            className={
                              ci === 0 ? "strong" : ci === r.length - 1 ? "num" : undefined
                            }
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div className="cap-foot">
            <span className="ci">
              <Icon name="award" />
              Reviewed by {reviewer.name}, {reviewer.title}
            </span>
            <span className="ci">
              <Icon name="cal" />
              Updated June 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
