"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

interface Head {
  id: string;
  label: string;
}

interface SectionTOCProps {
  initialHeads?: Head[];
}

const EXCLUDE =
  /^(explore|other |more on |more in |related|keep reading|browse|find your|the key questions|take the next step|frequently asked|people also ask|ready to|questions about|protect your|not sure|injured in|living with|just had|already|worried|hurt on|have a|didn.t find|still have|about these)/i;

/**
 * In-guide TOC for content pages whose body uses `section h2.section-h` headings
 * (state / city / guide). Discovers headings, assigns ids, and runs scroll-spy —
 * mirroring the heading logic in source `enhanceArticle`. Renders only when 3+
 * real content sections exist.
 */
export function SectionTOC({ initialHeads }: SectionTOCProps) {
  const [heads, setHeads] = useState<Head[]>(initialHeads || []);
  const [active, setActive] = useState<string>(initialHeads?.[0]?.id || "");

  useEffect(() => {
    // If we already have heads from CMS, skip DOM discovery
    if (heads.length > 0) {
      setActive(heads[0].id);
      return;
    }

    const app = document.getElementById("app");
    if (!app) return;

    let els = Array.from(
      app.querySelectorAll<HTMLElement>(".prose h2, .prose-sec h2")
    ).filter((h) => (h.textContent || "").trim().length > 1);
    if (els.length < 2) {
      els = Array.from(app.querySelectorAll<HTMLElement>(".section-head h2, section h2.section-h")).filter(
        (h) => {
          const t = (h.textContent || "").trim();
          return t.length > 1 && !EXCLUDE.test(t);
        }
      );
    }
    if (els.length < 2) {
      setHeads([]);
      return;
    }

    const list: Head[] = els.map((h, i) => {
      if (!h.id)
        h.id =
          "sec-" +
          (i + 1) +
          "-" +
          (h.textContent || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 36);
      return { id: h.id, label: (h.textContent || "").trim() };
    });
    setHeads(list);
    setActive(list[0].id);

    const recompute = () => {
      let cur = els[0].id;
      els.forEach((h) => {
        if (h.getBoundingClientRect().top - 120 <= 0) cur = h.id;
      });
      setActive(cur);
    };
    const obs = new IntersectionObserver(recompute, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    });
    els.forEach((h) => obs.observe(h));
    window.addEventListener("scroll", recompute, { passive: true });
    recompute();
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", recompute);
    };
  }, []);

  if (heads.length < 2) return null;

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (t)
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.pageYOffset - 88,
        behavior: "smooth",
      });
  };

  return (
    <nav className="toc-card r in" aria-label="In this guide">
      <div className="toc-card-head">
        <Icon name="list" />
        In this guide
      </div>
      <ol className="toc-card-list">
        {heads.map((h, i) => (
          <li key={h.id}>
            <a
              href={"#" + h.id}
              data-toc={h.id}
              className={active === h.id ? "active" : undefined}
              onClick={(e) => jump(e, h.id)}
            >
              <span className="toc-n">{i + 1}</span>
              <span className="toc-t">{h.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
