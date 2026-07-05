import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import {
  ChevronLeft, Phone, MapPin, Calendar, ShieldCheck, FileText, Camera, Image as ImageIcon,
  Gauge, Scale, Clock, FileCheck2, Download, ArrowUpRight, User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/firm/useAuth';

/*
 * The closing kit (Section 7 step 5). The screen a partner opens on a delivered
 * case where the involuntary thought is "I could sign this on the first call".
 * Everything is already done and visible, no tabs to dig through: the claimant
 * and how to reach them, their organized statement, the categorized evidence
 * with severity, the parsed police report, the SCPS triage, the statute clock,
 * and the HIPAA authorization already executed in the firm's name. All they do
 * is call and sign.
 */

const TEAL = '#22c58d';
const POS = '#34d39a';
const WARN = '#f5b544';
const NEG = '#fb7185';

interface Kit {
  id: string;
  caseType: string;
  market: string;
  receivedAgo: string;
  claimant: { name: string; phone: string; location: string; incidentDate: string };
  statement: string;
  facts: string[];
  photos: { group: string; icon: typeof Camera; items: { label: string; severity?: 'severe' | 'moderate' | 'mild' }[] }[];
  police: { number: string; finding: string; filed: string };
  scps: number;
  factors: { label: string; value: number }[];
  injury: string;
  liability: string;
  estValue: string;
  insurance: string;
  statuteDays: number;
}

function buildKit(id: string): Kit {
  return {
    id,
    caseType: 'Motor Vehicle Accident',
    market: 'Houston, TX',
    receivedAgo: '6 minutes ago',
    claimant: { name: 'Marcus Delgado', phone: '+1 (713) 555-0148', location: 'Houston, TX 77002', incidentDate: 'July 2, 2026' },
    statement:
      'I was stopped at the light on Smith Street when a delivery truck ran the red and hit the driver side of my car. My neck and lower back started hurting that evening. I went to the emergency room the next morning and I have a follow up with a physical therapist this week. The other driver got a ticket at the scene.',
    facts: [
      'Rear and side impact at a signaled intersection, claimant was stopped',
      'Emergency room visit within 24 hours, physical therapy scheduled',
      'Other driver cited at the scene',
    ],
    photos: [
      { group: 'Scene', icon: MapPin, items: [{ label: 'Intersection, wide' }, { label: 'Traffic signal' }, { label: 'Skid marks' }] },
      { group: 'Vehicle damage', icon: Camera, items: [{ label: 'Driver door', severity: 'severe' }, { label: 'Front quarter panel', severity: 'moderate' }] },
      { group: 'Injuries', icon: ImageIcon, items: [{ label: 'Neck bruising', severity: 'moderate' }, { label: 'Left wrist', severity: 'mild' }] },
    ],
    police: { number: 'HPD-2026-118437', finding: 'Other driver cited for failure to obey a traffic signal.', filed: 'July 2, 2026' },
    scps: 87,
    factors: [
      { label: 'Injury verification', value: 90 },
      { label: 'Liability clarity', value: 95 },
      { label: 'Statute headroom', value: 100 },
      { label: 'Case type match', value: 88 },
    ],
    injury: 'Neck and lower back, soft tissue with ongoing treatment',
    liability: 'Clear, other party cited, police report on file',
    estValue: '$45,000 - $85,000',
    insurance: 'Commercial auto, $250K liability limit',
    statuteDays: 548,
  };
}

const sevColor = (s?: 'severe' | 'moderate' | 'mild') => (s === 'severe' ? NEG : s === 'moderate' ? WARN : POS);

export default function OpportunityDetailProduction() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const firmName = user?.firmName ?? 'your firm';
  const [kit, setKit] = useState<Kit | null>(null);

  useEffect(() => {
    const m = window.location.pathname.match(/\/opportunity\/([^/]+)/);
    setKit(buildKit(m ? decodeURIComponent(m[1]) : 'CP-2026-000089'));
  }, []);

  if (!kit) return <div className="min-h-screen bg-background" />;
  const c = kit.claimant;
  const firstName = c.name.split(' ')[0];

  const report = (label: string) => toast.success(`Recorded as ${label}. Your cost per signed case just sharpened.`);

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
                <h1 className="text-[26px] leading-none font-light tracking-tight text-foreground">{kit.caseType}</h1>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: WARN, background: 'rgba(245,181,68,0.12)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: WARN }} /> Awaiting your call
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono">{kit.id}</span> · {kit.market} · delivered {kit.receivedAgo}
              </p>
            </div>
            <a
              href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(120deg, ${TEAL}, ${POS})`, color: '#052018' }}
            >
              <Phone className="w-4 h-4" /> Call {firstName} now
            </a>
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
              <Field label="Phone" value={c.phone} mono />
              <Field label="Location" value={c.location} icon={MapPin} />
              <Field label="Incident" value={c.incidentDate} icon={Calendar} />
            </div>
          </Card>

          {/* What happened */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" style={{ color: TEAL }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">What happened</h2>
              <span className="ml-auto text-[11px] text-muted-foreground">in their words, organized</span>
            </div>
            <p className="text-[15px] text-foreground leading-relaxed mb-5">{kit.statement}</p>
            <div className="space-y-2">
              {kit.facts.map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TEAL }} />
                  {f}
                </div>
              ))}
            </div>
          </Card>

          {/* Evidence */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Camera className="w-4 h-4" style={{ color: TEAL }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Evidence</h2>
              <span className="ml-auto text-[11px] text-muted-foreground">categorized · signed, expiring links</span>
            </div>
            <div className="space-y-5">
              {kit.photos.map((grp) => {
                const Icon = grp.icon;
                return (
                  <div key={grp.group}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground">{grp.group}</span>
                      <span className="text-[11px] text-muted-foreground">· {grp.items.length}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {grp.items.map((it) => (
                        <div key={it.label} className="rounded-lg overflow-hidden border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <div className="h-24 grid place-items-center" style={{ background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 10px, transparent 10px 20px)' }}>
                            <Camera className="w-5 h-5 text-white/20" />
                          </div>
                          <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                            <span className="text-xs text-foreground truncate">{it.label}</span>
                            {it.severity && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide flex-shrink-0" style={{ color: sevColor(it.severity) }}>{it.severity}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Police report, parsed */}
              <div className="rounded-lg p-4 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck2 className="w-4 h-4" style={{ color: POS }} />
                  <span className="text-xs font-semibold text-foreground">Police report, parsed</span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground">{kit.police.number}</span>
                </div>
                <p className="text-sm text-foreground">{kit.police.finding}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5">Filed {kit.police.filed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Triage + actions */}
        <div className="space-y-6">
          {/* SCPS triage */}
          <Card className="p-6" style={{ background: 'linear-gradient(150deg, rgba(34,197,141,0.10), rgba(255,255,255,0.02))', borderColor: 'rgba(34,197,141,0.26)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4" style={{ color: TEAL }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">SCPS triage</h2>
              <span className="ml-auto text-[10px] text-muted-foreground">firm only · v1</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-[40px] leading-none font-light tabular-nums text-foreground">{kit.scps}</span>
              <span className="text-lg text-muted-foreground">%</span>
            </div>
            <div className="space-y-2.5">
              {kit.factors.map((f) => (
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

          {/* Snapshot */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Case snapshot</h2>
            <div className="space-y-3.5">
              <Row icon={ImageIcon} label="Injury" value={kit.injury} />
              <Row icon={Scale} label="Liability" value={kit.liability} />
              <Row icon={ArrowUpRight} label="Estimated value" value={kit.estValue} accent />
              <Row icon={ShieldCheck} label="Insurance" value={kit.insurance} />
              <Row icon={Clock} label="Statute" value={`${kit.statuteDays} days remaining`} />
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
            <button
              onClick={() => toast.success('HIPAA authorization downloaded.')}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold border border-white/[0.1] hover:border-white/25 transition-colors text-foreground"
            >
              <Download className="w-4 h-4" /> Download authorization
            </button>
          </Card>

          {/* Report the outcome */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">After your call</h2>
            <p className="text-xs text-muted-foreground mb-4">One tap. It unlocks your true cost per signed case.</p>
            <div className="space-y-2.5">
              <button onClick={() => report('signed')} className="w-full rounded-lg py-2.5 text-sm font-semibold transition-colors" style={{ color: '#052018', background: `linear-gradient(120deg, ${TEAL}, ${POS})` }}>
                It signed
              </button>
              <button onClick={() => report('still being worked')} className="w-full rounded-lg py-2.5 text-sm font-medium border border-white/[0.1] hover:border-white/25 transition-colors text-foreground">
                Still working it
              </button>
              <button onClick={() => report('not signed')} className="w-full rounded-lg py-2.5 text-sm font-medium border border-white/[0.1] hover:border-white/25 transition-colors text-muted-foreground">
                It did not sign
              </button>
            </div>
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

function Row({ icon: Icon, label, value, accent }: { icon: typeof MapPin; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm mt-0.5" style={accent ? { color: TEAL, fontWeight: 600 } : { color: 'var(--foreground)' }}>{value}</p>
      </div>
    </div>
  );
}
