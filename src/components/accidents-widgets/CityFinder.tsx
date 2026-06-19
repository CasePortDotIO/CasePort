'use client'

import { Icon } from '@/components/Icon'
import { cityData } from '@/data'
import Link from 'next/link'
import { useState } from 'react'

export function CityFinder() {
  const [value, setValue] = useState('')
  const v = value.trim().toLowerCase()

  const cols = Object.keys(cityData).map((st) => {
    const d = cityData[st]
    const stateKey = (d.name + ' ' + d.abbr).toLowerCase()
    const stateMatch = !v || stateKey.indexOf(v) > -1
    const links = d.cities.map((c) => {
      const cityKey = (c.name + ' ' + d.name + ' ' + d.abbr).toLowerCase()
      const show = !v || stateMatch || cityKey.indexOf(v) > -1
      return { c, show, href: `/accidents/${st}/${c.slug}` }
    })
    const colHas = links.some((l) => l.show)
    return { st, d, links, colHas }
  })

  const anyVisible = cols.some((c) => c.colHas)

  return (
    <section className="section bg-cream">
      <div className="container-5">
        <div className="section-head">
          <h2 className="section-h">Find Your City</h2>
          <p className="section-sub">
            Local accident data, the controlling state law, and immediate first-hour actions — metro
            by metro. Live now across our launch markets and expanding to every major U.S. city.
          </p>
        </div>
        <div className="city-search" id="citySearch">
          <span className="search-ic">
            <Icon name="pin" />
          </span>
          <input
            type="search"
            className="search-input"
            id="citySearchInput"
            placeholder="Search your city or state… (e.g., 'Atlanta', 'Baltimore', 'Virginia')"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {value && (
            <button
              className="search-clear"
              id="citySearchClear"
              aria-label="Clear"
              onClick={() => setValue('')}
            >
              <Icon name="x" />
            </button>
          )}
        </div>
        <div className="city-grid" id="cityGrid">
          {cols.map(({ st, d, links, colHas }) => (
            <div
              key={st}
              className="city-col r"
              data-state={(d.name + ' ' + d.abbr).toLowerCase()}
              style={{ display: colHas ? undefined : 'none' }}
            >
              <div className="city-col-h">{d.name}</div>
              <div className="city-link-wrap">
                {links.map(({ c, show, href }) => (
                  <Link
                    key={c.slug}
                    href={href}
                    className="city-link"
                    style={{ display: show ? undefined : 'none' }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="city-empty" id="cityEmpty" style={{ display: anyVisible ? 'none' : 'block' }}>
          No live metro matches that yet — but every state has a complete law profile.{' '}
          <Link href="/accidents/california">Browse accident law by state</Link>
        </p>
      </div>
    </section>
  )
}
