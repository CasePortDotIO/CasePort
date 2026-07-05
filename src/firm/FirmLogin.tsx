import { useState } from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck } from 'lucide-react';

/**
 * The firm partner login. Authenticates against the firmUsers auth collection
 * (/api/firmUsers/login). On success Payload sets the session cookie and every
 * firm read is thereafter scoped to that partner's firm, from the session, not a
 * path parameter. Calm and minimal: a partner should never wonder what to do.
 */
const TEAL = '#22c58d';

export default function FirmLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/firmUsers/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError('That email or password was not recognized.');
        return;
      }
      // Full navigation so the session cookie is picked up everywhere.
      window.location.href = '/firm';
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-primary text-primary-foreground grid place-items-center text-xs font-bold">CP</div>
          <span className="text-sm font-semibold text-foreground">CasePort</span>
        </div>
        <h1 className="text-2xl font-light tracking-tight text-foreground mb-1">Partner sign in</h1>
        <p className="text-sm text-muted-foreground mb-8">Your market, your ledger, your cases.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm" style={{ color: '#fb7185' }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
            style={{ background: `linear-gradient(120deg, ${TEAL}, #34d39a)`, color: '#052018' }}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <button onClick={() => navigate('/')} className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: TEAL }} /> Explore the demo without signing in
        </button>
      </div>
    </div>
  );
}
