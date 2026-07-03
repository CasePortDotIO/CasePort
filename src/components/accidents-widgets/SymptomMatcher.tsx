'use client'

import { Icon } from '@/components/Icon'
import { bodyRegions, injuries } from '@/data'
import Link from 'next/link'
import { useState } from 'react'

const POS: Record<string, [number, number]> = {
  head: [180, 56],
  mind: [256, 74],
  neck: [180, 118],
  shoulder: [244, 150],
  internal: [180, 206],
  spine: [180, 276],
  soft: [150, 372],
  bones: [210, 452],
  burns: [112, 250],
}

function Panel({ regionId }: { regionId: string | null }) {
  const region = regionId ? bodyRegions.find((r) => r.id === regionId) : null
  if (!region) {
    return (
      <div className="empty">
        <Icon name="steth" />
        <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-4)' }}>
          Select an area
        </p>
        <p style={{ fontSize: '.9rem', marginTop: '.4rem' }}>
          Choose a body region to see the injuries that commonly affect it after a collision.
        </p>
      </div>
    )
  }
  return (
    <div className="sm-result">
      <div className="sm-region-h">{region.label}</div>
      {region.injuries.map((slug) => {
        const inj = injuries[slug]
        if (!inj) return null
        return (
          <Link key={slug} href={`/injuries/${slug}`} className="sm-injury">
            <div className="sm-inj-top">
              <span className="sm-inj-ic">
                <Icon name={inj.icon} />
              </span>
              <span className="sm-inj-name">{inj.name}</span>
            </div>
            <p className="sm-inj-watch">
              <b>Watch for:</b> {inj.symptoms.immediate.slice(0, 3).join(', ')}.
            </p>
            <span className="card-link" style={{ marginTop: '.6rem', fontSize: '.85rem' }}>
              See full guide
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export function SymptomMatcher() {
  const [sel, setSel] = useState<string | null>(null)

  return (
    <section className="section bg-white" data-widget="symptomMatcher">
      <div className="container">
        <div className="section-head center">
          <h2 className="section-h">Where Does It Hurt?</h2>
          <p className="section-sub center">
            Tap the part of your body affected in the crash. We&rsquo;ll show the injuries that
            match — and exactly what to watch for.
          </p>
        </div>
        <div className="sm-layout">
          <div className="sm-picker">
            <div className="sm-bodywrap">
              <svg
                className="sm-figure"
                viewBox="0 0 360 560"
                role="img"
                aria-label="Body region selector"
              >
                <g className="sm-silhouette">
                  <circle cx="180" cy="56" r="34"></circle>
                  <rect x="166" y="84" width="28" height="26" rx="11"></rect>
                  <path d="M126 112 Q180 100 234 112 L226 250 Q180 264 134 250 Z"></path>
                  <rect x="86" y="118" width="30" height="150" rx="15"></rect>
                  <rect x="244" y="118" width="30" height="150" rx="15"></rect>
                  <rect x="140" y="250" width="34" height="232" rx="17"></rect>
                  <rect x="186" y="250" width="34" height="232" rx="17"></rect>
                </g>
                {bodyRegions.map((r, i) => {
                  const p = POS[r.id] || [180, 280]
                  return (
                    <g
                      key={r.id}
                      className={'sm-pin' + (sel === r.id ? ' sel' : '')}
                      data-region={r.id}
                      tabIndex={0}
                      role="button"
                      aria-label={r.label}
                      onClick={() => setSel(r.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSel(r.id)
                        }
                      }}
                    >
                      <circle className="sm-pin-hit" cx={p[0]} cy={p[1]} r={22}></circle>
                      <circle className="sm-pin-dot" cx={p[0]} cy={p[1]} r={15}></circle>
                      <text className="sm-pin-num" x={p[0]} y={p[1] + 5} textAnchor="middle">
                        {i + 1}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="sm-regions">
              {bodyRegions.map((r, i) => (
                <button
                  key={r.id}
                  className={'sm-region' + (sel === r.id ? ' sel' : '')}
                  data-region={r.id}
                  onClick={() => setSel(r.id)}
                >
                  <span className="sm-num">{i + 1}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="sm-panel" id="smPanel">
            <Panel regionId={sel} />
          </div>
        </div>
        <p className="note" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
          <Icon name="alertC" />
          <span>
            This is educational guidance, not a diagnosis. If you have emergency symptoms, call 911
            or go to the ER.
          </span>
        </p>
      </div>
    </section>
  )
}
