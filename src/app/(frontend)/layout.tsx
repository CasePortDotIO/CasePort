import React from 'react'
import { Toaster } from 'sonner'
import './styles.css'

export const metadata = {
  metadataBase: new URL('https://www.caseport.io'),
  title: {
    default: 'CasePort — Case Flow Without Guesswork',
    template: '%s | CasePort',
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
    url: 'https://www.caseport.io',
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
      <body>
        <main>{children}</main>
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  )
}
