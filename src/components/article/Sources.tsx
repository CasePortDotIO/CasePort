'use client'

import { Icon } from '@/components/Icon'
import { SITE_URL } from '@/lib/accidents-constants'
import { useState } from 'react'

type SourceItem = { name: string; url: string }

const DEFAULT_SOURCES: [string, string][] = [
  ['National Highway Traffic Safety Administration (NHTSA)', 'https://www.nhtsa.gov/'],
  ['Insurance Information Institute', 'https://www.iii.org/'],
  ['American Bar Association', 'https://www.americanbar.org/'],
  ['Insurance Research Council', 'https://www.insurance-research.org/'],
]

/**
 * "Sources & Citations" — on every article page, before the final CTA.
 * Uses sources from the CMS block when available, falls back to defaults.
 */
export function Sources({
  medical = false,
  citeTitle,
  citeUrl,
  sources = [],
}: {
  medical?: boolean
  citeTitle?: string
  citeUrl?: string
  sources?: SourceItem[]
}) {
  const [copied, setCopied] = useState(false)

  const srcList: [string, string][] = sources.length > 0
    ? sources.map((s) => [s.name, s.url])
    : DEFAULT_SOURCES

  const title = citeTitle || 'Accident Law'
  const path = citeUrl ? `/${citeUrl.replace(/^\//, '')}` : ''
  const cite = `CasePort. "${title}." CasePort, 2026. ${SITE_URL}${path}`

  const copy = () => {
    const done = () => setCopied(true)
    if (navigator.clipboard) navigator.clipboard.writeText(cite).then(done, done)
    else done()
  }

  return (
    <section className="section bg-white sources-sec">
      <div className="container-4">
        <div className="sources r">
          <div className="sources-head">
            <Icon name="file" />
            Sources &amp; Citations
          </div>
          <ul className="sources-list">
            {srcList.map(([name, url]) => (
              <li key={name}>
                <a href={url || '#'} target="_blank" rel="nofollow noopener">
                  <Icon name="arrow" />
                  {name}
                </a>
              </li>
            ))}
          </ul>
          <div className="sources-cite">
            <span className="sources-cite-label">Cite this page</span>
            <code id="citeText">{cite}</code>
            <button className="sources-copy" id="citeCopy" onClick={copy}>
              <Icon name={copied ? 'check2' : 'file'} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
