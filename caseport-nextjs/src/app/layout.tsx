import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/constants";

const FAVICON =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%231a4a5a'/><text x='16' y='21' font-family='Inter,sans-serif' font-size='14' font-weight='800' fill='white' text-anchor='middle'>CP</text></svg>";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Accident Law by State — The Definitive Source | CasePort",
    template: "%s | CasePort",
  },
  description:
    "Attorney-reviewed accident guides. State-specific negligence rules, filing deadlines, settlement calculation, and city-level money pages. Updated quarterly. Free.",
  icons: { icon: FAVICON },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f9f5ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
