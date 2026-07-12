"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

/**
 * Global overlays for article pages only (never hubs/start):
 *  - Reading-progress bar (top, sage→gold gradient, fills with scroll %).
 *  - Back-to-top button (bottom-right, fades in after 900px).
 * Mirrors `initReadingProgress` + the back-to-top button from `enhanceArticle`.
 */
export function ArticleOverlays() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const max = (document.body.scrollHeight || h.scrollHeight) - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      if (fillRef.current) fillRef.current.style.width = pct + "%";
      setShowTop(window.scrollY > 900);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div id="readProgress" className="read-progress">
        <span ref={fillRef} className="read-progress-fill"></span>
      </div>
      <button
        id="backToTop"
        className={"back-to-top" + (showTop ? " show" : "")}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Icon name="chevUp" />
      </button>
    </>
  );
}
