import Link from "next/link";
import { Icon } from "./AccidentsIcon";

/** Closing CTA band → /checkmycase. Mirrors source `CP.ui.ctaBand()`. */
export function CTABand({
  title = "Ready to Protect Your Claim?",
  sub = "You do not need to decide anything today except one thing: get your information to someone who is legally obligated to protect it.",
  btn = "Start Free Case Review",
}: {
  title?: string;
  sub?: string;
  btn?: string;
}) {
  return (
    <section className="cta-band">
      <div className="container-4">
        <h2>{title}</h2>
        <p>{sub}</p>
        <Link href="/checkmycase" className="btn btn-primary btn-lg">
          {btn} <Icon name="arrow" />
        </Link>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: ".82rem", marginTop: "1rem" }}>
          100% confidential. No obligation. No cost.
        </p>
      </div>
    </section>
  );
}
