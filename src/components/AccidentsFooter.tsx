import Link from 'next/link'
import { accidentTypeOrder, accidentTypes } from '@/data'

/** Footer. Mirrors source `CP.ui.footer()`. */
export function Footer() {
  const typeLinks = accidentTypeOrder.slice(0, 5).map((k) => (
    <li key={k}>
      <Link href={`/accidents/${k}`}>{accidentTypes[k].category}</Link>
    </li>
  ))

  return (
    <footer className="footer">
      <div className="container-5">
        <div className="footer-grid">
          <div>
            <div className="footer-mark">
              <span className="nav-mark">CP</span>
              <span className="nav-name" style={{ color: '#fff' }}>
                CASEPORT
              </span>
            </div>
            <p>
              The definitive source for accident law by state. Attorney-reviewed. ABA compliant.
              State-specific negligence rules, city-level guides, and step-by-step first-hour
              actions.
            </p>
          </div>
          <div>
            <h4>Guides</h4>
            <ul>
              <li>
                <Link href="/guides">Guides Hub</Link>
              </li>
              <li>
                <Link href="/guides/dealing-with-insurance">Dealing With Insurance</Link>
              </li>
              <li>
                <Link href="/guides/how-contingency-fees-work">Contingency Fees</Link>
              </li>
              <li>
                <Link href="/guides/faq">Injury Claim FAQ</Link>
              </li>
              <li>
                <Link href="/guides/glossary">Glossary</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Injuries</h4>
            <ul>
              <li>
                <Link href="/injuries">Injuries Hub</Link>
              </li>
              <li>
                <Link href="/injuries/whiplash">Whiplash</Link>
              </li>
              <li>
                <Link href="/injuries/traumatic-brain-injury">Brain Injury (TBI)</Link>
              </li>
              <li>
                <Link href="/injuries/delayed-symptoms-after-car-accident">Delayed Symptoms</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Accident Types</h4>
            <ul>{typeLinks}</ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li>
                <Link href="/accidents/statute-of-limitations">Statute of Limitations</Link>
              </li>
              <li>
                <Link href="/accidents/contributory-negligence">Negligence Rules</Link>
              </li>
              <li>
                <Link href="/accidents/evidence-preservation">Evidence Preservation</Link>
              </li>
              <li>
                <Link href="/accidents/settlement-calculation">Settlement Calculation</Link>
              </li>
              <li>
                <Link href="/accidents/resources">All Resources &amp; Deadlines</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>By State</h4>
            <ul>
              <li>
                <Link href="/accidents/va">Virginia</Link>
              </li>
              <li>
                <Link href="/accidents/md">Maryland</Link>
              </li>
              <li>
                <Link href="/accidents/dc">Washington, D.C.</Link>
              </li>
              <li>
                <Link href="/accidents/ga">Georgia</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 CasePort.io. All rights reserved. Attorney-Reviewed. ABA Compliant.</p>
          <p className="disc">
            This page provides general information about personal injury law. It is not legal advice
            and does not create an attorney-client relationship. Prior results do not guarantee
            future outcomes.
          </p>
        </div>
      </div>
    </footer>
  )
}
