import { Footer } from '@/components/AccidentsFooter'
import { MobileStickyCTA } from '@/components/AccidentsMobileStickyCTA'
import { Nav } from '@/components/AccidentsNav'
import { ScrollFX } from '@/components/AccidentsScrollFX'
import '../../styles/accidents-theme.css'

export const metadata = {
  title: {
    default: 'CasePort — Personal Injury Guide',
    template: '%s | CasePort',
  },
  description:
    'Your guide to personal injury claims, settlements, and legal options. Free information from CasePort.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function AccidentsSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      />
      <div id="accidents-app">
        <ScrollFX />
        <Nav />
        <main>{children}</main>
        <Footer />
        <MobileStickyCTA />
      </div>
    </>
  )
}
