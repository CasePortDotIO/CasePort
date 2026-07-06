'use client'

import { useEffect, useState } from 'react'
import type { OpsCockpit, OpsEventRow, OpsLane } from '@/lib/ops/cockpit'

/**
 * The internal operations cockpit UI. One fused view of the two engines that
 * share this backend: the CasePort Intelligence Core aims, the Demand Capture
 * Engine executes, and the shared event log closes the loop. Read only in this
 * cut; the human gated actions are a fast follow.
 *
 * Institutional and dense, a Bloomberg style terminal. Every number on screen
 * traces to a real record or a real event; nothing here is fabricated.
 */

// Deterministic, timezone safe formatting from the ISO string. Avoids hydration
// drift and reads as a terminal (UTC).
const t = (iso: string): string => (iso ? `${iso.slice(11, 16)}Z` : '--:--')
const d = (iso: string): string => (iso ? iso.slice(0, 10) : '')

const LANE_LABEL: Record<OpsLane, string> = {
  intelligence: 'Intelligence Core',
  demand: 'Demand Capture',
  core: 'Backend Core',
}

export function OpsCockpitClient({ cockpit, operator }: { cockpit: OpsCockpit; operator: string | null }) {
  return (
    <div className="ops-root">
      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <Header cockpit={cockpit} operator={operator} />
        <hr className="ops-rule-gold mt-0 border-0" />
        {!cockpit.online && <OfflineBanner />}
        <Flywheel cockpit={cockpit} />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <IntelligencePanel cockpit={cockpit} />
            <DemandPanel cockpit={cockpit} />
          </div>
          <EventFeed events={cockpit.events} online={cockpit.online} />
        </div>
        <Footer cockpit={cockpit} />
      </div>
    </div>
  )
}

function Header({ cockpit, operator }: { cockpit: OpsCockpit; operator: string | null }) {
  const [clock, setClock] = useState<string>(t(cockpit.generatedAt))
  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19) + 'Z')
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b ops-hairline pb-4">
      <div className="flex items-center gap-3">
        <span
          className={`lane-demand lane-dot ${cockpit.online ? 'ops-live' : ''}`}
          style={{ background: cockpit.online ? undefined : 'var(--muted-foreground)' }}
          aria-hidden
        />
        <div>
          <div className="ops-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-[color:var(--gold-deep)]">
            CasePort
          </div>
          <div className="ops-display text-2xl text-[color:var(--teal-deep)]">Internal Operations</div>
          <div className="mt-0.5 text-[12px] text-[color:var(--muted-foreground)]">
            Intelligence Core and Demand Capture, one flywheel
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5 text-right">
        <div>
          <div className="ops-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
            {cockpit.online ? 'Live' : 'Offline'}
          </div>
          <div className="ops-mono text-sm tabular-nums">{clock}</div>
        </div>
        <div className="max-w-[180px] truncate">
          <div className="ops-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
            Operator
          </div>
          <div className="truncate text-sm">{operator ?? 'not signed in'}</div>
        </div>
      </div>
    </header>
  )
}

function OfflineBanner() {
  return (
    <div className="mt-4 rounded-md border border-[color:var(--chart-3)] bg-[color:var(--chart-3)]/10 px-4 py-3 text-sm text-[color:var(--chart-3)]">
      Console is offline. The database is cold or not connected, so no live engine state is available. This is
      expected on a preview deploy.
    </div>
  )
}

/* The fusion narrative: aim, capture, learn. */
function Flywheel({ cockpit }: { cockpit: OpsCockpit }) {
  const f = cockpit.flywheel
  return (
    <section className="mt-4 grid gap-3 md:grid-cols-3">
      <FlywheelStage
        lane="intelligence"
        step="01"
        title="Aim"
        subtitle="Intelligence Core"
        blurb="Owned and rented signals, rated and deduplicated, point the engine."
        metrics={[
          { label: 'Active signals', value: f.activeSignals },
          { label: 'Sources', value: f.sources },
        ]}
      />
      <FlywheelStage
        lane="demand"
        step="02"
        title="Capture"
        subtitle="Demand Capture"
        blurb="Defensible data cells pursued and assets published, in funded markets only."
        metrics={[
          { label: 'Pursued cells', value: f.pursuedCells },
          { label: 'Published assets', value: f.publishedAssets },
          { label: 'Funded markets', value: f.fundedMarkets },
        ]}
      />
      <FlywheelStage
        lane="core"
        step="03"
        title="Learn"
        subtitle="Shared event log"
        blurb="Every action across both engines is evented, replayable, and auditable."
        metrics={[{ label: 'Events on the log', value: f.eventsTotal }]}
      />
    </section>
  )
}

function FlywheelStage({
  lane,
  step,
  title,
  subtitle,
  blurb,
  metrics,
}: {
  lane: OpsLane
  step: string
  title: string
  subtitle: string
  blurb: string
  metrics: Array<{ label: string; value: number }>
}) {
  return (
    <div className="ops-card ops-card-hover p-5">
      <div className={`lane-wash-${lane} -mx-5 -mt-5 mb-4 flex items-center justify-between rounded-t-[0.75rem] px-5 py-2.5`}>
        <div className="flex items-center gap-2">
          <span className={`lane-${lane} lane-dot`} aria-hidden />
          <span className={`lane-${lane} ops-mono text-[11px] uppercase tracking-[0.16em]`}>{subtitle}</span>
        </div>
        <span className="ops-mono text-[11px] text-[color:var(--muted-foreground)]">{step}</span>
      </div>
      <div className="ops-display text-xl text-[color:var(--ink)]">{title}</div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--secondary-foreground)]">{blurb}</p>
      <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className={`lane-${lane} ops-display text-4xl`}>{m.value.toLocaleString('en-US')}</div>
            <div className="ops-mono mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[color:var(--muted-foreground)]">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Panel({
  lane,
  title,
  subtitle,
  children,
}: {
  lane: OpsLane
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="ops-card p-5">
      <div className="flex items-baseline gap-2.5 border-b ops-hairline pb-3">
        <span className={`lane-${lane} lane-dot self-center`} aria-hidden />
        <h2 className="ops-display text-lg text-[color:var(--ink)]">{title}</h2>
        <span className="ops-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
          {subtitle}
        </span>
      </div>
      <div className="pt-4">{children}</div>
    </section>
  )
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div>
      <div className={`ops-mono text-xl font-semibold tabular-nums ${accent ?? ''}`}>
        {typeof value === 'number' ? value.toLocaleString('en-US') : value}
      </div>
      <div className="ops-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--muted-foreground)]">
        {label}
      </div>
    </div>
  )
}

const RATING_ACCENT: Record<string, string> = { A: 'lane-demand', B: 'text-[color:var(--chart-3)]', C: 'text-[color:var(--muted-foreground)]' }

function IntelligencePanel({ cockpit }: { cockpit: OpsCockpit }) {
  const { sources, signals } = cockpit.cic
  const empty = sources.total === 0 && signals.total === 0
  return (
    <Panel lane="intelligence" title="Intelligence Core" subtitle="owned and rented, fused">
      {empty ? (
        <EmptyState line="No sources registered and no signals ingested yet. Register an allowlisted source and the epistemic gate begins to fill this in." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Sources" value={sources.total} />
            <Metric label="Active signals" value={signals.active} accent="lane-demand" />
            <Metric label="Superseded" value={signals.superseded} accent="text-[color:var(--muted-foreground)]" />
            <Metric label="Prohibited src" value={sources.prohibited} accent="text-[color:var(--chart-4)]" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border ops-hairline px-3 py-2">
            <SubHead>Domain synthesis</SubHead>
            <InlineStat label="Artifacts" value={cockpit.cic.synthesis.artifacts} />
            <InlineStat label="Recs proposed" value={cockpit.cic.synthesis.recommendationsProposed} accent="lane-demand" />
            <InlineStat
              label="Recs blocked"
              value={cockpit.cic.synthesis.recommendationsRejected}
              accent="text-[color:var(--chart-4)]"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <SubHead>Sources by reliability</SubHead>
              <div className="mt-2 flex gap-2">
                {(['A', 'B', 'C'] as const).map((r) => (
                  <div key={r} className="ops-card flex-1 px-3 py-2 text-center">
                    <div className={`ops-mono text-lg font-semibold ${RATING_ACCENT[r]}`}>{sources.byRating[r]}</div>
                    <div className="ops-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--muted-foreground)]">
                      Rating {r}
                    </div>
                  </div>
                ))}
              </div>
              <SubHead className="mt-4">Active signals by domain</SubHead>
              <div className="mt-2 space-y-1.5">
                {(['demand', 'supply', 'regulatory', 'market'] as const).map((dom) => (
                  <Bar key={dom} label={dom} value={signals.byDomain[dom]} max={Math.max(1, signals.active)} />
                ))}
              </div>
            </div>

            <div>
              <SubHead>Registry</SubHead>
              <div className="mt-2 space-y-1.5">
                {sources.rows.slice(0, 6).map((s) => (
                  <div key={s.sourceKey} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate">{s.name || s.sourceKey}</span>
                    <span className="flex items-center gap-2">
                      <span className={`ops-mono ${RATING_ACCENT[s.reliability] ?? ''}`}>{s.reliability}</span>
                      <StatusTag status={s.status} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {signals.recent.length > 0 && (
            <div className="mt-5">
              <SubHead>Latest signals</SubHead>
              <div className="mt-2 space-y-2">
                {signals.recent.slice(0, 4).map((s, i) => (
                  <div key={i} className="border-b ops-hairline pb-2 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`ops-mono text-[10px] uppercase tracking-[0.12em] lane-intelligence`}>
                        {s.domain} · {s.sourceKey}
                      </span>
                      <span className="ops-mono text-[10px] text-[color:var(--muted-foreground)]">
                        {d(s.observedAt)} · {s.reliability} · {s.status}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-[color:var(--secondary-foreground)]">{s.claim}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  )
}

const STATUS_ACCENT: Record<string, string> = {
  published: 'lane-demand',
  active: 'lane-demand',
  pursue: 'lane-demand',
  rejected: 'text-[color:var(--chart-4)]',
  prohibited: 'text-[color:var(--chart-4)]',
  ignore: 'text-[color:var(--muted-foreground)]',
  draft: 'text-[color:var(--muted-foreground)]',
  'pending-approval': 'text-[color:var(--chart-3)]',
  retired: 'text-[color:var(--muted-foreground)]',
}

function DemandPanel({ cockpit }: { cockpit: OpsCockpit }) {
  const { cells, assets, fundedMarkets } = cockpit.demand
  const empty = cells.total === 0 && assets.total === 0
  return (
    <Panel lane="demand" title="Demand Capture" subtitle="harvest, never intercept">
      {empty ? (
        <EmptyState line="No demand cells scored and no capture assets yet. Score a cell in a funded market and the pre publish gate begins to fill this in." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Cells pursued" value={cells.pursue} accent="lane-demand" />
            <Metric label="Cells ignored" value={cells.ignore} accent="text-[color:var(--muted-foreground)]" />
            <Metric label="Published" value={assets.byStatus.published ?? 0} accent="lane-demand" />
            <Metric label="Funded markets" value={fundedMarkets.length} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border ops-hairline px-3 py-2">
            <SubHead>B2B outbound</SubHead>
            <InlineStat label="Targets" value={cockpit.demand.b2b.targets} />
            <InlineStat label="Pending send" value={cockpit.demand.b2b.outboundPending} accent="text-[color:var(--chart-3)]" />
            <InlineStat label="Sent" value={cockpit.demand.b2b.outboundSent} accent="lane-demand" />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <SubHead>Top pursued cells</SubHead>
              <div className="mt-2 space-y-1.5">
                {cells.topPursued.length === 0 && <Muted>None pursued yet.</Muted>}
                {cells.topPursued.map((c) => (
                  <div key={c.cellKey} className="flex items-center justify-between gap-2 text-xs">
                    <span className="ops-mono truncate">{c.cellKey}</span>
                    <span className="ops-mono lane-demand tabular-nums">{c.score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {Object.keys(cells.byIgnoreReason).length > 0 && (
                <>
                  <SubHead className="mt-4">Ignored, by reason</SubHead>
                  <div className="mt-2 space-y-1.5">
                    {Object.entries(cells.byIgnoreReason).map(([reason, n]) => (
                      <div key={reason} className="flex items-center justify-between text-xs">
                        <span className="text-[color:var(--secondary-foreground)]">{reason}</span>
                        <span className="ops-mono tabular-nums">{n}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <SubHead>Asset pipeline</SubHead>
              <div className="mt-2 space-y-1.5">
                {(['draft', 'pending-approval', 'published', 'rejected'] as const).map((s) => (
                  <div key={s} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <StatusTag status={s} />
                    </span>
                    <span className="ops-mono tabular-nums">{assets.byStatus[s] ?? 0}</span>
                  </div>
                ))}
              </div>
              <SubHead className="mt-4">Funded markets</SubHead>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {fundedMarkets.length === 0 && <Muted>No funded markets.</Muted>}
                {fundedMarkets.map((m) => (
                  <span key={m} className="ops-mono rounded border ops-hairline px-2 py-0.5 text-[11px] uppercase">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {assets.recentPublished.length > 0 && (
            <div className="mt-5">
              <SubHead>Recently published</SubHead>
              <div className="mt-2 space-y-2">
                {assets.recentPublished.slice(0, 4).map((a, i) => (
                  <div key={i} className="border-b ops-hairline pb-2 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-medium">{a.title}</span>
                      <span className="ops-mono text-[10px] uppercase tracking-[0.12em] lane-demand">{a.surface}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[color:var(--muted-foreground)]">
                      {a.canonicalQuestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  )
}

function EventFeed({ events, online }: { events: OpsEventRow[]; online: boolean }) {
  return (
    <section className="ops-card flex max-h-[820px] flex-col p-4 lg:sticky lg:top-4 lg:self-start">
      <div className="flex items-baseline gap-2.5 border-b ops-hairline pb-3">
        <span className="lane-core lane-dot self-center" aria-hidden />
        <h2 className="ops-display text-lg text-[color:var(--ink)]">Live event log</h2>
        <span className="ops-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
          both engines
        </span>
      </div>
      <div className="mt-3 flex-1 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <Muted>{online ? 'No events on the log yet.' : 'Offline.'}</Muted>
        ) : (
          <ol className="space-y-2">
            {events.map((e) => (
              <li key={e.id} className="flex items-start gap-2">
                <span className={`lane-${e.lane} lane-dot mt-1.5`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium">{e.eventType}</span>
                    <span className="ops-mono shrink-0 text-[10px] text-[color:var(--muted-foreground)]">
                      {t(e.occurredAt)}
                    </span>
                  </div>
                  <div className="ops-mono text-[10px] text-[color:var(--muted-foreground)]">
                    <span className={`lane-${e.lane}`}>{LANE_LABEL[e.lane]}</span>
                    {' · '}
                    {e.aggregateType}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

function Footer({ cockpit }: { cockpit: OpsCockpit }) {
  return (
    <footer className="mt-6 border-t ops-hairline pt-4 text-[11px] text-[color:var(--muted-foreground)]">
      Internal operations console. Read only in this cut. Derived and recomputable from the event log; it holds no
      fact that exists nowhere else, and every number traces to a real record or event. Snapshot at{' '}
      <span className="ops-mono">{t(cockpit.generatedAt)}</span> on {d(cockpit.generatedAt)}.
    </footer>
  )
}

/* Small primitives. */
function SubHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`ops-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)] ${className}`}>
      {children}
    </div>
  )
}
function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[color:var(--muted-foreground)]">{children}</p>
}
function InlineStat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className={`ops-mono text-sm font-semibold tabular-nums ${accent ?? ''}`}>{value.toLocaleString('en-US')}</span>
      <span className="text-[11px] text-[color:var(--secondary-foreground)]">{label}</span>
    </span>
  )
}
function EmptyState({ line }: { line: string }) {
  return <p className="py-6 text-center text-xs text-[color:var(--muted-foreground)]">{line}</p>
}
function StatusTag({ status }: { status: string }) {
  return (
    <span className={`ops-mono text-[10px] uppercase tracking-[0.1em] ${STATUS_ACCENT[status] ?? ''}`}>{status}</span>
  )
}
function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 shrink-0 capitalize text-[color:var(--secondary-foreground)]">{label}</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded bg-[color:var(--muted)]">
        <span className="block h-full rounded bg-[color:var(--chart-5)]" style={{ width: `${pct}%` }} />
      </span>
      <span className="ops-mono w-6 shrink-0 text-right tabular-nums">{value}</span>
    </div>
  )
}
