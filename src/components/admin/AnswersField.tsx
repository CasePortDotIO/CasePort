'use client'

import { useField } from '@payloadcms/ui'

export default function AnswersField({ path }: { path: string }) {
  const { value } = useField<Record<string, any>>({ path })

  if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
    return (
      <div className="field-type" style={{ marginBottom: '1.5rem' }}>
        <label
          className="field-label"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}
        >
          Answers
        </label>
        <div style={{ fontStyle: 'italic', color: 'var(--theme-elevation-400)' }}>
          No answers recorded for this application.
        </div>
      </div>
    )
  }

  return (
    <div className="field-type" style={{ marginBottom: '2rem' }}>
      <label
        className="field-label"
        style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '1rem' }}
      >
        Submission Answers
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(value).map(([question, answer], index) => (
          <div
            key={index}
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--theme-elevation-50)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '6px',
            }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontSize: '1rem',
                color: 'var(--theme-elevation-800)',
              }}
            >
              {question}
            </div>

            <div style={{ color: 'var(--theme-elevation-600)', fontSize: '0.95rem' }}>
              {Array.isArray(answer) ? (
                <ul
                  style={{
                    paddingLeft: '1.25rem',
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  {answer.map((item, j) => (
                    <li key={j}>{String(item)}</li>
                  ))}
                </ul>
              ) : (
                <span>{String(answer)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
