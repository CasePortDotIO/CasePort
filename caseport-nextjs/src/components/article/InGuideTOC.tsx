"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import type { ArticleSection } from "@/lib/article";

/**
 * Inline "In this guide" TOC card placed after the Direct Answer. Numbered, 2-col,
 * with IntersectionObserver scroll-spy + smooth-scroll jump links. Renders only when
 * there are 3+ sections. Mirrors the TOC card built in `enhanceArticle`.
 */
export function InGuideTOC({ sections }: { sections: ArticleSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length < 3) return;
    const heads = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!heads.length) return;

    const recompute = () => {
      let cur = heads[0].id;
      heads.forEach((h) => {
        if (h.getBoundingClientRect().top - 120 <= 0) cur = h.id;
      });
      setActive(cur);
    };
    const obs = new IntersectionObserver(recompute, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    });
    heads.forEach((h) => obs.observe(h));
    window.addEventListener("scroll", recompute, { passive: true });
    recompute();
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", recompute);
    };
  }, [sections]);

  if (sections.length < 3) return null;

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (t) {
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.pageYOffset - 88,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="toc-card r" aria-label="In this guide">
      <div className="toc-card-head">
        <Icon name="list" />
        In this guide
      </div>
      <ol className="toc-card-list">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={"#" + s.id}
              data-toc={s.id}
              className={active === s.id ? "active" : undefined}
              onClick={(e) => jump(e, s.id)}
            >
              <span className="toc-n">{i + 1}</span>
              <span className="toc-t">{s.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
