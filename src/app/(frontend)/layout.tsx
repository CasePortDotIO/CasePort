import Script from 'next/script'
import React from 'react'
import { Toaster } from 'sonner'
import './styles.css'

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

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SBN7G1VHGV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SBN7G1VHGV');
          `}
        </Script>
      </head>
      <body>
        <main>{children}</main>
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  )
}
