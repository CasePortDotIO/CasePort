'use client'

import Link from 'next/link'
import { useState } from 'react'

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

/** Settlement take-home calculator. Mirrors `CP.widgets.takeHome()` + `_thRender`. */
export function TakeHome({ bg = 'bg-warm' }: { bg?: string }) {
  const [gross, setGross] = useState('')
  const [fee, setFee] = useState(33)
  const [costs, setCosts] = useState(4000)
  const [liens, setLiens] = useState(15000)

  const g = Math.max(0, parseFloat(gross) || 0)
  const feeAmt = (g * fee) / 100
  const net = Math.max(0, g - feeAmt - costs - liens)
  const pct = g > 0 ? Math.round((net / g) * 100) : 0
  const seg = (val: number) => (g > 0 ? Math.max(0, (val / g) * 100) : 0)

  return (
    <section className={'section ' + bg} data-widget="takeHome">
      <div className="container-4">
        <div className="section-head center">
          <h2 className="section-h">What Will You Actually Take Home?</h2>
          <p className="section-sub center">
            Everyone shows the settlement number. Almost no one shows what reaches your pocket —
            after the attorney fee, case costs, and medical liens. Here it is.
          </p>
        </div>
        <div className="calc-card" style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <div className="field">
            <label htmlFor="thGross">Settlement amount</label>
            <div className="th-input">
              <span className="th-dollar">$</span>
              <input
                type="number"
                id="thGross"
                placeholder="100,000"
                min="0"
                inputMode="numeric"
                value={gross}
                onChange={(e) => setGross(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="thFee">
              Attorney fee <span className="th-out">{fee}%</span>
            </label>
            <input
              type="range"
              id="thFee"
              className="th-range"
              min={25}
              max={40}
              step={1}
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
            />
            <div className="th-scale">
              <span>25%</span>
              <span>pre-trial 33% · trial ~40%</span>
              <span>40%</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="thCosts">
              Case costs <span className="th-sub">(filing, experts, records)</span>{' '}
              <span className="th-out">{fmt(costs)}</span>
            </label>
            <input
              type="range"
              id="thCosts"
              className="th-range"
              min={0}
              max={30000}
              step={500}
              value={costs}
              onChange={(e) => setCosts(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label htmlFor="thLiens">
              Medical liens <span className="th-sub">(insurer / Medicare / providers)</span>{' '}
              <span className="th-out">{fmt(liens)}</span>
            </label>
            <input
              type="range"
              id="thLiens"
              className="th-range"
              min={0}
              max={100000}
              step={1000}
              value={liens}
              onChange={(e) => setLiens(Number(e.target.value))}
            />
          </div>
          <div className="th-result" id="thResult">
            <div className="th-headline">
              <span className="th-h-label">You take home</span>
              <span className="th-h-num">{fmt(net)}</span>
              <span className="th-h-pct">{pct}% of the settlement</span>
            </div>
            <div className="th-bar">
              <div
                className="th-bar-seg net"
                style={{ width: seg(net) + '%' }}
                title={`Your net: ${fmt(net)}`}
              ></div>
              <div
                className="th-bar-seg fee"
                style={{ width: seg(feeAmt) + '%' }}
                title={`Attorney fee: ${fmt(feeAmt)}`}
              ></div>
              <div
                className="th-bar-seg costs"
                style={{ width: seg(costs) + '%' }}
                title={`Case costs: ${fmt(costs)}`}
              ></div>
              <div
                className="th-bar-seg liens"
                style={{ width: seg(liens) + '%' }}
                title={`Liens: ${fmt(liens)}`}
              ></div>
            </div>
            <div className="th-legend">
              <span className="th-leg">
                <i className="net"></i>Your net recovery <b>{fmt(net)}</b>
              </span>
              <span className="th-leg">
                <i className="fee"></i>Attorney fee <b>{fmt(feeAmt)}</b>
              </span>
              <span className="th-leg">
                <i className="costs"></i>Case costs <b>{fmt(costs)}</b>
              </span>
              <span className="th-leg">
                <i className="liens"></i>Medical liens <b>{fmt(liens)}</b>
              </span>
            </div>
          </div>
          <p className="est-note" style={{ marginTop: '1rem' }}>
            Illustrative only. Fees, costs, and liens vary by case and state — and liens are often
            negotiable, which can raise your net. This is general information, not a quote or legal
            advice.
          </p>
        </div>
        <div className="th-links" id="thLinks">
          <Link href="/guide/how-contingency-fees-work" className="card-link">
            How the attorney fee works
          </Link>
          <Link href="/guide/medical-liens-subrogation" className="card-link">
            How liens are negotiated down
          </Link>
        </div>
      </div>
    </section>
  )
}
