import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type NavLink = { label: string; href: string; openInNewTab?: boolean }
export type FooterLink = { label: string; href: string }

export interface NavData {
  navLinks: NavLink[]
  ctaLabel: string
  ctaHref: string
  platformLinks: FooterLink[]
  resourceLinks: FooterLink[]
  legalLinks: FooterLink[]
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'For Law Firms', href: '/personal-injury-leads', openInNewTab: false },
  { label: 'Markets', href: '/markets', openInNewTab: false },
  { label: 'Insights', href: '/insights', openInNewTab: false },
  { label: 'Intelligence', href: '/intelligence', openInNewTab: false },
  { label: 'Injured?', href: '/injured', openInNewTab: false },
]

const DEFAULT_PLATFORM_LINKS: FooterLink[] = [
  { label: 'For Law Firms', href: '/personal-injury-leads' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'ROI Projection', href: '/#roi' },
  { label: 'Why CasePort', href: '/#why' },
  { label: 'FAQ', href: '/#faq' },
]
const DEFAULT_RESOURCE_LINKS: FooterLink[] = [
  { label: 'Insights', href: '/insights' },
  { label: 'Intelligence', href: '/intelligence' },
  { label: 'Injured?', href: '/injured' },
]
const DEFAULT_LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

/**
 * Fetches HeaderNav and FooterNav globals from Payload.
 * Falls back to hardcoded defaults if the globals haven't been saved yet.
 * Call this in server page.tsx files that render Navbar / Footer.
 */
export async function fetchNavData(): Promise<NavData> {
  const payload = await getPayload({ config: configPromise })

  const [headerNav, footerNav] = await Promise.all([
    payload.findGlobal({ slug: 'header-nav', depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: 'footer-nav', depth: 0 }).catch(() => null),
  ])

  return {
    navLinks: (headerNav as any)?.navLinks ?? DEFAULT_NAV_LINKS,
    ctaLabel: (headerNav as any)?.ctaLabel ?? 'Request Private Access',
    ctaHref: (headerNav as any)?.ctaHref ?? '/request-access',
    platformLinks: (footerNav as any)?.platformLinks ?? DEFAULT_PLATFORM_LINKS,
    resourceLinks: (footerNav as any)?.resourceLinks ?? DEFAULT_RESOURCE_LINKS,
    legalLinks: (footerNav as any)?.legalLinks ?? DEFAULT_LEGAL_LINKS,
  }
}
