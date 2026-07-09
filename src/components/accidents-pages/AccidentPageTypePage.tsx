/**
 * AccidentPageTypePage.tsx
 *
 * Unified renderer for all CMS-driven accident pages.
 * Receives a doc from the `accidentPages` collection and maps it
 * to the correct existing page component.
 */

import { AccidentTypePage } from './AccidentTypePage'
import { StateLandingPage } from './StateLandingPage'
import { StateTopicPage } from './StateTopicPage'
import { CityPage } from './CityPage'
import { QuickAnswerPage } from './QuickAnswerPage'

type Doc = {
  pageType: string
  fullSlug: string
  title: string
  state?: string
  cityKey?: string
  citySlug?: string
  accidentType?: string
  stateTopic?: string
  quickAnswerSlug?: string
  blocks?: any[]
  [key: string]: any
}

type Props = {
  doc: Doc
}

export function AccidentPageTypePage({ doc }: Props) {
  const { pageType, state, cityKey, citySlug, accidentType, stateTopic, quickAnswerSlug } = doc

  switch (pageType) {
    case 'accidentType': {
      // accidentType pages: /accidents/car-accident
      return <AccidentTypePage doc={doc} />
    }

    case 'state': {
      // State landing pages: /accidents/california
      return <StateLandingPage doc={doc} />
    }

    case 'stateTopic': {
      // State topic pages: /accidents/california/statute-of-limitations
      return <StateTopicPage doc={doc} />
    }

    case 'city': {
      // City pages: /accidents/ca/los-angeles
      return <CityPage doc={doc} />
    }

    case 'cityType': {
      // City + Type pages: /accidents/ca/los-angeles/car-accident
      return <CityPage doc={doc} />
    }

    case 'quickAnswer': {
      // Quick answer pages: /accidents/what-to-do-after-accident
      return <QuickAnswerPage doc={doc} />
    }

    default:
      return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <h1>Page type "{pageType}" not yet rendered</h1>
          <p>Full slug: {doc.fullSlug}</p>
        </div>
      )
  }
}
