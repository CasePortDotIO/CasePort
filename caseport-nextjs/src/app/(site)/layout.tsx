import "@/styles/globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { ScrollFX } from "@/components/ScrollFX";

/** Site chrome (everything except the standalone /checkmycase qualifier). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="texture" aria-hidden="true"></div>
      <div className="wrap">
        <Nav />
        <main id="app">{children}</main>
        <Footer />
      </div>
      <MobileStickyCTA />
      <ScrollFX />
    </>
  );
}
