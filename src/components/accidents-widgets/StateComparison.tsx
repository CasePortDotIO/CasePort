"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
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

// ─── Searchable state select ───────────────────────────────────────────────────

type StateOption = { abbr: string; name: string };

function SearchableSelect({
  value,
  onChange,
  placeholder,
  includeNational,
}: {
  value: string;
  onChange: (abbr: string) => void;
  placeholder: string;
  includeNational?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const allOptions: StateOption[] = statesSorted();
  const filtered = query
    ? allOptions.filter(
        (o) =>
          o.name.toLowerCase().includes(query.toLowerCase()) ||
          o.abbr.toLowerCase().includes(query.toLowerCase())
      )
    : allOptions;

  // When value changes externally (e.g. initialA), sync the input display
  useEffect(() => {
    if (!open) {
      const opt = allOptions.find((o) => o.abbr === value);
      setQuery(opt ? opt.name : "");
    }
  }, [value, open, allOptions]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!inputRef.current?.parentElement?.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value ? (allOptions.find((o) => o.abbr === value)?.name ?? "") : "");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, value, allOptions]);

  const selectedName = allOptions.find((o) => o.abbr === value)?.name ?? "";

  const handleSelect = (abbr: string) => {
    onChange(abbr);
    const opt = allOptions.find((o) => o.abbr === abbr);
    setQuery(opt ? opt.name : "");
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setOpen(true);
    setQuery(selectedName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery(selectedName);
    }
  };

  return (
    <div className="field" style={{ margin: 0, position: "relative" }}>
      <label>{placeholder}</label>
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={open ? query : selectedName}
          placeholder={placeholder}
          onFocus={handleFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "0.6rem 2.5rem 0.6rem 0.75rem",
            border: "1px solid var(--line-2)",
            borderRadius: "var(--radius)",
            fontSize: "0.95rem",
            background: "var(--bg-warm)",
            color: "var(--ink)",
            cursor: "text",
          }}
        />
        <Icon
          name="chev"
          style={{
            position: "absolute",
            right: "0.6rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: 14,
            height: 14,
            color: "var(--text-4)",
            pointerEvents: "none",
          }}
        />
      </div>
      {open && (
        <ul
          ref={listRef}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "var(--bg-warm)",
            border: "1px solid var(--line-2)",
            borderRadius: "var(--radius)",
            maxHeight: "220px",
            overflowY: "auto",
            listStyle: "none",
            margin: 0,
            padding: "0.25rem 0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {includeNational && !query && (
            <li
              onMouseDown={() => handleSelect("")}
              style={{
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "var(--text-3)",
                fontStyle: "italic",
              }}
            >
              National Average
            </li>
          )}
          {filtered.length === 0 && (
            <li style={{ padding: "0.5rem 0.75rem", fontSize: "0.9rem", color: "var(--text-4)" }}>
              No states found
            </li>
          )}
          {filtered.map((opt) => (
            <li
              key={opt.abbr}
              onMouseDown={() => handleSelect(opt.abbr)}
              style={{
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                background: opt.abbr === value ? "var(--sage)18" : "transparent",
                color: "var(--ink)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                if (opt.abbr !== value) (e.currentTarget as HTMLLIElement).style.background = "var(--line)";
              }}
              onMouseLeave={(e) => {
                if (opt.abbr !== value) (e.currentTarget as HTMLLIElement).style.background = "transparent";
              }}
            >
              <span>{opt.name}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-4)", fontFamily: "var(--mono)" }}>
                {opt.abbr}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function StateComparison({ initialA = "" }: { initialA?: string }) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState("");

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
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            <SearchableSelect
              value={a}
              onChange={setA}
              placeholder="Your State"
            />
            <div style={{ paddingBottom: ".7rem", fontWeight: 700, color: "var(--text-4)" }}>
              vs
            </div>
            <SearchableSelect
              value={b}
              onChange={setB}
              placeholder="Compare Against"
              includeNational
            />
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
