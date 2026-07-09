import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';

/**
 * Request a set your password link. A partner who forgot their password enters
 * their email and receives a link. The response is the same whether or not the
 * email is on file, so no one can probe which firms have an account.
 */
const TEAL = '#22c58d';

export default function FirmForgot() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch('/api/firm/forgot-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // The message is the same on success or failure, so nothing to surface.
    } finally {
      setBusy(false);
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-primary text-primary-foreground grid place-items-center text-xs font-bold">CP</div>
          <span className="text-sm font-semibold text-foreground">CasePort</span>
        </div>

        {sent ? (
          <>
            <h1 className="text-2xl font-light tracking-tight text-foreground mb-2">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-8">
              If that email is on a CasePort account, a link to set a new password is on its way. It expires in a few days.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-light tracking-tight text-foreground mb-1">Reset your password</h1>
            <p className="text-sm text-muted-foreground mb-8">Enter your email and we will send you a link to set a new one.</p>
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
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
                style={{ background: `linear-gradient(120deg, ${TEAL}, #34d39a)`, color: '#052018' }}
              >
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </>
        )}

        <button onClick={() => navigate('/login')} className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" style={{ color: TEAL }} /> Back to sign in
        </button>
      </div>
    </div>
  );
}
