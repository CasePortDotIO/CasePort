import Link from "next/link";
import { Icon } from "@/components/Icon";

/** Graceful 404 with nav. Mirrors source `CP.pages.notFound()`. */
export default function NotFound() {
  return (
    <section className="page-intro">
      <div className="container-4" style={{ textAlign: "center", paddingTop: "9rem" }}>
        <div className="eyebrow center" style={{ marginBottom: ".9rem" }}>
          404
        </div>
        <h1 style={{ margin: "0 auto" }}>This page is still being built.</h1>
        <p className="section-sub center" style={{ margin: "1rem auto 2rem" }}>
          The accident resource you are looking for is not here yet — but the full
          hub, every accident type, and all 50 states plus DC are live.
        </p>
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/accidents" className="btn btn-primary">
            Back to the Accidents Hub <Icon name="arrow" />
          </Link>
          <Link href="/checkmycase" className="btn btn-ghost">
            Free Case Review
          </Link>
        </div>
      </div>
    </section>
  );
}
