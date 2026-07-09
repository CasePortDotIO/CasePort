import Link from "next/link";
import { Icon } from "./AccidentsIcon";

/** Closing CTA band → /checkmycase (or custom link). Mirrors source `CP.ui.ctaBand()`. */
export function CTABand({
  title = "Ready to Protect Your Claim?",
  sub = "You do not need to decide anything today except one thing: get your information to someone who is legally obligated to protect it.",
  btn = "Start Free Case Review",
  link,
  href = "/checkmycase",
}: {
  title?: string;
  sub?: string;
  btn?: string;
  link?: string;
  href?: string;
}) {
  const resolvedHref = link || href
  return (
    <section className="cta-band">
      <div className="container-4">
        <h2>{title}</h2>
        <p>{sub}</p>
        <Link href={resolvedHref} className="btn btn-primary btn-lg">
          {btn} <Icon name="arrow" />
        </Link>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: ".82rem", marginTop: "1rem" }}>
          100% confidential. No obligation. No cost.
        </p>
      </div>
    </section>
  )
}
