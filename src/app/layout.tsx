// Root layout: minimal shell. No <html>/<body>/<main> — each route group provides its own.

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'),
  title: {
    default: 'CasePort — Case Flow Without Guesswork',
    template: '%s',
  },
  description:
    'Premium case acquisition system for personal injury law firms. Structured, disciplined case flow infrastructure for growth-oriented PI firms.',
  keywords: [
    'personal injury leads',
    'PI law firm',
    'case acquisition',
    'legal marketing',
    'injury leads',
  ],
  openGraph: {
    siteName: 'CasePort',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@caseport',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
