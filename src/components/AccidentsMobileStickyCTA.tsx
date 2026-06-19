"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./AccidentsIcon";

/**
 * Mobile sticky CTA: appears after 700px of scroll, dismissible, → /checkmycase.
 * Mirrors source `CP.ui.mSticky()` + the show/dismiss wiring in `initChrome`.
 */
export function MobileStickyCTA({ label = "Free Case Review" }: { label?: string }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) setShow(window.scrollY > 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  return (
    <div className={"msticky" + (show && !dismissed ? " show" : "")} id="msticky">
      <div className="mtxt">
        <strong>{label}</strong>
        <span>100% confidential · No cost</span>
      </div>
      <Link href="/checkmycase" className="btn btn-primary btn-sm">
        Start
      </Link>
      <button
        className="mclose"
        aria-label="Dismiss"
        onClick={() => {
          setDismissed(true);
          setShow(false);
        }}
      >
        <Icon name="x" />
      </button>
    </div>
  );
}
