"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll/first-paint effects, re-run on every route change:
 *  - Fonts-ready gate: hold `#app` opacity until webfonts load (cap 1.2s), then
 *    add `fonts-ready` to <html> so the first paint is already in Cormorant.
 *  - Reveal-on-scroll: elements with `.r` fade + rise via IntersectionObserver
 *    (threshold 0.12); easing handled by the ported CSS.
 * Mirrors source `CP.boot()` reveal gate + `initChrome` reveal observer.
 */
export function ScrollFX() {
  const pathname = usePathname();

  // Fonts-ready gate (once).
  useEffect(() => {
    const reveal = () => document.documentElement.classList.add("fonts-ready");
    if (document.fonts && (document.fonts as FontFaceSet).ready) {
      (document.fonts as FontFaceSet).ready.then(reveal).catch(reveal);
    }
    const t = setTimeout(reveal, 1200);
    return () => clearTimeout(t);
  }, []);

  // Reveal-on-scroll, re-observed per route.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".r"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    // Anything already in view reveals immediately.
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) el.classList.add("in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
