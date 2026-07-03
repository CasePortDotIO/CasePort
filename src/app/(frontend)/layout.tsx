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
    <html lang="en">
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
        {/* Microsoft Clarity Tracking */}
        <Script id="clarity-tracking" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wpzk02jt9w");
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
