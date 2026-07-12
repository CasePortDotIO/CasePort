"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { glossary, glossaryCats } from "@/data";

/** Glossary live search + category filter. Mirrors the wiring in `guideGlossary`. */
export function GlossaryBrowser() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const sorted = useMemo(() => [...glossary].sort((a, b) => a.term.localeCompare(b.term)), []);
  const query = q.trim().toLowerCase();
  const items = sorted.map((g) => {
    const okCat = cat === "all" || g.cat === cat;
    const hay = (g.term + " " + g.def).toLowerCase();
    const okQ = !query || hay.indexOf(query) > -1;
    return { g, show: okCat && okQ };
  });
  const any = items.some((i) => i.show);

  return (
    <section className="section bg-white" style={{ paddingTop: "2rem" }}>
      <div className="container-4">
        <div className="gl-controls">
          <div className="gl-search">
            <span className="search-ic">
              <Icon name="search" />
            </span>
            <input
              type="search"
              id="glSearch"
              className="search-input"
              placeholder="Search terms… (e.g. “subrogation”, “damages”)"
              autoComplete="off"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="gl-chips">
            <button className={"gl-chip" + (cat === "all" ? " on" : "")} onClick={() => setCat("all")}>
              All
            </button>
            {glossaryCats.map((c) => (
              <button key={c} className={"gl-chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="gl-list" id="glList">
          {items.map(({ g, show }) => (
            <div key={g.term} className="gl-item r" style={{ display: show ? undefined : "none" }}>
              <div className="gl-item-head">
                <h3 className="gl-term">{g.term}</h3>
                <span className="gl-cat">{g.cat}</span>
              </div>
              <p className="gl-def">{g.def}</p>
              {g.links && g.links.length > 0 && (
                <div className="gl-links">
                  {g.links.map((l) => (
                    <Link key={l[1]} href={l[1].replace(/^#/, "")} className="card-link" style={{ fontSize: ".85rem" }}>
                      {l[0]} <Icon name="arrow" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {!any && (
          <p className="gl-empty" id="glEmpty">
            No terms match that.{" "}
            <button className="gl-clear" onClick={() => { setQ(""); setCat("all"); }}>
              Clear search
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
