import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { ChevronLeft, Phone, User, FileText, Gauge, ShieldCheck, Download, Clock, MapPin, Calendar, Scale, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/firm/useAuth';
import EmptyState from '@/firm/EmptyState';
import { relativeTime, dollars } from '@/firm/useFirmData';

/**
 * The closing kit for one delivered opportunity, from the firm's real Glass Box.
 *
 * Everything visible is real and firm facing: the claimant and how to reach them,
 * their organized statement, the SCPS triage with its factor bars, the statute
 * status, and the HIPAA authorization executed in the firm's name. What is not
 * persisted (categorized photos, the parsed police report) is not shown rather
 * than mocked, and there is no fabricated case value. Nothing is estimated.
 */

const TEAL = '#22c58d';
const POS = '#34d39a';
const WARN = '#f5b544';

interface Detail {
  deliveryId: string;
  reference: string;
  caseType: string;
  market: string;
  deliveredAt: string | null;
  firmRespondedAt: string | null;
  slaBreached: boolean;
  claimant: { name: string; phone: string | null; email: string | null; location: string };
  statement: string;
  statuteOfLimitationsDate: string | null;
  evaluation: {
    scpsScore: number;
    scpsVersion: string;
    qualificationTier: string;
    injurySeverity: string;
    liabilityAssessment: string;
    statuteStatus: string;
    factors: { label: string; value: number }[];
  };
  hipaaExecutedInFirmName: boolean;
  evidence?: { photos: { kind: string; url: string }[]; documents: { kind: string; url: string }[] };
}

const EVIDENCE_KIND_LABEL: Record<string, string> = {
  wide: 'Wide scene', damage: 'Vehicle damage', plate: 'License plate', scene: 'Scene', injury: 'Injury',
  'insurance-card': 'Insurance card', 'police-report': 'Police report', other: 'Other',
};

const CASE_TYPE_LABEL: Record<string, string> = {
  'motor-vehicle-accident': 'Motor Vehicle Accident',
  'commercial-trucking-accident': 'Commercial Trucking Accident',
  'premises-liability': 'Premises Liability',
  'medical-malpractice': 'Medical Malpractice',
  'wrongful-death': 'Wrongful Death',
  'dog-bite': 'Dog Bite and Animal Attack',
};

export default function OpportunityDetailProduction() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const firmName = user?.firmName ?? 'your firm';
  const [detail, setDetail] = useState<Detail | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');
  const [firmId, setFirmId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{ phase: 'idle' | 'saving' | 'saved'; label?: string; costPerSignedCaseCents?: number | null }>({ phase: 'idle' });

  useEffect(() => {
    const m = window.location.pathname.match(/\/opportunity\/([^/]+)/);
    const deliveryId = m ? decodeURIComponent(m[1]) : '';
    let cancelled = false;
    (async () => {
      try {
        const cur = (await fetch('/api/firm/current').then((r) => r.json())) as { firmId: string | null };
        if (!cur.firmId || !deliveryId) { if (!cancelled) setStatus('empty'); return; }
        if (!cancelled) setFirmId(cur.firmId);
        const res = await fetch(`/api/firm/${encodeURIComponent(cur.firmId)}/opportunity/${encodeURIComponent(deliveryId)}`);
        if (!res.ok) { if (!cancelled) setStatus('empty'); return; }
        const d = (await res.json()) as Detail;
        if (!cancelled) { setDetail(d); setStatus('ready'); }
      } catch {
        if (!cancelled) setStatus('empty');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (status === 'loading') return <div className="min-h-screen bg-background" />;

  if (status === 'empty' || !detail) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-8 py-16">
          <button onClick={() => navigate('/opportunities')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Opportunities
          </button>
          <Card className="border-border">
            <EmptyState icon={FileText} title="Case not available" body="This opportunity could not be found in your market. It may belong to a different firm, or it has not been delivered yet." />
          </Card>
        </div>
      </div>
    );
  }

  const c = detail.claimant;
  const firstName = c.name.split(' ')[0] || 'the claimant';
  const nowMs = Date.now();
  const caseTypeLabel = CASE_TYPE_LABEL[detail.caseType] ?? detail.caseType;
  const responded = Boolean(detail.firmRespondedAt);

  const OUTCOME_LABEL: Record<string, string> = {
    retained: 'signed',
    'still-evaluating': 'still being worked',
    'not-retained': 'not signed',
  };

  async function submitOutcome(result: 'retained' | 'still-evaluating' | 'not-retained') {
    if (!firmId || !detail || outcome.phase === 'saving') return;
    setOutcome({ phase: 'saving' });
    try {
      const res = await fetch(`/api/firm/${encodeURIComponent(firmId)}/opportunity/${encodeURIComponent(detail.deliveryId)}/outcome`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ result }),
      });
      const data = (await res.json().catch(() => ({}))) as { acer?: { costPerSignedCaseCents?: number | null } };
      if (!res.ok) throw new Error('failed');
      setOutcome({ phase: 'saved', label: OUTCOME_LABEL[result], costPerSignedCaseCents: data.acer?.costPerSignedCaseCents ?? null });
      toast.success(`Recorded as ${OUTCOME_LABEL[result]}. Your cost per signed case just sharpened.`);
    } catch {
      setOutcome({ phase: 'idle' });
      toast.error('Could not record the outcome. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header + the action */}
      <div className="border-b border-white/[0.07] bg-background/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <button onClick={() => navigate('/opportunities')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" /> Opportunities
          </button>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-[26px] leading-none font-light tracking-tight text-foreground">{caseTypeLabel}</h1>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: responded ? POS : WARN, background: responded ? 'rgba(52,211,154,0.12)' : 'rgba(245,181,68,0.12)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: responded ? POS : WARN }} /> {responded ? 'Contacted' : 'Awaiting your call'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono">{detail.reference}</span> · {detail.market} · delivered {relativeTime(detail.deliveredAt, nowMs)}
              </p>
            </div>
            {c.phone && (
              <a
                href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: `linear-gradient(120deg, ${TEAL}, ${POS})`, color: '#052018' }}
              >
                <Phone className="w-4 h-4" /> Call {firstName} now
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* The case file */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claimant */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4" style={{ color: TEAL }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">The claimant</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <Field label="Name" value={c.name} />
              <Field label="Phone" value={c.phone ?? '—'} mono />
              {c.location && <Field label="Location" value={c.location} icon={MapPin} />}
              <Field label="Delivered" value={detail.deliveredAt ? new Date(detail.deliveredAt).toLocaleDateString() : '—'} icon={Calendar} />
            </div>
          </Card>

          {/* What happened */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" style={{ color: TEAL }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">What happened</h2>
              <span className="ml-auto text-[11px] text-muted-foreground">in their words, organized</span>
            </div>
            <p className="text-[15px] text-foreground leading-relaxed">{detail.statement || 'The claimant statement is being assembled.'}</p>
          </Card>

          {/* Categorized evidence, captured by the claimant during guided intake.
             Real photos and documents from the case file, each labeled by kind.
             Shown only when present; never mocked. */}
          {detail.evidence && (detail.evidence.photos.length > 0 || detail.evidence.documents.length > 0) && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" style={{ color: TEAL }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">The evidence</h2>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {detail.evidence.photos.length} photo{detail.evidence.photos.length === 1 ? '' : 's'}
                  {detail.evidence.documents.length > 0 ? `, ${detail.evidence.documents.length} document${detail.evidence.documents.length === 1 ? '' : 's'}` : ''}
                </span>
              </div>
              {detail.evidence.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {detail.evidence.photos.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="group block">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/[0.08] bg-muted/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt={EVIDENCE_KIND_LABEL[p.kind] ?? p.kind} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform" loading="lazy" />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1.5">{EVIDENCE_KIND_LABEL[p.kind] ?? p.kind}</p>
                    </a>
                  ))}
                </div>
              )}
              {detail.evidence.documents.length > 0 && (
                <div className="space-y-2">
                  {detail.evidence.documents.map((d, i) => (
                    <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-white/[0.08] px-4 py-2.5 hover:border-white/25 transition-colors">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground">{EVIDENCE_KIND_LABEL[d.kind] ?? d.kind}</span>
                      <Download className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                    </a>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Triage + actions */}
        <div className="space-y-6">
          {/* SCPS triage */}
          <Card className="p-6" style={{ background: 'linear-gradient(150deg, rgba(34,197,141,0.10), rgba(255,255,255,0.02))', borderColor: 'rgba(34,197,141,0.26)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4" style={{ color: TEAL }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">SCPS triage</h2>
              <span className="ml-auto text-[10px] text-muted-foreground">firm only · {detail.evaluation.scpsVersion}</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-[40px] leading-none font-light tabular-nums text-foreground">{detail.evaluation.scpsScore}</span>
              <span className="text-lg text-muted-foreground">%</span>
              <span className="ml-2 text-xs text-muted-foreground">tier {detail.evaluation.qualificationTier}</span>
            </div>
            <div className="space-y-2.5">
              {detail.evaluation.factors.map((f) => (
                <div key={f.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="text-foreground tabular-nums">{f.value}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-1 rounded-full" style={{ width: `${f.value}%`, background: TEAL }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Snapshot, real fields only */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Case snapshot</h2>
            <div className="space-y-3.5">
              <Row icon={Activity} label="Injury (documentation)" value={detail.evaluation.injurySeverity || '—'} />
              <Row icon={Scale} label="Liability (documentation)" value={detail.evaluation.liabilityAssessment || '—'} />
              <Row icon={Clock} label="Statute" value={detail.evaluation.statuteStatus || '—'} />
            </div>
          </Card>

          {/* HIPAA */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4" style={{ color: POS }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">HIPAA authorization</h2>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Executed by the claimant in the name of <b className="font-semibold">{firmName}</b>. Request records directly from providers, no waiting.
            </p>
            <a
              href={firmId ? `/api/firm/${encodeURIComponent(firmId)}/opportunity/${encodeURIComponent(detail.deliveryId)}/hipaa` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { if (!firmId) toast.error('Sign in to download the authorization.'); }}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold border border-white/[0.1] hover:border-white/25 transition-colors text-foreground"
            >
              <Download className="w-4 h-4" /> Download authorization
            </a>
          </Card>

          {/* Report the outcome. This is the moat's ignition: a reported outcome
             feeds the SCPS feedback loop and unlocks the firm's true cost per
             signed case. It never touches the fee (W4). */}
          <Card className="p-6">
            {outcome.phase === 'saved' ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4" style={{ color: POS }} />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Outcome recorded</h2>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Recorded as <b className="font-semibold">{outcome.label}</b>. This tunes your market intelligence and the signed case model.
                </p>
                {outcome.costPerSignedCaseCents != null && (
                  <div className="mt-4 rounded-lg p-4" style={{ background: 'rgba(34,197,141,0.08)', border: '1px solid rgba(34,197,141,0.2)' }}>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em] mb-1">Your true cost per signed case</p>
                    <p className="text-2xl font-light tabular-nums text-foreground">${dollars(outcome.costPerSignedCaseCents)}</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">After your call</h2>
                <p className="text-xs text-muted-foreground mb-4">One tap. It unlocks your true cost per signed case.</p>
                <div className="space-y-2.5">
                  <button disabled={outcome.phase === 'saving'} onClick={() => submitOutcome('retained')} className="w-full rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-60" style={{ color: '#052018', background: `linear-gradient(120deg, ${TEAL}, ${POS})` }}>
                    It signed
                  </button>
                  <button disabled={outcome.phase === 'saving'} onClick={() => submitOutcome('still-evaluating')} className="w-full rounded-lg py-2.5 text-sm font-medium border border-white/[0.1] hover:border-white/25 transition-colors text-foreground disabled:opacity-60">
                    Still working it
                  </button>
                  <button disabled={outcome.phase === 'saving'} onClick={() => submitOutcome('not-retained')} className="w-full rounded-lg py-2.5 text-sm font-medium border border-white/[0.1] hover:border-white/25 transition-colors text-muted-foreground disabled:opacity-60">
                    It did not sign
                  </button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono, icon: Icon }: { label: string; value: string; mono?: boolean; icon?: typeof MapPin }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-muted-foreground mb-1.5">{label}</p>
      <p className={`text-sm text-foreground flex items-center gap-1.5 ${mono ? 'font-mono' : ''}`}>
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
        {value}
      </p>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm mt-0.5 text-foreground">{value}</p>
      </div>
    </div>
  );
}
