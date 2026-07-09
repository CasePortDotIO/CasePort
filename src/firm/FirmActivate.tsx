import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * Set your password. A provisioned partner arrives here from their activation or
 * reset email with a single use token. They choose a password and are signed in.
 * CasePort is invite only, so this is where a partner first takes ownership of
 * their account; there is no public sign up.
 *
 * The token is validated by Payload's own reset machinery (the same collection
 * that authenticates a login), and on success Payload sets the session cookie, so
 * the partner lands in the dashboard already signed in.
 */
const TEAL = '#22c58d';

export default function FirmActivate() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token') ?? '';
    setToken(t);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Please choose a password of at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Those passwords do not match.');
      return;
    }
    if (!token) {
      setError('This link is missing its token. Please use the link from your email.');
      return;
    }
    setBusy(true);
    try {
      // Payload's own reset endpoint: validates the token, sets the password, and
      // signs the partner in by setting the session cookie.
      const res = await fetch('/api/firmUsers/reset-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        setError('This link has expired or was already used. Ask your CasePort contact to send a new one.');
        return;
      }
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
        <h1 className="text-2xl font-light tracking-tight text-foreground mb-1">Set your password</h1>
        <p className="text-sm text-muted-foreground mb-8">Choose a password to sign in to your dashboard.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5 block">New password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5 block">Confirm password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm" style={{ color: '#fb7185' }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
            style={{ background: `linear-gradient(120deg, ${TEAL}, #34d39a)`, color: '#052018' }}
          >
            {busy ? 'Setting your password…' : 'Set password and sign in'}
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: TEAL }} /> Access to CasePort is by invitation to partner firms.
        </p>
      </div>
    </div>
  );
}
