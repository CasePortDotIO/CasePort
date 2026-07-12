"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

/**
 * Sticky nav: fades in after 480px of scroll; brand mark; hub links + Accident
 * Types; "Free Case Review" CTA → /checkmycase; mobile hamburger → full-screen
 * menu. Mirrors source `CP.ui.nav()` + the scroll/menu wiring in `initChrome`.
 */
export function Nav() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className={"nav" + (visible ? " is-visible" : "")} id="nav">
        <Link href="/accidents" className="nav-brand">
          <span className="nav-mark">CP</span>
          <span className="nav-name">CASEPORT</span>
        </Link>
        <div className="nav-links">
          <Link className="nav-link" href="/accidents">
            Accidents
          </Link>
          <Link className="nav-link" href="/injuries">
            Injuries
          </Link>
          <Link className="nav-link" href="/guide">
            Guides
          </Link>
          <Link className="nav-link" href="/accidents/car-accident">
            Accident Types
          </Link>
        </div>
        <div className="nav-right">
          <Link href="/checkmycase" className="nav-cta">
            Free Case Review
          </Link>
          <button
            className="nav-burger"
            id="navBurger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div
        className={"mobile-menu" + (menuOpen ? " open" : "")}
        id="mobileMenu"
        aria-hidden={!menuOpen}
      >
        <div className="mm-head">
          <Link href="/accidents" className="nav-brand" onClick={close}>
            <span className="nav-mark">CP</span>
            <span className="nav-name" style={{ color: "var(--teal)" }}>
              CASEPORT
            </span>
          </Link>
          <button className="mm-close" aria-label="Close menu" onClick={close}>
            <Icon name="x" />
          </button>
        </div>
        <nav className="mm-links">
          <Link href="/accidents" onClick={close}>
            Accidents Hub
          </Link>
          <Link href="/injuries" onClick={close}>
            Injuries Hub
          </Link>
          <Link href="/guide" onClick={close}>
            Guides Hub
          </Link>
          <Link href="/accidents/car-accident" onClick={close}>
            Accident Types
          </Link>
          <Link href="/accidents/statute-of-limitations" onClick={close}>
            Deadlines &amp; Rules
          </Link>
          <Link href="/accidents/california" onClick={close}>
            Browse by State
          </Link>
          <Link href="/accidents/ga/atlanta" onClick={close}>
            Find Your City
          </Link>
        </nav>
        <Link
          href="/checkmycase"
          className="btn btn-primary btn-block btn-lg"
          onClick={close}
          style={{ marginTop: "1.5rem" }}
        >
          Start Free Case Review <Icon name="arrow" />
        </Link>
        <p className="mm-foot">100% confidential · No cost · Attorney-reviewed</p>
      </div>
    </>
  );
}
