import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Phone, ShieldCheck, Inbox, PhoneCall, PenLine, ArrowRight, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import EmptyState from '@/firm/EmptyState';

const TEAL = '#22c58d';
const WARN = '#f5b544';

/*
 * The first login. A brand new firm has no cases, no signed outcomes, no
 * history, so showing metric cards full of zeros (or worse, fake numbers) would
 * be dishonest and cold. Instead: welcome them by name, tell them their market
 * is live, show them plainly how CasePort works in three steps, and point at the
 * one thing to do now. No jargon, no dashboard to decode, no guidance needed.
 */
const steps = [
  {
    n: 1,
    icon: Inbox,
    title: 'Cases arrive, exclusively yours',
    body: 'Qualified personal injury opportunities in your Houston market, delivered as a worked-up case file. One firm per market. Never shared.',
  },
  {
    n: 2,
    icon: PhoneCall,
    title: 'You call within your window',
    body: 'The moment a case lands we notify you. Reach the claimant inside your 15 minute callback window, while they are still expecting you.',
  },
  {
    n: 3,
    icon: PenLine,
    title: 'You report the outcome',
    body: 'One tap tells us what signed. Your true cost per signed case and your market intelligence sharpen with every case you close.',
  },
];

export default function DashboardFirstRun({ firstName, walletFunded = false }: { firstName: string; walletFunded?: boolean }) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-8 py-14">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: TEAL }}>
            Welcome to CasePort
          </p>
          <h1 className="text-[34px] leading-tight font-light tracking-tight text-foreground mb-3">
            You&rsquo;re set up, {firstName}.
          </h1>
          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            Your Houston market is live and exclusive to your firm. Here is exactly how it works, and the one thing to do now.
          </p>
        </motion.div>

        {/* The single next action, honest about state. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          {walletFunded ? (
            <div
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: 'linear-gradient(120deg, rgba(34,197,141,0.10), transparent 60%)', border: '1px solid rgba(34,197,141,0.26)' }}
            >
              <span className="grid place-items-center rounded-full flex-shrink-0" style={{ width: 44, height: 44, background: 'rgba(34,197,141,0.16)' }}>
                <Phone className="w-5 h-5" style={{ color: TEAL }} />
              </span>
              <div>
                <p className="text-base font-semibold text-foreground">Your market is active. First cases are on the way.</p>
                <p className="text-sm text-muted-foreground mt-0.5">Keep your phone close. The moment a case is delivered, we call you.</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/wallet')}
              className="w-full text-left rounded-2xl p-5 flex items-center justify-between gap-4 group transition-colors"
              style={{ background: 'linear-gradient(120deg, rgba(245,181,68,0.10), transparent 60%)', border: '1px solid rgba(245,181,68,0.28)' }}
            >
              <div className="flex items-center gap-4">
                <span className="grid place-items-center rounded-full flex-shrink-0" style={{ width: 44, height: 44, background: 'rgba(245,181,68,0.16)' }}>
                  <Wallet className="w-5 h-5" style={{ color: WARN }} />
                </span>
                <div>
                  <p className="text-base font-semibold text-foreground">Fund your wallet to activate your market</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Cases are delivered against your pre-funded balance. This is the only step left.</p>
                </div>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold pr-1" style={{ color: WARN }}>
                Fund wallet <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          )}
        </motion.div>

        {/* How it works, a real three step sequence, so numbering is honest. */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-foreground mb-5">How CasePort works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <Card className="p-6 h-full border-white/[0.08]" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008))' }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="grid place-items-center rounded-lg" style={{ width: 38, height: 38, background: 'rgba(34,197,141,0.10)' }}>
                        <Icon className="w-5 h-5" style={{ color: TEAL }} />
                      </span>
                      <span className="text-2xl font-light tabular-nums" style={{ color: 'rgba(255,255,255,0.16)' }}>{s.n}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* The opportunities surface, empty but expectant. */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your opportunities</h2>
          <Card className="border-white/[0.08]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)' }}>
            <EmptyState
              icon={Inbox}
              title="Your first case will appear here"
              body="The moment a personal injury opportunity is delivered to your market, you will see it here and we will call you to act within your window."
            />
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center gap-2.5 text-[13px] text-muted-foreground"
        >
          <ShieldCheck className="w-4 h-4" style={{ color: TEAL }} />
          Every figure you will see traces to your ledger and your market. Nothing is estimated, nothing is shared.
        </motion.div>
      </div>
    </div>
  );
}
