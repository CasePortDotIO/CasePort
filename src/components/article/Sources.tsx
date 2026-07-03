'use client'

import { Icon } from '@/components/Icon'
import { SITE_URL } from '@/lib/accidents-constants'
import { useState } from 'react'

const SRC_LEGAL: [string, string][] = [
  ['National Highway Traffic Safety Administration (NHTSA)', 'https://www.nhtsa.gov/'],
  ['Insurance Information Institute', 'https://www.iii.org/'],
  ['American Bar Association', 'https://www.americanbar.org/'],
  ['Insurance Research Council', 'https://www.insurance-research.org/'],
]
const SRC_MED: [string, string][] = [
  ['Centers for Disease Control and Prevention (CDC)', 'https://www.cdc.gov/'],
  ['National Institutes of Health (NIH / MedlinePlus)', 'https://medlineplus.gov/'],
  ['NHTSA — Traffic Safety Facts', 'https://www.nhtsa.gov/'],
  ['American Medical Association', 'https://www.ama-assn.org/'],
]

/**
 * "Sources & Citations" — on every article page, before the final CTA. Real
 * outbound links + a "Cite this page" block with a working Copy button that
 * stacks on mobile. Mirrors the sources block built in `enhanceArticle`.
 */
export function Sources({
  medical = false,
  citeTitle,
  citeUrl,
}: {
  medical?: boolean
  citeTitle: string
  citeUrl: string
}) {
  const [copied, setCopied] = useState(false)
  const src = medical ? SRC_MED : SRC_LEGAL
  const cite = `CasePort. "${citeTitle}." CasePort, 2026. ${SITE_URL}${citeUrl}`

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
            {src.map(([name, url]) => (
              <li key={url + name}>
                <a href={url} target="_blank" rel="nofollow noopener">
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
