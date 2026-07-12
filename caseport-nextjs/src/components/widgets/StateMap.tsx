"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { stateData, stateGrid, negColor, NATIONAL } from "@/data";
import { stateSlug } from "@/lib/state";

const CELL = 40;
const GAP = 4;
const COLS = 12;
const ROWS = 7;

function MapPanel({ abbr }: { abbr: string }) {
  const s = stateData[abbr];
  const color = negColor(s.rule);
  const delta = s.avgSettlement - NATIONAL.avgSettlement;
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: ".5rem",
          marginBottom: ".5rem",
        }}
      >
        <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--teal)" }}>
          {s.name}
        </h3>
        <span
          style={{
            fontSize: ".72rem",
            fontWeight: 700,
            color: "#fff",
            padding: ".25rem .6rem",
            borderRadius: "999px",
            background: color,
          }}
        >
          {s.abbr}
        </span>
      </div>
      <span className="pill-rule" style={{ background: color + "18", color }}>
        {s.label}
      </span>
      <div className="map-row">
        <Icon name="alert" style={{ color: "#c4714a" }} />
        <div>
          <div className="ml">Fault Rule</div>
          <div className="mv">{s.faultThreshold}</div>
        </div>
      </div>
      <div className="map-row">
        <Icon name="clock" style={{ color: "#d4a853" }} />
        <div>
          <div className="ml">Statute of Limitations</div>
          <div className="mv">{s.statuteNote}</div>
        </div>
      </div>
      <div className="map-row">
        <Icon name="scale" style={{ color: "#1a4a5a" }} />
        <div>
          <div className="ml">Damage Cap</div>
          <div className="mv">{s.damageCap}</div>
        </div>
      </div>
      <div className="map-row">
        <Icon name="pin" style={{ color: "#4a8c7e" }} />
        <div>
          <div className="ml">
            Avg. Settlement{" "}
            <span className="sample-label" style={{ marginLeft: ".4rem" }}>
              Illustrative
            </span>
          </div>
          <div className="mv">
            ${s.avgSettlement}K{" "}
            <span style={{ fontWeight: 700, color: delta >= 0 ? "#4a8c7e" : "#c4714a" }}>
              ({delta >= 0 ? "+" : ""}
              {delta}K vs national avg)
            </span>
          </div>
        </div>
      </div>
      <div className="map-row">
        <Link href={`/accidents/${stateSlug(abbr)}`} className="card-link">
          See full {s.name} guide <Icon name="arrow" />
        </Link>
      </div>
      {s.rule === "pure-contributory" && (
        <div className="map-warn">
          <p>
            Warning: {s.name} uses the harshest negligence standard. Any fault —
            even 1% — bars your entire recovery. What you say in the first hours
            matters more here than anywhere else.
          </p>
        </div>
      )}
    </>
  );
}

function MapEmpty() {
  return (
    <div className="empty">
      <Icon name="pin" />
      <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-4)" }}>
        Select Your State
      </p>
      <p style={{ fontSize: ".9rem", marginTop: ".4rem" }}>
        Click any state on the map to see your negligence rule, filing deadline,
        and fault threshold.
      </p>
    </div>
  );
}

export function StateMap() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="section bg-white" data-widget="stateMap">
      <div className="container">
        <div className="section-head center">
          <h2 className="section-h">Your State. Your Rules. Instantly.</h2>
          <p className="section-sub center">
            Click your state to see the negligence rule, filing deadline, and
            fault threshold that determines your recovery.
          </p>
        </div>
        <div
          className="map-layout"
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "1fr",
            alignItems: "start",
          }}
        >
          <div>
            <div className="map-legend">
              <span className="lg">
                <span className="sw" style={{ background: "#c4714a" }}></span>Pure
                Contributory (harshest)
              </span>
              <span className="lg">
                <span className="sw" style={{ background: "#d4a853" }}></span>Modified
                50%
              </span>
              <span className="lg">
                <span className="sw" style={{ background: "#4a8c7e" }}></span>Modified
                51%
              </span>
              <span className="lg">
                <span className="sw" style={{ background: "#1a4a5a" }}></span>Pure
                Comparative (best)
              </span>
            </div>
            <div className="map-scroll">
              <div
                className="cartogram"
                style={{
                  width: COLS * (CELL + GAP),
                  height: ROWS * (CELL + GAP),
                  minWidth: COLS * (CELL + GAP),
                }}
              >
                {stateGrid.map((g) => {
                  const s = stateData[g.abbr];
                  if (!s) return null;
                  const color = negColor(s.rule);
                  const sel = selected === g.abbr;
                  return (
                    <button
                      key={g.abbr}
                      data-abbr={g.abbr}
                      className={sel ? "sel" : ""}
                      style={{
                        left: g.col * (CELL + GAP),
                        top: g.row * (CELL + GAP),
                        width: CELL,
                        height: CELL,
                        background: color,
                        opacity: sel ? 1 : 0.82,
                      }}
                      aria-label={`${s.name}: ${s.label}`}
                      onClick={() => setSelected(g.abbr)}
                    >
                      {g.abbr}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="map-panel" id="mapPanel">
            {selected ? <MapPanel abbr={selected} /> : <MapEmpty />}
          </div>
        </div>
      </div>
    </section>
  );
}
