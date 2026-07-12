"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { quickAnswerOrder, quickAnswers, accidentTypeOrder, accidentTypes } from "@/data";

interface Hit {
  href: string;
  q: string;
  a: string;
  t: string;
}

export function HubSearch() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const index = useMemo<Hit[]>(() => {
    const out: Hit[] = [];
    quickAnswerOrder.forEach((id) => {
      const qa = quickAnswers[id];
      out.push({
        href: `/accidents/${id}`,
        q: qa.question,
        a: qa.directAnswer,
        t: (qa.question + " " + qa.directAnswer + " " + (qa.keyFacts || []).join(" ")).toLowerCase(),
      });
    });
    accidentTypeOrder.forEach((k) => {
      const t = accidentTypes[k];
      out.push({
        href: `/accidents/${k}`,
        q: t.category + " Claims",
        a: t.subtitle,
        t: (t.title + " " + t.subtitle + " " + t.directAnswer).toLowerCase(),
      });
    });
    return out;
  }, []);

  const v = value.trim().toLowerCase();
  const hits = v ? index.filter((it) => it.t.indexOf(v) > -1).slice(0, 6) : [];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const showResults = open && v.length > 0;

  return (
    <div className="search" id="hubSearch" ref={wrapRef}>
      <div className="search-wrap">
        <span className="search-ic">
          <Icon name="search" />
        </span>
        <input
          type="search"
          className="search-input"
          id="hubSearchInput"
          placeholder="Search answers… (e.g., 'contributory negligence', 'statute of limitations', 'truck accident')"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {value && (
          <button
            className="search-clear"
            id="hubSearchClear"
            aria-label="Clear"
            onClick={() => setValue("")}
          >
            <Icon name="x" />
          </button>
        )}
      </div>
      {showResults && (
        <div className="search-results" id="hubSearchResults" style={{ display: "block" }}>
          {hits.length ? (
            hits.map((h) => (
              <Link
                key={h.href}
                className="search-result"
                href={h.href}
                onClick={() => setOpen(false)}
              >
                <div className="search-result-q">{h.q}</div>
                <div className="search-result-a">{h.a.slice(0, 120)}…</div>
              </Link>
            ))
          ) : (
            <div className="search-empty">
              No matches. Try “settlement”, “deadline”, or “fault”.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
