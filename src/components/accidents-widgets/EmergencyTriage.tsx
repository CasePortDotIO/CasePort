'use client'

import { Icon } from '@/components/Icon'
import Link from 'next/link'
import { useState } from 'react'

const QUESTIONS: { id: string; q: string; level: 'red' | 'yellow' }[] = [
  {
    id: 'consciousness',
    q: 'Have you lost consciousness, or do you feel confused, disoriented, or unusually drowsy?',
    level: 'red',
  },
  {
    id: 'breathing',
    q: 'Do you have chest pain, trouble breathing, or shortness of breath?',
    level: 'red',
  },
  {
    id: 'bleeding',
    q: 'Is there heavy bleeding, a visible bone, or a severe open wound?',
    level: 'red',
  },
  {
    id: 'neuro',
    q: 'Do you have numbness, tingling, or weakness in your arms or legs?',
    level: 'red',
  },
  {
    id: 'abdomen',
    q: 'Do you have abdominal pain or bruising across your chest or stomach (e.g. from a seatbelt)?',
    level: 'red',
  },
  {
    id: 'headache',
    q: 'Do you have a headache that is getting worse, or repeated vomiting?',
    level: 'red',
  },
  {
    id: 'pain',
    q: 'Do you have moderate neck, back, or joint pain or stiffness?',
    level: 'yellow',
  },
  {
    id: 'delayed',
    q: 'Have new aches, headaches, or stiffness appeared since the crash?',
    level: 'yellow',
  },
  {
    id: 'mood',
    q: 'Are you feeling anxious, shaken, or unable to stop replaying the crash?',
    level: 'yellow',
  },
]

const RESULTS = {
  red: {
    cls: 'red',
    ic: 'alert',
    h: 'Seek emergency care now',
    p: 'Your answers include at least one red-flag symptom. Call 911 or go to the nearest ER immediately — some serious injuries (brain bleeds, internal bleeding, spinal injury) worsen fast and are not visible from the outside.',
    cta: 'After you are safe, learn your rights',
    label: 'Emergency',
  },
  yellow: {
    cls: 'yellow',
    ic: 'clock',
    h: 'See a doctor today',
    p: 'You reported symptoms that should be evaluated promptly — ideally the same day. Many injuries like whiplash and concussion have delayed symptoms, and a same-day medical record also protects a potential claim.',
    cta: 'What to watch for next',
    label: 'Urgent — same day',
  },
  green: {
    cls: 'green',
    ic: 'check',
    h: 'Monitor closely — but still get checked',
    p: 'You did not report red-flag symptoms right now. Still, adrenaline masks injuries for hours to days. Watch for new pain, headaches, numbness, or mood changes, and see a doctor promptly if any appear. A prompt visit also documents your injury.',
    cta: 'Read: delayed symptoms to watch for',
    label: 'Monitor',
  },
} as const

export function EmergencyTriage() {
  const [started, setStarted] = useState(false)
  const [i, setI] = useState(0)
  const [red, setRed] = useState(false)
  const [yellow, setYellow] = useState(false)

  const reset = () => {
    setStarted(false)
    setI(0)
    setRed(false)
    setYellow(false)
  }

  const answer = (yes: boolean) => {
    const q = QUESTIONS[i]
    let nextRed = red
    let nextYellow = yellow
    if (yes) {
      if (q.level === 'red') nextRed = true
      else nextYellow = true
    }
    setRed(nextRed)
    setYellow(nextYellow)
    if (yes && q.level === 'red') setI(QUESTIONS.length)
    else setI(i + 1)
  }

  const done = started && i >= QUESTIONS.length
  const frac = done ? 1 : i / QUESTIONS.length
  const level: 'red' | 'yellow' | 'green' = red ? 'red' : yellow ? 'yellow' : 'green'

  return (
    <section className="section bg-cream" data-widget="triage">
      <div className="container-4">
        <div className="section-head center">
          <h2 className="section-h">Is This an Emergency?</h2>
          <p className="section-sub center">
            A 30-second symptom check. Answer honestly — it points you to the right level of care.
            It is not a diagnosis.
          </p>
        </div>
        <div className="triage-card" id="triageCard">
          <div className="triage-progress">
            <div
              className="triage-bar"
              id="triageBar"
              style={{ width: Math.round(frac * 100) + '%' }}
            ></div>
          </div>
          <div id="triageBody">
            {!started ? (
              <div className="triage-intro">
                <div className="triage-ic">
                  <Icon name="steth" />
                </div>
                <h3>Quick symptom check</h3>
                <p>
                  We&rsquo;ll ask up to {QUESTIONS.length} yes/no questions about how you feel right
                  now. Your answers stay on your device.
                </p>
                <button className="btn btn-teal" onClick={() => setStarted(true)}>
                  Start the check
                </button>
              </div>
            ) : !done ? (
              <div className="triage-q">
                <div className="triage-step">
                  Question {i + 1} of {QUESTIONS.length}
                </div>
                <h3>{QUESTIONS[i].q}</h3>
                <div className="triage-actions">
                  <button className="btn btn-primary triage-ans" onClick={() => answer(true)}>
                    Yes
                  </button>
                  <button className="btn btn-ghost triage-ans" onClick={() => answer(false)}>
                    No
                  </button>
                </div>
              </div>
            ) : (
              <TriageResult level={level} onRestart={reset} />
            )}
          </div>
        </div>
        <p className="note" style={{ justifyContent: 'center', marginTop: '1.25rem' }}>
          <Icon name="alertC" />
          <span>
            If you think you are having a medical emergency, do not use this tool — call 911 now.
          </span>
        </p>
      </div>
    </section>
  )
}

function TriageResult({
  level,
  onRestart,
}: {
  level: 'red' | 'yellow' | 'green'
  onRestart: () => void
}) {
  const r = RESULTS[level]
  const ctaHref =
    level === 'green'
      ? '/injuries/delayed-symptoms-after-car-accident'
      : '/injuries/when-to-see-doctor-after-accident'
  return (
    <div className={'triage-result triage-' + r.cls}>
      <div className="triage-badge">
        <Icon name={r.ic} />
        <span>{r.label}</span>
      </div>
      <h3>{r.h}</h3>
      <p>{r.p}</p>
      <div className="triage-result-actions">
        {level === 'red' && (
          <a href="tel:911" className="btn btn-primary">
            <Icon name="phone" />
            Call 911
          </a>
        )}
        <Link href={ctaHref} className={'btn ' + (level === 'red' ? 'btn-ghost' : 'btn-teal')}>
          {r.cta} <Icon name="arrow" />
        </Link>
        <Link href="/checkmycase" className="btn btn-ghost">
          Free case review
        </Link>
      </div>
      <button className="triage-restart" onClick={onRestart}>
        <Icon name="back" />
        Start over
      </button>
      <p className="triage-disc">
        This tool is educational and not a medical diagnosis. When in doubt, seek professional care.
      </p>
    </div>
  )
}
